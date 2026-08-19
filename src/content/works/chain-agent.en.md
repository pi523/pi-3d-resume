---
title: On-chain Trading Agent
banner: /works/chain-agent/banner.jpg
role: Independent Project
tags: [Polygon, Autonomous Agent, Web3]
---

I wanted to see whether an AI agent can be trusted with real money. This autonomous trading engine on Polygon is my answer. Asynchronous daemons run around the clock (signal → execution → settlement → audit), taking a signal all the way to an on-chain order with zero manual intervention.

But autonomous doesn't mean unguarded: every signal must clear 5 risk guards before it trades; multi-node RPC failover keeps the system at zero downtime; and an independent reconciliation layer trusts no local records, recomputing equity straight from chain state. It proves that agents can run in production — and the proof is verified with real money.
