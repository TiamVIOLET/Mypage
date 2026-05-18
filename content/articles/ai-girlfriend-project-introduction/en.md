---
title: AI-Girlfriend Project Introduction
date: 2026.05
category: Project Introduction / AI Companion
summary: AI-Girlfriend is a character runtime system for virtual companionship, voice conversations, and AI VTuber scenarios, combining real-time voice, Live2D, long-term memory, dynamic personality, Agents, and tool calling into one pipeline.
tags:
  - AI Companion
  - Live2D
  - Agent
  - Voice AI
  - Long-term Memory
cover: ./assets/gallery/gallery-04.png
---

## Project Overview

AI-Girlfriend is a character runtime system designed for virtual companionship, voice conversations, and AI VTuber scenarios. It does not simply connect a large language model to a chat box. Instead, it brings **real-time voice interaction, Live2D character performance, long-term memory, dynamic personality, Agent execution capabilities, and tool calling** into one complete pipeline, giving AI characters stronger continuity, expressiveness, and extensibility.

From its code structure, the backend is built with FastAPI and WebSocket, while the frontend handles the interactive interface and Live2D display. The backend orchestrates core capabilities such as ASR, LLM / Agent, TTS, VAD, MCP tools, conversation history, and character configuration. The project uses a modular architecture overall, with different capabilities integrated through factory patterns and a configuration system, making it well suited for further secondary development.

---

## Core Positioning: An AI Character System with Personality, Memory, and Agency

The core value of AI-Girlfriend is not merely that it “can chat,” but that it makes an AI character feel more like a persistent virtual presence:

- **Personality**: The Personality Engine maintains character state, allowing tone, expression, and interaction strategy to change dynamically throughout the conversation.
- **Memory**: Character Memory stores and retrieves long-term information, rather than simply replaying chat logs.
- **Action**: Through the Agent system and MCP tool calling, the character can connect to external capabilities instead of only outputting text.
- **Expression**: Voice, Live2D expressions, and real-time interaction combine to create an experience closer to a companion application.

Therefore, it is better understood as an “AI character runtime” than as an ordinary chatbot demo.

---

## Functional Modules

### 1. Real-Time Interaction and WebSocket Communication

The project uses FastAPI to build the server side and maintains real-time communication with the frontend through WebSocket. The WebSocket layer receives user input, audio data, control signals, and configuration switch requests, while pushing text, audio, Live2D model information, session status, and other content back to the frontend.

Key capabilities include:

- Establishing and maintaining client connections;
- Receiving text input and microphone audio data;
- Supporting conversation triggers, proactive speech, and interruption signals;
- Supporting configuration switching, history retrieval, and character state synchronization;
- Supporting both one-on-one sessions and group sessions;
- Serving frontend assets, Live2D models, avatars, backgrounds, and cached audio through static resource services.

This layer acts as the communication hub of the entire project, connecting frontend interaction with backend intelligence.

---

### 2. Voice Input ASR Module

The ASR module converts user speech into text and serves as the entry point of the voice interaction pipeline. The project supports multiple speech recognition backends, allowing either local models or cloud services to be used.

Supported or planned ASR solutions include:

- sherpa-onnx;
- FunASR;
- Faster-Whisper;
- Whisper.cpp;
- OpenAI Whisper;
- Groq Whisper;
- Azure ASR.

The concrete ASR implementation is selected through configuration files, and the backend creates the corresponding engine through factory classes. This design lowers the cost of switching recognition models and makes it easier to choose different solutions based on device performance, language scenarios, and latency requirements.

---

### 3. Voice Output TTS Module

The TTS module converts AI responses into speech and is the key component that allows the character to “speak.” The project supports a wide range of speech synthesis backends, from lightweight options to higher-quality systems or TTS solutions with more character-specific voices.

Supported or planned TTS solutions include:

- sherpa-onnx TTS;
- Edge TTS;
- pyttsx3;
- MeloTTS;
- Coqui-TTS;
- GPT-SoVITS;
- CosyVoice / CosyVoice2;
- XTTS;
- Bark;
- Fish Audio;
- MiniMax TTS;
- Azure TTS;
- OpenAI TTS;
- SparkTTS;
- SiliconFlow TTS.

TTS is not just the final step of “reading text aloud.” It also works with streaming output, sentence splitting, fast first-sentence response, and audio caching, all of which affect the response speed perceived by the user and the character’s sense of realism.

---

### 4. VAD Voice Activity Detection

VAD is used to detect when the user is speaking and when they have stopped. It is an important foundation for hands-free voice interaction and interruption handling.

The project primarily uses Silero VAD. Its roles include:

- Determining whether valid speech exists in microphone input;
- Helping detect when the user has finished speaking;
- Supporting more natural continuous conversation;
- Working with the interruption mechanism to reduce issues caused by the user and AI speaking at the same time.

