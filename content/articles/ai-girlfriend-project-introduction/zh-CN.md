---
title: AI-Girlfriend 项目介绍
date: 2026.05
category: 项目介绍 / AI Companion
summary: AI-Girlfriend 是一套面向虚拟陪伴、语音对话和 AI VTuber 场景的角色运行系统，把实时语音、Live2D、长期记忆、动态人格、Agent 与工具调用串成完整链路。
tags:
  - AI Companion
  - Live2D
  - Agent
  - Voice AI
  - Long-term Memory
cover: ./assets/gallery/gallery-04.png
---

## 项目概览

AI-Girlfriend 是一套面向虚拟陪伴、语音对话和 AI VTuber 场景的角色运行系统。它不是单纯把大语言模型接进聊天框，而是把 **实时语音交互、Live2D 角色表现、长期记忆、动态人格、Agent 执行能力和工具调用** 串成了一条完整链路，让 AI 角色具备更强的连续性、表现力和可扩展性。

从代码结构看，项目后端基于 FastAPI 与 WebSocket 构建，前端负责交互界面和 Live2D 展示，后端则负责 ASR、LLM / Agent、TTS、VAD、MCP 工具、会话历史、角色配置等核心能力的调度。项目整体采用模块化设计，不同能力通过工厂模式和配置系统接入，适合继续二次开发。

---

## 核心定位：有性格、有记忆、会行动的 AI 角色系统

AI-Girlfriend 的核心价值不只是“能聊天”，而是让 AI 角色更像一个持续存在的虚拟角色：

- **有性格**：通过 Personality Engine 维护角色状态，让语气、表达方式和互动策略随对话动态变化。
- **有记忆**：通过 Character Memory 保存和检索长期信息，不只是回放聊天记录。
- **会行动**：通过 Agent 系统和 MCP 工具调用，让角色可以接入外部能力，而不是只能输出文本。
- **能表达**：通过语音、Live2D 表情和实时交互，形成更接近陪伴应用的体验。

因此，它更适合被理解为一个“AI 角色运行时”，而不是一个普通聊天机器人 Demo。

---

## 功能模块说明

### 1. 实时交互与 WebSocket 通信

项目使用 FastAPI 搭建服务端，并通过 WebSocket 与前端保持实时通信。WebSocket 层负责接收用户输入、音频数据、控制信号和配置切换请求，同时向前端推送文本、音频、Live2D 模型信息、会话状态等内容。

主要能力包括：

- 建立和维护客户端连接；
- 接收文本输入与麦克风音频数据；
- 支持对话触发、主动发言和打断信号；
- 支持配置切换、历史记录读取和角色状态同步；
- 支持单人会话与群组会话；
- 通过静态资源服务提供前端、Live2D 模型、头像、背景和缓存音频。

这一层相当于整个项目的通信枢纽，把前端交互和后端智能能力连接起来。

---

### 2. 语音输入 ASR 模块

ASR 模块负责把用户语音转换为文本，是语音交互链路的入口。项目支持多种语音识别后端，既可以使用本地模型，也可以接入云端服务。

支持或预留的 ASR 方案包括：

- sherpa-onnx；
- FunASR；
- Faster-Whisper；
- Whisper.cpp；
- OpenAI Whisper；
- Groq Whisper；
- Azure ASR。

ASR 通过配置文件选择具体实现，后端通过工厂类创建对应引擎。这样的设计降低了更换识别模型的成本，也方便根据设备性能、语言场景和延迟要求选择不同方案。

---

### 3. 语音输出 TTS 模块

TTS 模块负责把 AI 回复转换为语音，是角色“开口说话”的关键部分。项目支持丰富的语音合成后端，既能走轻量方案，也能接入更高质量或更具角色音色的 TTS 系统。

支持或预留的 TTS 方案包括：

- sherpa-onnx TTS；
- Edge TTS；
- pyttsx3；
- MeloTTS；
- Coqui-TTS；
- GPT-SoVITS；
- CosyVoice / CosyVoice2；
- XTTS；
- Bark；
- Fish Audio；
- MiniMax TTS；
- Azure TTS；
- OpenAI TTS；
- SparkTTS；
- SiliconFlow TTS。

TTS 不只是最后一步“读文本”，它还与流式输出、句子切分、首句快速响应和音频缓存配合，影响用户感受到的响应速度和角色真实感。

---

### 4. VAD 语音活动检测

VAD 用于检测用户什么时候在说话、什么时候停止说话，是免按键语音交互和打断体验的重要基础。

项目中主要使用 Silero VAD。它的作用包括：

- 判断麦克风输入中是否存在有效语音；
- 辅助识别用户语音结束时机；
- 支持更自然的连续对话；
- 配合打断机制，减少用户和 AI 同时说话带来的体验问题。

对于虚拟陪伴类应用来说，VAD 的意义很大。它能让用户以更接近真人交流的方式和角色互动，而不是每次都手动点击按钮。

