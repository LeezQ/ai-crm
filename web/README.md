# AI CRM Web

Next.js 15 frontend for the AI CRM project. It consumes the Hono backend (`ai-crm-server`) and surfaces AI-augmented CRM workflows such as natural-language insights, automated opportunity drafting, and voice note summarisation.

## Getting Started

1. Install dependencies
   ```bash
   pnpm install
   ```
2. Copy environment template and point the app at the backend:
   ```bash
   cp .env.example .env.local
   ```
   Update `NEXT_PUBLIC_API_URL` to the reachable server origin (e.g. `http://localhost:3001`). When running behind Docker Compose, `API_SERVER_ORIGIN` can be set to `http://server:3001`.
3. Run the development server:
   ```bash
   pnpm dev
   ```
   The UI is available on `http://localhost:3000` and proxies `/api/*` requests to the backend origin from the environment variables.

## Key Features
- **AI 问数**：在仪表盘直接向 AI 询问销售指标，获得结构化分析与建议。
- **AI 自动填表**：在新建商机页面粘贴原始描述，AI 自动提取公司、联系人、状态等字段，可一键补全并继续编辑。
- **语音摘要**：在商机详情或抽屉中上传通话录音，实时生成文字转写、摘要、行动建议并沉淀到数据库。
- **流式聊天助手**：通过 `/api/ai/chat` 与后台统一的 OpenAI 配置保持一致。

## Available Scripts
- `pnpm dev` – run Next.js in development with Turbopack
- `pnpm build` – create a production build (standalone output for Docker)
- `pnpm start` – run the compiled production server
- `pnpm lint` – lint the codebase

## Working with Docker
The frontend participates in the root `docker-compose.yml`:
```bash
docker compose up --build
```
Nginx serves the static assets and proxies API requests to the backend container.