For virtual companion applications, VAD is highly meaningful. It allows users to interact with the character in a way that feels closer to real human conversation, rather than manually clicking a button every time.

---

### 5. LLM and Agent System

The LLM and Agent system is the intelligence core of the project. The project is not tied to a single model provider. Instead, it connects to multiple LLM backends through an adapter layer and builds different types of Agent on top of that foundation.

Supported or compatible LLM directions include:

- Ollama;
- Claude;
- OpenAI / OpenAI-compatible API;
- Gemini;
- Zhipu AI;
- DeepSeek;
- Groq;
- Mistral;
- LM Studio;
- llama.cpp.

The Agent layer organizes model calls, context management, character prompts, tool calling, and output processing. The project includes multiple implementations such as BasicMemoryAgent, GenericAgent, HybridAgent, HumeAIAgent, and LettaAgent.

HybridAgent is especially important: it can separate casual character interaction from task execution. One Agent can handle daily companionship and character expression, while another Agent handles more execution-oriented tasks. This means the project is not only able to “chat,” but also has the foundation to evolve into a desktop assistant, task agent, or tool-oriented character.

---

### 6. Personality Engine Dynamic Personality System

The Personality Engine is one of the core modules that distinguishes this project from ordinary character prompts. Typical AI characters rely on a fixed persona prompt, while this project turns personality into a runtime state system.

It maintains multiple character state variables, such as:

- vitality;
- stress load;
- trust score;
- resentment score;
- session state;
- turn count.

It also uses personality vectors such as ego and persona to describe the character’s internal tendencies and external presentation. Based on the conversation content, it generates a personality overlay for the current turn, influencing the character’s:

- tone;
- lexical style;
- sentence form;
- control style;
- emotional temperature;
- opening and closing style;
- masking intensity and the degree to which the underlying personality leaks through.

This means the character no longer mechanically applies a persona, but can gradually reveal different states as the interaction develops. For long-term companionship, role-playing, and virtual personality applications, this module is one of the project’s most valuable parts.

---

### 7. Character Memory Long-Term Memory System

Character Memory is another core capability of the project. It does not simply store chat logs, but turns character memory into a structured, retrievable, and writable long-term knowledge layer.

This module uses SQLite as persistent storage and supports FTS retrieval. When FTS is unavailable, it can fall back to regular search. Memory content is organized as:

- entities: entities such as users, characters, locations, or important objects;
- triples: relational triples such as “user - likes - something”;
- attributes: entity attributes such as preferences, identity, or status;
- episodic events: event-based memories used to preserve important interaction fragments.

Before a conversation begins, the system retrieves relevant memories based on user input and constructs a memory packet to inject into the current turn. After the response is complete, new information can also be written back into the memory database. In this way, the character can gradually accumulate information about the user, the relationship, and shared experiences.

It solves the most obvious problem with ordinary chatbots: every conversation feels like meeting for the first time. With long-term memory, the character can continue the sense of relationship more naturally.

---

### 8. MCP Tool Calling System

The MCP module provides tool calling capabilities for the project, allowing the AI character to connect to external tools and services. The project includes components such as Server Registry, Tool Adapter, Tool Manager, MCP Client, Tool Executor, and JSON Detector.

The general flow is:

1. Load enabled MCP server instances according to the configuration;
2. Use the Tool Adapter to obtain tool information and generate tool prompts suitable for model use;
3. Use the Tool Manager to manage tool definitions;
4. Use the MCP Client to communicate with external MCP server instances;
5. Use the Tool Executor to execute tool calls;
6. The Agent organizes tool results into natural replies that match the character’s tone.

This mechanism allows the character not only to generate text, but also to query, execute, call services, and transform results into character-driven expression. For applications that aim to create an AI character that can both provide companionship and get things done, MCP is an important extension point.

---

### 9. Live2D Character Presentation Layer

The Live2D module handles the character’s visual presentation. The project can load model assets under `live2d-models/` and bind character configurations to models, expressions, motions, and related content.

Related capabilities include:

- Managing Live2D model configuration;
- Switching models by character;
- Triggering expressions through keyword mappings;
- Working with voice output to form a more complete character presentation;
- Supporting avatars, backgrounds, and frontend display assets.

In this project, Live2D is not just decoration. It is part of the character expression layer. When combined with voice, personality, and memory, it gives users a stronger sense of the character being present.

---

### 10. Multi-Character and Configuration Management

The project manages different characters and capability backends through its configuration system. The main configuration file is `conf.yaml`, default templates are located in `config_templates/`, and character override configurations are located in the `characters/` directory.

The configuration covers a wide range of areas, including:

- System listening address and port;
- Character name, avatar, and Live2D model;
- persona prompt;
- ASR / TTS / VAD configuration;
- LLM and Agent configuration;
- Character Memory configuration;
- Personality Engine configuration;
- MCP tool configuration;
- Translation, livestreaming, and other extended capabilities.

