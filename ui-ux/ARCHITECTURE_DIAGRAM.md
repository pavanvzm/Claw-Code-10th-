# System Architecture Diagram

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TERMINAL AI ASSISTANT                              │
│                         (Claude Code Clone)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLI LAYER (index.ts)                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Readline Interface (User Input)                                   │   │
│  │  • Command Parser (/help, /exit, /config, etc.)                     │   │
│  │  • Output Formatter (Colors, ASCII Art)                             │   │
│  │  • Session Management                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AGENT LAYER (agents/)                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        AIAgent (aiAgent.ts)                          │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │   │
│  │  │  Prompt Builder  │  │  Response Parser │  │  Context Manager │   │   │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│    TOOL LAYER       │   │    TOOL LAYER       │   │    TOOL LAYER       │
│   (tools/fs.ts)     │   │  (tools/shell.ts)   │   │   (tools/llm.ts)    │
│                     │   │                     │   │                     │
│  • readFile()       │   │  • executeCommand() │   │  • OllamaProvider   │
│  • writeFile()      │   │  • Security Checks  │   │  • OpenRouterProv.  │
│  • patchFile()      │   │  • Stdout/Stderr    │   │  • Model Switching  │
│  • fileExists()     │   │  • Timeout Handling │   │  • Token Counting   │
│  • listFiles()      │   │  • Working Dir Mgmt │   │  • Stream Support   │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
        │                         │                         │
        ▼                         ▼                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  FILE SYSTEM    │     │  CHILD PROCESS  │     │  LLM PROVIDERS  │
│  (Node.js fs)   │     │  (spawn/exec)   │     │                 │
│                 │     │                 │     │  ┌───────────┐  │
│  • Local Files  │     │  • Shell Cmds   │     │  │  Ollama   │  │
│  • Paths        │     │  • Exit Codes   │     │  │ (Local)   │  │
│  • Permissions  │     │  • Signals      │     │  └───────────┘  │
└─────────────────┘     └─────────────────┘     │  ┌───────────┐  │
                                               │  │ OpenRouter│  │
                                               │  │  (Cloud)  │  │
                                               │  └───────────┘  │
                                               └─────────────────┘
```

---

## Data Flow Sequence

### User Request Flow

```
User Input
    │
    ▼
┌─────────────────┐
│  CLI Layer      │ ◄── Parse command, check for slash commands
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Agent Layer    │ ◄── Build prompt with context & history
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Tool Router    │ ◄── Determine which tools are needed
└─────────────────┘
    │
    ├──────────────┬──────────────┐
    ▼              ▼              ▼
┌────────┐    ┌────────┐    ┌────────┐
│  File  │    │ Shell  │    │  LLM   │
│ Tools  │    │ Tools  │    │ Tools  │
└────────┘    └────────┘    └────────┘
    │              │              │
    └──────────────┴──────────────┘
                   │
                   ▼
┌─────────────────┐
│  Response       │ ◄── Format output with colors & emojis
│  Formatter      │
└─────────────────┘
    │
    ▼
User Output
```

---

## Component Interactions

### File Operation Example

```
User: "Create a hello.py file"
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. CLI receives input                                       │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Agent sends to LLM with system prompt                    │
│    "You are a coding assistant. You can use tools..."       │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. LLM responds with tool call                              │
│    {"tool": "writeFile", "path": "hello.py",                │
│     "content": "print('Hello')"}                            │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Agent executes writeFile tool                            │
│    - Check path safety                                      │
│    - Create parent directories if needed                    │
│    - Write content to file                                  │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Confirm success to user                                  │
│    "✅ File written successfully: hello.py"                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY BOUNDARIES                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              ALLOWED OPERATIONS                       │   │
│  │  • Read files within workspace                        │   │
│  │  • Write files within workspace                       │   │
│  │  • Execute safe shell commands                        │   │
│  │  • Access environment variables (configured)          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              BLOCKED OPERATIONS                       │   │
│  │  • Access files outside workspace (../)              │   │
│  │  • Dangerous commands (rm -rf, sudo, etc.)           │   │
│  │  • Network requests (unless explicitly allowed)       │   │
│  │  • Access to sensitive system paths                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration Hierarchy

```
┌─────────────────────────────────────────┐
│         CONFIGURATION SOURCES            │
├─────────────────────────────────────────┤
│                                          │
│  1. .env file (highest priority)        │
│     └── API keys, model names           │
│                                          │
│  2. Environment Variables                │
│     └── OLLAMA_HOST, OPENROUTER_KEY     │
│                                          │
│  3. Default Config (src/config/)        │
│     └── Fallback values                 │
│                                          │
└─────────────────────────────────────────┘
```

---

## Tech Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Runtime | Node.js 18+ | JavaScript runtime |
| Language | TypeScript 5.x | Type-safe development |
| CLI | readline | Interactive terminal interface |
| Colors | chalk (optional) | Terminal coloring |
| LLM Local | Ollama API | Self-hosted models |
| LLM Cloud | OpenRouter API | Free tier cloud models |
| File Ops | Node.js fs | File system access |
| Commands | child_process | Shell execution |
| Build | esbuild/ts-node | Fast compilation |

---

For implementation details, see the source code in `src/`.