---

### 5. LLM 与 Agent 系统

LLM 与 Agent 系统是项目的智能核心。项目并没有绑定单一模型供应商，而是通过适配层接入多种 LLM 后端，并在此基础上封装不同类型的 Agent。

支持或兼容的 LLM 方向包括：

- Ollama；
- Claude；
- OpenAI / OpenAI-compatible API；
- Gemini；
- Zhipu AI；
- DeepSeek；
- Groq；
- Mistral；
- LM Studio；
- llama.cpp。

Agent 层则负责把模型调用、上下文管理、角色提示词、工具调用和输出处理组织起来。项目中包含 BasicMemoryAgent、GenericAgent、HybridAgent、HumeAIAgent、LettaAgent 等不同实现。

其中 HybridAgent 比较重要：它可以把闲聊型角色能力和任务执行能力拆开，一个 Agent 负责日常陪伴和角色表达，另一个 Agent 负责更偏执行型的任务。这让项目不只是“能聊天”，也具备继续扩展为桌面助手、任务代理或工具型角色的基础。

---

### 6. Personality Engine 动态人格系统

Personality Engine 是项目区别于普通角色 Prompt 的核心模块之一。普通 AI 角色通常依赖一段固定人设提示词，而该项目把人格做成了运行中的状态系统。

它会维护角色的多个状态量，例如：

- vitality；
- stress load；
- trust score；
- resentment score；
- session state；
- turn count。

同时，它使用 ego、persona 等人格向量描述角色内部倾向和外在表现，并根据对话内容生成当轮的 personality overlay，影响角色的：

- 语气 tone；
- 用词风格 lexical style；
- 句式 sentence form；
- 控制感 control style；
- 情绪温度 emotional temperature；
- 开场与收束方式；
- 遮罩强度与真实人格泄露程度。

这使角色不再只是机械套用人设，而是能随着互动逐步呈现不同状态。对于长期陪伴、角色扮演和虚拟人格应用来说，这个模块是项目很有价值的部分。

---

### 7. Character Memory 长期记忆系统

Character Memory 是项目的另一项核心能力。它不是简单保存聊天记录，而是把角色记忆做成结构化、可检索、可写回的长期知识层。

该模块使用 SQLite 作为持久化存储，并支持 FTS 检索；在 FTS 不可用时，也可以降级为普通搜索。记忆内容会被组织为：

- entities：实体，例如用户、角色、地点或重要对象；
- triples：三元组关系，例如“用户 - 喜欢 - 某事物”；
- attributes：实体属性，例如偏好、身份、状态；
- episodic events：事件型记忆，用于保留重要互动片段。

在对话开始前，系统会根据用户输入检索相关记忆，构造成 memory packet 注入当前回合；在回复结束后，又可以把新信息写回记忆库。这样角色能够逐渐积累关于用户、关系和共同经历的信息。

它解决的是普通聊天机器人最明显的问题：每次对话像第一次见面。通过长期记忆，角色可以更自然地延续关系感。

---

### 8. MCP 工具调用系统

MCP 模块为项目提供工具调用能力，使 AI 角色可以接入外部工具和服务。项目中包含 Server Registry、Tool Adapter、Tool Manager、MCP Client、Tool Executor、JSON Detector 等组件。

大致流程是：

1. 根据配置加载启用的 MCP server；
2. 通过 Tool Adapter 获取工具信息，并生成适合模型使用的工具提示；
3. Tool Manager 管理工具定义；
4. MCP Client 与外部 MCP server 通信；
5. Tool Executor 执行工具调用；
6. Agent 将工具结果整理为符合角色语气的自然回复。

这套机制让角色不只会生成文本，还可以查询、执行、调用服务，并把结果转化成角色化表达。对于希望把 AI 角色做成“会陪伴也会做事”的应用来说，MCP 是重要扩展点。

---

### 9. Live2D 角色表现层

Live2D 模块负责角色的视觉表现。项目可以加载 `live2d-models/` 下的模型资源，并将角色配置与模型、表情、动作等内容绑定。

相关能力包括：

- 管理 Live2D 模型配置；
- 按角色切换模型；
- 通过关键词映射触发表情；
- 配合语音输出形成更完整的角色表现；
- 支持头像、背景和前端展示资源。

Live2D 在这个项目中不是简单装饰，而是角色表达层的一部分。它和语音、人格、记忆结合后，能让用户感受到更强的“角色在场感”。

---

### 10. 多角色与配置管理

项目通过配置系统管理不同角色和不同能力后端。主配置文件是 `conf.yaml`，默认模板位于 `config_templates/`，角色覆盖配置位于 `characters/` 目录。

配置内容覆盖范围很广，包括：

- 系统监听地址和端口；
- 角色名称、头像、Live2D 模型；
- persona prompt；
- ASR / TTS / VAD 配置；
- LLM 与 Agent 配置；
- Character Memory 配置；
- Personality Engine 配置；
- MCP 工具配置；
- 翻译、直播和其他扩展能力。

