# syntax=docker/dockerfile:1

# ---- Dependencies stage ---------------------------------------------------
# Installs production node_modules. Build tools are included here so native
# modules (e.g. bcrypt) compile if no prebuilt binary is available; they are
# left behind in this stage and never shipped in the final image.
FROM node:20-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- Runtime stage --------------------------------------------------------
FROM node:20-bookworm-slim AS runtime
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0
WORKDIR /app

# Production dependencies from the deps stage
COPY --from=deps /app/node_modules ./node_modules
# Application source (see .dockerignore for what is excluded)
COPY . .

EXPOSE 3000

# Basic container healthcheck (no extra tooling needed — uses Node's http).
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||3000)+'/',r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

# Run as the unprivileged user that ships with the Node image
USER node

CMD ["node", "app.js"]
