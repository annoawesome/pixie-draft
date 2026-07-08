FROM node:24-alpine AS backend-builder

WORKDIR /app/
COPY package*.json tsconfig.json /app/
RUN npm ci --save-dev
COPY ./ /app/
RUN npx tsc

FROM node:24-alpine AS frontend-builder

WORKDIR /app/src/public/
COPY src/public/package*.json /app/src/public/
RUN npm ci --save-dev
COPY src/public/ /app/src/public/
RUN npx vite build

FROM node:24-alpine AS final

RUN mkdir -p /app/data && chown -R node:node /app/data
WORKDIR /app/

COPY --from=backend-builder /app/dist /app/dist/
COPY --from=backend-builder /app/package*.json /app/
RUN npm ci --omit=dev
COPY --from=frontend-builder /app/public /app/public/

USER node
EXPOSE 8080
CMD [ "node", "/app/dist/main.js" ]