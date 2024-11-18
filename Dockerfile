# Use the Bun official image
FROM oven/bun:1.1.33

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json, bun.lockb, and .env to the working directory
COPY package.json bun.lockb .env ./

# Install dependencies with Bun
RUN bun install

# Copy the rest of the application code
COPY . .

RUN bun run build
# Expose the default Next.js port
EXPOSE 3000

# Default command (overridden by docker-compose)
CMD ["bun", "run", "dev"]
