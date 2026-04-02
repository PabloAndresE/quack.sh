# TODOS — quack.sh

## P1 — Pre-launch

- [ ] **Set Anthropic API monthly spending cap** — Even with Haiku (cheap), set a $20/month cap as a backstop. Manual task in Anthropic dashboard. Takes 2 minutes.

## P1 — Post-launch (first week)

- [ ] **Iterate on el pato's system prompt** — The voice guidelines are strong, but the actual prompt needs tuning after real conversations. Edge cases to handle: non-debugging questions ("what's the meaning of life?"), frustrated/swearing users, users trying to have a normal conversation. Requires real usage data. Effort: M (human: ~2h / CC: ~30 min).
- [ ] **Test on actual mobile device** — The CSS handles basic mobile responsiveness, but test on a real phone (iOS Safari, Android Chrome) before the Twitter launch post. 80%+ of Twitter traffic is mobile.

## Deferred — Future versions

- [ ] **Upgrade to Sonnet** — If quack.sh gets traction and el pato's voice quality matters more, upgrade from Haiku to Sonnet. Will need proper rate limiting (Upstash Redis) at that point.
- [ ] **Shareable session links ("thinking maps")** — Not the solution, but the map of how you got there. Requires persistence layer. From 10x vision.
- [ ] **Public /prompt page** — Radical transparency (Approach C). Cool but adds jailbreak surface area. Revisit after v1 is stable.
- [ ] **Custom duck SVG** — Open question from design doc. Current plan is a simple silhouette. Consider a custom illustration that becomes the brand mark.
- [ ] **Proper distributed rate limiting** — In-memory rate limiting doesn't survive serverless cold starts. If abuse becomes a problem, add Upstash Redis + @upstash/ratelimit.
