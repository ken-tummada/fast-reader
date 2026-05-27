# Fast Reader

A small React app to help people read faster with optional LLM integration to test comprehension.

## Quick Start

```bash
git clone https://github.com/ken-tummada/fast-reader.git && cd fast-reader
pnpm install --frozen-lockfile
```

### Running package

```bash
pnpm dev
```

### Optional LLM integration

Install additional dependencies

```bash
pnpm install @langchain/<your-provider>
```
List of providers can be found [here](https://docs.langchain.com/oss/javascript/langchain/models#initialize-a-model).

Create a `.env` file from `.env.example` and fill it out.

```
cp .env.example .env
```
