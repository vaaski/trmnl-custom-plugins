FROM oven/bun:slim

COPY package.json bun.lock ./
COPY src/ ./src/
COPY public/ ./public/
RUN bun install

CMD ["bun", "run", "start"]
