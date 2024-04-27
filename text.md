# Install dependencies only when needed

FROM node:18-alpine3.18 AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the app with cached dependencies

FROM node:18-alpine3.18 AS builder

WORKDIR /app

# Copy only the necessary files from the previous stage

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# Production image, copy all the files and run next

FROM node:18-alpine3.18 AS runner

WORKDIR /usr/src/app

COPY --from=builder /app/dist ./dist

# Install only production dependencies

COPY package.json yarn.lock ./
RUN yarn install --prod

CMD [ "node", "dist/main" ]
