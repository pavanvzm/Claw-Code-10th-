# Terminal AI Assistant - UI/UX Preview

This folder contains visual previews and documentation of the terminal interface design.

## Interface Screenshots

### 1. Welcome Screen
When you launch the application with `npm start`, you see a beautiful welcome banner:

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🤖  TERMINAL AI ASSISTANT                               ║
║       Your Open-Source Claude Code Clone                  ║
║                                                           ║
║   Powered by Ollama / OpenRouter                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

✅ Configuration loaded successfully
📡 LLM Provider: Ollama (http://localhost:11434)
🤖 Model: qwen2.5-coder

💡 Type /help for available commands
💡 Type /exit to quit

user@workspace $ 
```

---

### 2. Interactive Coding Session
Example of asking the AI to create a file:

```
user@workspace $ Create a Python function that calculates fibonacci numbers

🤖 [AI] Thinking...

🤖 [AI] I'll create a Python file with an optimized fibonacci implementation.

📝 [Filesystem] Writing to: fibonacci.py

✅ [Filesystem] File written successfully: fibonacci.py

📄 [Preview] 
def fibonacci(n: int) -> int:
    """Calculate the nth Fibonacci number using iteration."""
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

# Example usage
if __name__ == "__main__":
    for i in range(10):
        print(f"fibonacci({i}) = {fibonacci(i)}")

user@workspace $ 
```

---

### 3. Command Execution & Self-Correction
The AI can run commands and fix errors automatically:

```
user@workspace $ Run npm install lodash and verify it works

🤖 [AI] I'll install lodash and verify the installation.

🔧 [Command] Executing: npm install lodash
⠙ Installing package...

✅ [Command] Package installed successfully

🔧 [Command] Executing: node -e "console.log(require('lodash').VERSION)"
📦 [Stdout] 4.17.21

✅ [AI] Lodash v4.17.21 is now installed and working!

user@workspace $ 
```

---

### 4. Error Handling & Recovery
When something goes wrong, the AI helps diagnose:

```
user@workspace $ Run the test suite

🔧 [Command] Executing: npm test
❌ [Stderr] Error: No test files found

🤖 [AI] It looks like there are no test files yet. Would you like me to:
  1. Create a basic test setup (Jest/Mocha)
  2. Check your package.json for test configuration
  3. Something else?

user@workspace $ Create a Jest setup

🤖 [AI] Setting up Jest testing framework...

🔧 [Command] Executing: npm install --save-dev jest @types/jest ts-jest
✅ [Command] Dependencies installed

📝 [Filesystem] Writing to: jest.config.js
✅ [Filesystem] Config created

📝 [Filesystem] Writing to: src/__tests__/example.test.ts
✅ [Filesystem] Test file created

✅ [AI] Jest is now configured! Run `npm test` to execute tests.

user@workspace $ 
```

---

### 5. Slash Commands Menu
Type `/help` to see all available commands:

```
user@workspace $ /help

╔═══════════════════════════════════════════════════════════╗
║                    AVAILABLE COMMANDS                     ║
╠═══════════════════════════════════════════════════════════╣
║  /help           Show this help menu                      ║
║  /config         View current configuration               ║
║  /model <name>   Switch AI model                          ║
║  /provider       Switch LLM provider (ollama/openrouter)  ║
║  /clear          Clear conversation history               ║
║  /read <file>    Read a file content                      ║
║  /write <file>   Write content to a file                  ║
║  /run <cmd>      Execute a shell command                  ║
║  /exit           Exit the assistant                       ║
╚═══════════════════════════════════════════════════════════╝

user@workspace $ 
```

---

## Color Scheme

| Element | Color | Purpose |
|---------|-------|---------|
| Banner | Cyan | Brand identity |
| User Input | White | Clear distinction |
| AI Response | Green | Success indicator |
| Commands | Yellow | Action highlighting |
| Errors | Red | Alert attention |
| File Operations | Blue | Information |
| Success States | Green | Positive feedback |

---

## Design Principles

1. **Minimalist**: Clean output, no unnecessary clutter
2. **Informative**: Clear status indicators for all operations
3. **Responsive**: Immediate feedback on user actions
4. **Accessible**: High contrast colors, readable fonts
5. **Professional**: Production-ready appearance

---

## Usage Flow Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Launch    │ ──► │  Configure   │ ──► │   Ready     │
│  npm start  │     │  LLM Provider│     │   State     │
└─────────────┘     └──────────────┘     └─────────────┘
                                                │
                        ┌───────────────────────┼───────────────────────┐
                        ▼                       ▼                       ▼
                 ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
                 │  Natural    │         │   Slash     │         │   System    │
                 │  Language   │         │  Commands   │         │   Tools     │
                 │  Prompts    │         │  (/help)    │         │ (FS, Shell) │
                 └─────────────┘         └─────────────┘         └─────────────┘
                        │                       │                       │
                        └───────────────────────┼───────────────────────┘
                                                ▼
                                        ┌─────────────┐
                                        │    LLM      │
                                        │  Processing │
                                        └─────────────┘
                                                │
                        ┌───────────────────────┼───────────────────────┐
                        ▼                       ▼                       ▼
                 ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
                 │   Generate  │         │  Execute    │         │   Display   │
                 │   Response  │         │   Tools     │         │   Result    │
                 └─────────────┘         └─────────────┘         └─────────────┘
                                                │
                                                ▼
                                        ┌─────────────┐
                                        │   Continue  │
                                        │   Loop      │
                                        └─────────────┘
```

---

## Getting Started

1. Install dependencies: `npm install`
2. Configure `.env` file with your LLM settings
3. Run: `npm start`
4. Start coding with AI assistance!

For more details, see the main [README.md](../README.md).
