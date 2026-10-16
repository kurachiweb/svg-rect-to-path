# Debian 13 (trixie)
FROM node:26.12.0-trixie-slim

# Git for Claude Code; trust the project even if owned by another user
RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates git \
	&& rm -rf /var/lib/apt/lists/* \
	&& git config --system --add safe.directory /home/node/app

USER node

# Create volume mount points so new volumes are owned by node
RUN mkdir -p /home/node/.claude /home/node/app/.svelte-kit

# Claude Code, installed to a user-owned prefix so it can auto-update
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ARG CLAUDE_CODE_VERSION=latest
RUN npm install -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}
# Keep credentials and .claude.json in the claude-config volume
ENV CLAUDE_CONFIG_DIR=/home/node/.claude

WORKDIR /home/node/app

ENV NODE_ENV=development

COPY --chown=node:node package*.json .
RUN npm i

COPY --chown=node:node . .

EXPOSE 3000 5173
