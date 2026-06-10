#!/usr/bin/env node
/**
 * ASCII Banner Generator for Terminal AI Assistant
 * Run this file to display the animated welcome banner
 */

const colors = {
    reset: '\x1b[0m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    red: '\x1b[31m',
    white: '\x1b[37m',
    bold: '\x1b[1m',
    dim: '\x1b[2m'
};

const banner = `
${colors.cyan}${colors.bold}╔═══════════════════════════════════════════════════════════════════════════╗${colors.reset}
${colors.cyan}${colors.bold}║${colors.reset}                                                                       ${colors.cyan}${colors.bold}║${colors.reset}
${colors.cyan}${colors.bold}║${colors.reset}  ${colors.magenta}${colors.bold}🤖  TERMINAL AI ASSISTANT${colors.reset}                                        ${colors.cyan}${colors.bold}║${colors.reset}
${colors.cyan}${colors.bold}║${colors.reset}      ${colors.white}Your Open-Source Claude Code Clone${colors.reset}                                 ${colors.cyan}${colors.bold}║${colors.reset}
${colors.cyan}${colors.bold}║${colors.reset}                                                                       ${colors.cyan}${colors.bold}║${colors.reset}
${colors.cyan}${colors.bold}║${colors.reset}      ${colors.yellow}⚡ Powered by Ollama & OpenRouter${colors.reset}                                       ${colors.cyan}${colors.bold}║${colors.reset}
${colors.cyan}${colors.bold}║${colors.reset}      ${colors.green}🚀 100% Free & Open Source${colors.reset}                                              ${colors.cyan}${colors.bold}║${colors.reset}
${colors.cyan}${colors.bold}║${colors.reset}                                                                       ${colors.cyan}${colors.bold}║${colors.reset}
${colors.cyan}${colors.bold}╠═══════════════════════════════════════════════════════════════════════════╣${colors.reset}
${colors.cyan}${colors.bold}║${colors.reset}  ${colors.blue}📁 File System Tools${colors.reset} │ ${colors.blue}🔧 Command Execution${colors.reset} │ ${colors.blue}🧠 AI-Powered Coding${colors.reset}   ${colors.cyan}${colors.bold}║${colors.reset}
${colors.cyan}${colors.bold}╠═══════════════════════════════════════════════════════════════════════════╣${colors.reset}
${colors.cyan}${colors.bold}║${colors.reset}  ${colors.dim}Type /help for commands${colors.reset} │ ${colors.dim}Type /exit to quit${colors.reset} │ ${colors.dim}MIT Licensed${colors.reset}          ${colors.cyan}${colors.bold}║${colors.reset}
${colors.cyan}${colors.bold}╚═══════════════════════════════════════════════════════════════════════════╝${colors.reset}
`;

const featureIcons = `
${colors.green}✅${colors.reset} Read/Write Files    ${colors.green}✅${colors.reset} Execute Commands    ${colors.green}✅${colors.reset} Auto-Correction
${colors.green}✅${colors.reset} Multi-Model Support ${colors.green}✅${colors.reset} Local & Cloud LLMs  ${colors.green}✅${colors.reset} Conversation History
`;

const quickStart = `
${colors.yellow}${colors.bold}⚡ Quick Start:${colors.reset}
  1. ${colors.dim}npm install${colors.reset}
  2. ${colors.dim}cp .env.example .env${colors.reset}
  3. ${colors.dim}npm start${colors.reset}
`;

console.log(banner);
console.log(featureIcons);
console.log(quickStart);
console.log('');
