---
title: On-chain Trading Agent
banner: /works/chain-agent/banner.jpg
year: Jul 2026 – present
role: Independent Project
tags: [Polygon, Async daemons, Multi-layer risk guards, RPC failover, On-chain reconciliation]
---

I wanted to see whether an AI agent can be trusted with real money. This autonomous trading engine on Polygon is my answer. Asynchronous daemons run around the clock (signal → execution → settlement → audit), taking a signal all the way to an on-chain order with zero manual intervention.

It currently manages 26 active positions across multiple accounts, with an 8-second end-to-end latency from signal to on-chain order.

But autonomous doesn't mean unguarded: every signal must clear 5 risk guards before it trades — a 62% directional win rate on early settled positions; multi-node RPC failover keeps the system at zero downtime; and an independent reconciliation layer trusts no local records, recomputing equity straight from chain state. It proves that agents can run in production — and the proof is verified with real money.
