---
title: ShieldFlow
banner: /works/shieldflow/banner.jpg
role: 独立项目
tags: [Multi-Agent, Data Analysis, Sandbox]
---

把数据分析交给 AI,最难的不是让它生成代码,而是敢不敢跑它生成的代码。ShieldFlow 用一组各司其职的智能体回答这个问题:Coordinator 拆解任务、Analyst 编写分析代码、Verifier 校验结果——自然语言进,交互式 Plotly 图表出;执行报错会自动触发自我修正循环,改完再跑,不用人插手。

而信任来自约束:所有生成代码先过 AST 静态审计,再进网络隔离的 Docker 沙箱执行;Schema RAG 把数据列的真实样本和类型精准注入提示词,大幅减少复杂数据集上的字段映射错误。每一步可检查、可追溯——这是我对"多智能体系统怎样才算可信"的一次完整回答。
