# Terminal AI Assistant

A **free, open-source terminal-based AI coding assistant** - a Claude Code alternative that runs in your terminal.

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.7-blue.svg)

## 🌟 Features

- **Interactive CLI**: Continuous, user-friendly terminal prompt loop with beautiful colored output
- **File System Agents**: Read, write, and patch local workspace files safely
- **Command Execution**: Execute terminal commands with automatic error detection and self-correction
- **100% Free LLM Integration**: 
  - **Ollama** support for local models (qwen2.5-coder, llama3.1, etc.)
  - **OpenRouter** free tier support for cloud models
- **Security First**: Path validation, command blocking, and workspace restrictions
- **Extensible Architecture**: Modular design for easy customization

## 📋 Prerequisites

### Node.js
- Node.js >= 18.0.0
- npm >= 9.0.0

### For Local LLM (Ollama)
1. Install [Ollama](https://ollama.ai):
   ```bash
   # macOS
   brew install ollama
   
   # Windows (PowerShell)
   winget install Ollama.Ollama
   
   # Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. Pull a coding model:
   ```bash
   ollama pull qwen2.5-coder:7b
   # or
   ollama pull llama3.1:8b
   ```

3. Start Ollama server:
   ```bash
   ollama serve
   ```

### For OpenRouter (Cloud Free Tier)
1. Get a free API key from [OpenRouter](https://openrouter.ai)
2. Configure in `.env` file

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/terminal-ai-assistant.git
cd terminal-ai-assistant

# Install dependencies
npm install

# Build the project
npm run build
```

## ⚙️ Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your preferences:
   ```env
   # Choose provider: "ollama" or "openrouter"
   LLM_PROVIDER=ollama
   
   # Ollama settings
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=qwen2.5-coder:7b
   
   # OpenRouter settings (if using cloud)
   OPENROUTER_API_KEY=your_api_key_here
   OPENROUTER_MODEL=google/gemma-2-9b-it:free
   
   # Assistant settings
   MAX_TOKENS=4096
   TEMPERATURE=0.7
   ```

## 💻 Usage

### Start the Assistant

```bash
# Run with default workspace (current directory)
npm start

# Or specify a workspace directory
npm start -- --workspace /path/to/project

# Enable verbose/debug mode
npm start -- --verbose
```

### Interactive Commands

Once started, you can use these slash commands:

| Command | Description |
|---------|-------------|
| `/help` | Show help message |
| `/clear` | Clear conversation history |
| `/config` | Show current configuration |
| `/tools` | List available tools |
| `/exit` | Exit the assistant |

### Example Interactions

```
❯ Create a new React component called Button in src/components

❯ Read the package.json file and tell me what dependencies are installed

❯ Run npm install and let me know if there are any errors

❯ Fix the bug in app.ts line 42 where the state isn't updating

❯ List all TypeScript files in the current directory
```

### Tool Usage Format

The assistant understands tool calls in these formats:

```
[TOOL: read_file] {"path": "package.json"}
[TOOL: execute_command] {"command": "npm install"}
[TOOL: write_file] {"path": "src/hello.ts", "content": "console.log('Hello');"}
```

## 🛠️ Development

```bash
# Build the project
npm run build

# Clean build artifacts
npm run clean

# Development build and run
npm run dev
```

## 📁 Project Structure

```
terminal-ai-assistant/
├── src/
│   ├── agents/          # AI agent logic
│   │   └── aiAgent.ts
│   ├── config/          # Configuration management
│   │   └── index.ts
│   ├── tools/           # Tool implementations
│   │   ├── filesystem.ts
│   │   ├── commandExecutor.ts
│   │   └── llmProvider.ts
│   ├── utils/           # Utilities
│   │   ├── logger.ts
│   │   ├── prompts.ts
│   │   └── promptUtils.ts
│   └── index.ts         # Main entry point
├── dist/                # Compiled JavaScript (generated)
├── .env                 # Environment variables
├── .env.example         # Example environment file
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Security Features

- **Path Validation**: All file operations restricted to workspace directory
- **Command Blocking**: Dangerous commands (sudo, rm -rf /, etc.) are blocked
- **Timeout Protection**: Command execution has 60-second timeout
- **Buffer Limits**: Maximum 10MB output buffer for commands

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits focused and descriptive

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Claude Code](https://claude.ai)
- Built with [Ollama](https://ollama.ai) for local LLM inference
- Uses [OpenRouter](https://openrouter.ai) for free cloud models
- Powered by excellent libraries: Commander, Inquirer, Chalk, Axios

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/terminal-ai-assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/terminal-ai-assistant/discussions)

---

Made with ❤️ by the open-source community
