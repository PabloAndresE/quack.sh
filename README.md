Readme · MD
Copy

# quack.sh
 
> *el pato won't give you the answer — you already have it*
 
---

A rubber duck debugger powered by AI. The core insight: the best AI tools aren't the ones that give you answers fastest — they're the ones that help you think.

---
 
Every AI tool today is optimized for the same thing: getting you an answer as fast as possible. You type half a sentence and Copilot finishes it. You describe a bug and ChatGPT gives you the fix. You paste an error and the answer appears before you've even read it.
 
This is making us worse at the thing that actually matters — **thinking through problems**.
 
There's a 50-year-old technique that every senior dev knows works: explain your problem out loud to someone who doesn't understand it. A rubber duck. A colleague. A houseplant. Nine times out of ten, you find the answer yourself mid-sentence. The act of articulating the problem *is* the debugging.
 
quack.sh is built on that insight — and takes it seriously enough to be radical about it.
 
**el pato never gives you the answer.** Not because it doesn't know. Because the moment it does, you stop thinking.
 
---
## Why

- AI tools are making devs dependent on getting answers instead of thinking
- Devs often can't articulate their problems well, which is itself the bug
- Debugging is lonely — there's no one to think out loud with
- Current tools don't teach you to reason, they teach you to copy

## How it works

You describe what's broken. El pato asks questions. Short, direct, one at a time. It reads between the lines - if you've been stuck for two hours, it asks about your original assumption. If you answer your own question mid-sentence, it says: "you just answered it. did you notice?"

El pato never says "have you tried X?" - that encodes the answer. It never says "it could be a race condition" - that's a diagnosis. It only asks questions that direct your attention. The thinking is yours.

```
el pato:  what's broken?
you:      my useEffect is firing twice on mount and I don't know why
el pato:  you said you don't know why. how long have you been looking at this?
you:      honestly like two hours
el pato:  what's the first thing you assumed when it started happening?
you:      that the effect was running twice because of a dependency change...
          but actually I never checked. I'm in StrictMode.
```
 
El pato never mentioned StrictMode. You got there yourself.
 

## The constraint is the feature

There are 17+ AI rubber duck debugging tools. Every single one makes the same mistake: they try to make the rubber duck smarter by giving it the ability to answer. But the original insight of rubber duck debugging is that the duck doesn't need to answer — *you* answer by articulating. The duck is silent.
 
quack.sh is the only tool faithful to the original technique while improving it. El pato asks better questions than a silent rubber duck would provoke. Everyone else is building smarter ducks that talk. quack.sh is building a duck that asks the right questions so you talk better.
 
There is no hint mode. There is no "just this once" escape hatch. The constraint is the product.
 

## Run locally

```bash
git clone https://github.com/your-username/quack.sh
cd quack.sh
npm install
cp .env.example .env.local  # add your Gemini API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech stack

- Next.js 15 (App Router)
- Google Gemini Flash (free tier)
- No database — sessions are fully ephemeral
- Deployed on Vercel

5 files of real code. The product lives in the system prompt and the CSS.
 
---
 
## The system prompt
 
The system prompt lives in [`lib/prompt.ts`](./lib/prompt.ts). It's the primary artifact of this project — more important than any of the code. Read it. It's short and every decision has a comment.
 
If you find a way to make el pato ask better questions without breaking character, open a PR.
 
---
 
## Sessions
 
Sessions are ephemeral by design. When you close the tab, the conversation is gone. No account, no history, no saved transcripts.
 
This isn't a limitation — it's a feature. The value was in the thinking, not the transcript. You come, you think, you leave.
 
---
 
## Contributing
 
Issues and PRs welcome. A few things worth noting:
 
- Don't add features that give el pato the ability to answer. That's not a bug to fix.
- The 300-line budget is intentional. Resist the urge to add abstractions.
- If you're improving the system prompt, test it against at least 10 real debugging sessions before opening a PR.
 
---

## License

MIT
