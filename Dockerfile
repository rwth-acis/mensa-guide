# stage 1

FROM node:alpine AS my-app-build


ENV API_URL=las2peer-bootstrap.sbf-dev:32011
ENV DEBUG=true

WORKDIR /app
COPY . .

RUN npm ci && npm run build:prod 

# stage 2

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /usr/share/nginx/html/mensa
COPY --from=my-app-build /app/dist/mensa-guide /usr/share/nginx/html/mensa
RUN dos2unix docker-entrypoint.sh
# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/mensa/assets/env.template.js > /usr/share/nginx/html/mensa/assets/env.js && exec nginx -g 'daemon off;' "]