这种配置化设计使项目可以快速切换角色，也可以为不同角色绑定不同声音、模型、记忆库和人格参数。

---

### 11. 聊天历史与会话管理

项目内置聊天历史管理能力，可以创建、读取、切换和删除历史会话。每个 WebSocket 连接会拥有独立的 ServiceContext，用于管理当前会话所需的配置、模型、Agent、ASR、TTS、VAD、记忆和人格状态。

会话系统支持：

- 单人对话；
- 群组对话；
- 主动发言；
- 用户打断；
- 图片输入；
- 历史消息持久化；
- 中断时保存已听到的 AI 回复；
- 人格状态写入历史元数据。

这部分保证了项目不是一次性问答，而是可以维持多轮、多会话、多角色互动的运行系统。

---

### 12. 翻译、直播与扩展能力

除了核心对话链路，项目还包含一些扩展能力，例如：

- DeepLX / Tencent 翻译；
- Bilibili Live 接入；
- Proxy WebSocket 模式；
- 图片输入支持；
- Web Tool；
- 本地模型与云 API 混合接入。

这些能力让项目可以扩展到更多场景。例如，直播互动角色可以接入弹幕；多语言角色可以通过翻译模块处理跨语言输入输出；代理模式可以让外部客户端接入同一套后端能力。

---

## 运行链路

从一次完整交互来看，AI-Girlfriend 的核心运行链路可以概括为：

```text
用户输入
  → 文本输入 / 麦克风音频
  → VAD 判断语音活动
  → ASR 将语音转成文本
  → Character Memory 检索相关长期记忆
  → Personality Engine 生成动态人格覆盖层
  → Agent / LLM 生成回复
  → MCP 工具调用（可选）
  → TTS 将回复转为语音
  → Live2D 表情与前端展示联动
  → 聊天历史与长期记忆写回
```

这条链路体现了项目的完整性：它不是单点能力的堆砌，而是把输入、理解、记忆、人格、生成、执行、语音和表现层连接成了一个角色系统。

---

## 适用场景

AI-Girlfriend 适合用于以下方向：

- AI 女友 / 男友 / 虚拟陪伴应用；
- 有长期记忆的角色扮演系统；
- 可语音对话的 Live2D 桌面伙伴；
- AI VTuber 或直播互动角色；
- 本地优先的私有化语音 AI 应用；
- 有人设的桌面助手；
- 具备工具调用能力的角色型 Agent；
- 多角色、多配置的虚拟人格实验平台。

如果目标只是做一个问答机器人，这个项目可能显得比较完整甚至偏重；但如果目标是做一个“持续存在的 AI 角色”，它的架构会更有优势。

---

## 项目优势

### 1. 模块化程度高

ASR、TTS、LLM、VAD、Agent、MCP、翻译等能力都有相对独立的模块和工厂类，方便替换后端或新增实现。

### 2. 角色感更强

Personality Engine、Character Memory、Live2D 和语音输出共同增强了角色连续性与表现力，使它比普通文本聊天机器人更适合陪伴类场景。

### 3. 可本地运行，也可混合部署

项目支持本地模型和云端 API 混合接入。开发者可以根据成本、隐私、性能和模型质量灵活选择部署方式。

### 4. 扩展方向清晰

如果要新增模型、接入新 TTS、扩展 MCP 工具、增加角色配置或调整人格策略，都能沿着现有目录结构继续开发，不需要推倒重来。

### 5. 已具备完整运行时思路

它覆盖了从输入到输出、从角色状态到记忆写回、从前端表现到后端工具调用的完整流程，适合作为二次开发底座。

---

## 快速开始

项目使用 uv 管理依赖，常用命令如下：

```bash
uv sync
```

启动服务：

```bash
uv run run_server.py
```

启动并输出详细日志：

```bash
uv run run_server.py --verbose
```

更新项目：

```bash
uv run upgrade.py
```

代码检查与格式化：

```bash
ruff check .
ruff format .
pre-commit run --all-files
```

---

## 总结

AI-Girlfriend 的重点不在于“接了很多模型”，而在于它已经把 AI 角色需要的关键能力组织成了一套完整系统。

它让角色不只是：

- 能回答问题；
- 能播放语音；
- 能显示 Live2D 形象。

而是进一步具备：

- 动态变化的人格状态；
- 可检索、可写回的长期记忆；
- 可扩展的 Agent 与工具调用能力；
- 面向实时陪伴体验的语音和视觉表现链路。

因此，这个项目更适合作为 AI Companion、AI VTuber、虚拟角色助手或长期互动型角色系统的开发基础。对于希望把 AI 从“聊天模型”推进到“持续角色”的开发者来说，AI-Girlfriend 是一个值得深入研究和二次开发的项目。
