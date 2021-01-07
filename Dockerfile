# stage 1

FROM node:alpine AS my-app-build

ENV PORT=80
ENV API_URL=http://127.0.0.1:8080

WORKDIR /app
COPY . .

RUN npm ci && npm run build

# stage 2

FROM nginx:alpine
COPY --from=my-app-build /app/dist/mensa-guide /usr/share/nginx/html
RUN dos2unix docker-entrypoint.sh
# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;' "]

EXPOSE $PORT