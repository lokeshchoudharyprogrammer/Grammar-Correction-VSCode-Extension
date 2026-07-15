# Env Manager & Validator

A smart, powerful Environment Variable manager for VS Code. Never commit a secret by accident or pull your hair out over a missing API key again.

## 🔥 New Advanced Features

- **Strict Type Validation ("The TypeScript of .env")**: Add JSDoc-style comments to your `.env.example` (e.g., `DATABASE_URL= # @type: url`). The extension will enforce these rules in your `.env` file and throw errors if you type a boolean instead of a URL! Supports `url`, `boolean`, and `number`.
- **Environment Profile Switcher**: A new slick UI button in the bottom right VS Code Status Bar. Instantly swap your active `.env` file with `.env.staging`, `.env.local`, or `.env.production` with a single click. No more manually renaming files.
- **Dead Code Detection**: Worried about old API keys cluttering your `.env`? Run the "Find Dead Variables" command. The extension scans your entire codebase and alerts you to any variables in your `.env` that are never actually used in your code.
- **Code Actions (Quick Fixes)**: Notice a missing variable or empty value? Click the VS Code Lightbulb (💡) next to the yellow squiggly line to auto-sync missing variables or instantly generate a cryptographically secure random password.

## Core Features

- **Real-Time Linting**: Validates your `.env` against `.env.example`. Throws VS Code warnings (squiggly lines) for missing variables or empty values.
- **Auto-Sync**: Automatically inject missing variables from `.env.example` into your `.env` file.
- **Hover Insights**: Hover over any environment variable (e.g., `process.env.DB_PASSWORD`) in your code to see if it's currently defined and securely preview its value.
- **Security Check**: Actively monitors your `.gitignore`. If you forget to ignore `.env`, it throws a massive warning and offers to fix it for you instantly.

## Commands

- `Env Manager: Sync .env with .env.example`
- `Env Manager: Switch Environment Profile`
- `Env Manager: Find Unused/Dead Variables`

---
*Built with ❤️ to improve Developer Experience.*
