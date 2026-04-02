"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const userScrolledRef = useRef(false);

  const hasEnded = messages.length >= 30;
  const MAX_LENGTH = 2000;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    if (!userScrolledRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleScroll = () => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    userScrolledRef.current = scrollHeight - scrollTop - clientHeight > 100;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || hasEnded || !isOnline) return;

    setError(null);
    const userMessage: Message = { role: "user", content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    if (!hasStarted) setHasStarted(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        setError("slow down. thinking takes time.");
        setIsLoading(false);
        return;
      }

      if (!res.ok || !res.body) {
        setError("something went wrong. try again?");
        setIsLoading(false);
        if (newMessages.length <= 1) {
          setHasStarted(false);
          setMessages([]);
        }
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              setError(parsed.error);
              break;
            }
            if (parsed.replace) {
              assistantContent = parsed.replace;
            } else if (parsed.text) {
              assistantContent += parsed.text;
            }
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: assistantContent,
              };
              return updated;
            });
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("something went wrong. try again?");
        if (newMessages.length <= 1) {
          setHasStarted(false);
          setMessages([]);
        }
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const retry = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;
    setMessages((prev) => prev.slice(0, -1));
    setInput(lastUserMsg.content);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="app">
      <header className="header">
        <Image src="/elpato-wordmark.svg" alt="quack.sh" className="wordmark" width={120} height={39} priority />
        <div className="status">
          <div className={`status-dot ${isOnline ? "" : "offline"}`} />
          {isOnline ? "listening" : "offline"}
        </div>
      </header>

      <div
        className="chat"
        ref={chatRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
      >
        {!hasStarted ? (
          <div className="empty-state">
            <div className="tagline">
              <em>el pato </em> won&apos;t give you the answer &mdash; you
              already have it
            </div>
            <div className="subtitle">start typing to think out loud</div>
          </div>
        ) : (
          <div className="messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${msg.role === "assistant" ? "pato" : "user"}`}
              >
                <span className="message-label">
                  {msg.role === "assistant" ? "el pato" : "you"}
                </span>
                <div className="message-bubble">{msg.content}</div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="message pato">
                <span className="message-label">el pato</span>
                <div className="typing" aria-hidden="true">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            {hasEnded && (
              <div className="session-ended">
                session complete. refresh to start a new one.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            className="input-field"
            rows={1}
            placeholder="describe what's broken..."
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_LENGTH))}
            onKeyDown={handleKeyDown}
            disabled={isLoading || hasEnded || !isOnline}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading || hasEnded || !isOnline}
            aria-label="Send message"
          >
            &#8593;
          </button>
        </div>
        <div className="input-hint">
          {error ? (
            <span className="error-text">
              {error}{" "}
              {error.includes("try again") && (
                <button className="retry-link" onClick={retry}>
                  retry
                </button>
              )}
            </span>
          ) : hasEnded ? (
            "session complete. refresh to start again."
          ) : (
            "el pato only asks questions. never answers."
          )}
        </div>
      </div>
    </main>
  );
}