This configuration-driven design makes it easy to switch characters quickly, and also allows different voices, models, memory databases, and personality parameters to be bound to different characters.

---

### 11. Chat History and Session Management

The project includes built-in chat history management, allowing historical sessions to be created, read, switched, and deleted. Each WebSocket connection has an independent ServiceContext for managing the configuration, models, Agent, ASR, TTS, VAD, memory, and personality state required by the current session.

The session system supports:

- One-on-one conversations;
- Group conversations;
- Proactive speech;
- User interruptions;
- Image input;
- Persistent historical messages;
- Saving the portion of the AI response already heard when interrupted;
- Writing personality state into history metadata.

This ensures that the project is not a one-off question-answering tool, but a runtime system capable of maintaining multi-turn, multi-session, and multi-character interaction.

---

### 12. Translation, Livestreaming, and Extended Capabilities

Beyond the core conversation pipeline, the project also includes several extended capabilities, such as:

- DeepLX / Tencent translation;
- Bilibili Live integration;
- Proxy WebSocket mode;
- Image input support;
- Web Tool;
- Hybrid integration of local models and cloud APIs.

These capabilities allow the project to expand into more scenarios. For example, livestreaming characters can connect to live chat messages; multilingual characters can use the translation module to handle cross-language input and output; proxy mode allows external clients to access the same backend capabilities.

---

## Runtime Pipeline

From the perspective of a complete interaction, the core runtime pipeline of AI-Girlfriend can be summarized as:

```text
User input
  → Text input / microphone audio
  → VAD detects voice activity
  → ASR converts speech into text
  → Character Memory retrieves relevant long-term memories
  → Personality Engine generates a dynamic personality overlay
  → Agent / LLM generates a response
  → MCP tool calling (optional)
  → TTS converts the response into speech
  → Live2D expressions and frontend display are synchronized
  → Chat history and long-term memory are written back
```

This pipeline demonstrates the completeness of the project: it is not a pile of isolated capabilities, but a character system that connects input, understanding, memory, personality, generation, execution, voice, and presentation.

---

## Use Cases

AI-Girlfriend is suitable for the following directions:

- AI girlfriend / boyfriend / virtual companion applications;
- Role-playing systems with long-term memory;
- Voice-conversational Live2D desktop companions;
- AI VTuber or livestream interaction characters;
- Local-first private voice AI applications;
- Desktop assistants with defined personas;
- Character-style Agent systems with tool calling capabilities;
- Multi-character, multi-configuration virtual personality experimentation platforms.

If the goal is only to build a question-answering bot, this project may feel relatively complete or even somewhat heavy. But if the goal is to create a “persistent AI character,” its architecture offers stronger advantages.

---

## Project Strengths

### 1. Highly Modular Design

Capabilities such as ASR, TTS, LLM, VAD, Agent, MCP, and translation all have relatively independent modules and factory classes, making it convenient to replace backends or add new implementations.

### 2. Stronger Character Presence

The Personality Engine, Character Memory, Live2D, and voice output jointly enhance character continuity and expressiveness, making it better suited to companion scenarios than ordinary text chatbots.

### 3. Local Runtime and Hybrid Deployment

The project supports hybrid integration of local models and cloud APIs. Developers can flexibly choose deployment methods based on cost, privacy, performance, and model quality.

### 4. Clear Extension Paths

Whether adding a new model, integrating a new TTS backend, expanding MCP tools, adding character configurations, or adjusting personality strategies, development can continue along the existing directory structure without rebuilding from scratch.

### 5. Complete Runtime-Oriented Design

It covers the complete flow from input to output, from character state to memory write-back, and from frontend presentation to backend tool calling, making it suitable as a foundation for secondary development.

---

## Quick Start

The project uses uv to manage dependencies. Common commands are as follows:

```bash
uv sync
```

Start the service:

```bash
uv run run_server.py
```

Start with detailed logs:

```bash
uv run run_server.py --verbose
```

Update the project:

```bash
uv run upgrade.py
```

Code checking and formatting:

```bash
ruff check .
ruff format .
pre-commit run --all-files
```

---

## Summary

The focus of AI-Girlfriend is not that it “connects to many models,” but that it organizes the key capabilities required by AI characters into a complete system.

It allows a character not only to:

- Answer questions;
- Play voice responses;
- Display a Live2D avatar.

But also to have:

- Dynamically changing personality states;
- Retrievable and writable long-term memory;
- Extensible Agent and tool calling capabilities;
- Voice and visual presentation pipelines designed for real-time companionship.

Therefore, this project is better suited as a development foundation for AI Companion, AI VTuber, virtual character assistants, or long-term interactive character systems. For developers who want to move AI from a “chat model” toward a “persistent character,” AI-Girlfriend is a project worth studying in depth and building upon.
