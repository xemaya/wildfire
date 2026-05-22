# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

This repo is **pre-implementation**. The only meaningful files are:

- `prd.md` — the locked product spec for 《星火 Wildfire》（V1.1, MVP 实施锁定版）
- `card_concept.png` — a visual concept image for cards

There is no source code, no package manifest, no build/lint/test tooling yet. When the user asks for implementation, treat `prd.md` as the source of truth and confirm tech stack choices before scaffolding — the PRD specifies *what* to build (frontend / backend / AI roles) but leaves *how* (framework, language, hosting) open.

## What this product is — and is not

《星火 Wildfire》is an **AI 战略抽卡产品** ("strategic card-drawing"), not a chatbot, not divination, not a quotes app. The PRD locks several principles that any implementation must respect:

- **Single entry point is card drawing.** No input box, no chat, no Q&A, no long-form interaction. The user does not type a question.
- **Not divination.** No fortune, luck prediction, "you will succeed" framing. Position output as *strategic situation analysis*.
- **Not a quotes tool.** Each card must carry a strategic concept + modern interpretation + an action bias — never bare slogans or 鸡汤.

If a feature request conflicts with these (e.g. "add a chat input", "let the user pick cards", "show a daily horoscope"), surface the conflict against the PRD before building it.

## Core mechanics (locked by PRD)

- **Six card systems** — Situation 局势 / Strategy 战略 / Action 行动 / Morale 情绪 / Organization 组织 / Contradiction 矛盾.
- **Draw rule:** randomly pick **3 different** card systems, then draw 1 card from each. Same-system duplicates are forbidden. Users cannot manually pick cards.
- **Flip order is randomized** (don't always flip 局势 first) at ~0.8s per card, with paper/telegram/shuffle SFX.
- **Card schema** (every card has exactly 4 fields): `card_title` (2–6 chars, strategic tone, not colloquial), `card_desc` (2–3 sentences, modern language, staff-officer voice), `action_hint` (one action direction), 原始思想 (original Mao-selection quote or source, ≤2 lines).
- **AI output is a fixed JSON shape** with these keys exactly: `situation`, `risk`, `advice`, `command` — one short sentence each. See `prd.md` §11. Do not add, rename, or nest fields.
- **AI input** is the three drawn cards (`card_type`, `card_title`, `card_desc`, `action_hint`) plus optionally the last 5 draws for continuity.
- **AI persona** is a cold, restrained, long-termist "战略参谋". The full system prompt is locked in `prd.md` §12 — reuse it verbatim; do not paraphrase. Forbidden vocabulary: 命中注定, 宇宙, 能量, 好运, 你一定会成功. Preferred vocabulary: 战线, 节奏, 根据地, 局势, 主动权, 组织度, 风险, 推进.
- **History** is rendered as a **战略时间线** (see PRD §7 for the exact card-stamp format), never as a plain list.
- **Collection view (战略档案库):** unlocked cards display normally; locked cards show `？？？` with no content leak.

## Visual language (locked)

Target aesthetic: **战时参谋部** — strategic archive, war map, military intel, mimeograph, Republican-era files, industrial-era control room. Materials must read as paper texture, stamps, ink, old maps, worn edges.

Palette:

| Role | Color |
|------|-------|
| Background | 深炭黑 (deep charcoal) |
| Card | 牛皮纸黄 (kraft yellow) |
| Accent | 铁锈红 (rust red) |
| Secondary | 军绿 / 深灰 |
| Text | 深墨黑 |

Forbidden directions: 红色文创, 政宣风, 学习软件感, 二次元, 科技 AI 蓝光风. If asked for a "modern AI gradient" or similar, push back — it violates the PRD.

## Architecture intent (from PRD §13)

- **Frontend** — draw animation, card rendering, timeline, share images.
- **Backend** — card pool, draw logic (enforce the "3 distinct systems" rule server-side), AI orchestration, history persistence.
- **AI layer** — only generates the 战略简报 JSON; it does not chat, decide, comfort, or predict.

No framework is mandated. When scaffolding, ask the user which stack to use before committing.

## Working with `prd.md`

Sections in the PRD marked "锁死" (locked) are non-negotiable design contracts, not suggestions. When in doubt, quote the relevant locked section back to the user before deviating. The PRD is written in Chinese; preserve Chinese terminology (卡名, 军令, 战略简报, etc.) in user-facing strings and code identifiers where it improves clarity.
