---
title: 链上自动化交易 Agent
banner: /works/chain-agent/banner.jpg
role: 独立项目
tags: [Polygon, Autonomous Agent, Web3]
---

我想验证一个 AI Agent 能不能被信任去管真金白银。这套跑在 Polygon 上的自主交易引擎就是我的答案。异步守护进程昼夜接力(信号 → 执行 → 结算 → 审计),从捕捉信号到链上下单,全程无人工干预。

但"自主"不等于"放任":每个信号要闯过 5 道风控才能成交;多节点 RPC 容错让系统保持零宕机;还有一个独立对账层,不信任何本地记录,直接从链上状态重算权益。证明了 Agent 能上生产环境,而这个证明是通过真钱验证的。
