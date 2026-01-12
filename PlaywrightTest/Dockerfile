# Use Playwright's official image which includes browsers and deps
FROM mcr.microsoft.com/playwright:focal

LABEL maintainer="your-name@example.com"

# Set working dir
WORKDIR /app

# Copy package manifests first to leverage Docker cache
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the repository
COPY . .

RUN mkdir -p /app/test-results /app/playwright-report \
 && chown -R pwuser:pwuser /app/test-results /app/playwright-report

# Ensure browsers are installed (image usually includes them but this is safe)
RUN npx playwright install --with-deps

# Run as non-root user provided by the Playwright image
USER pwuser

# Default entry: run Playwright tests - override at `docker run` or in compose
ENTRYPOINT ["npx", "playwright", "test"]
