ARG node_version=12
ARG crystal_version=1.0.0

FROM node:${node_version}-alpine as frontend-build
WORKDIR /frontend
COPY /frontend/package*.json  /frontend

RUN npm install -g @angular/cli @angular-builders/custom-webpack && npm clean--install

# Copy source after install dependencies
COPY frontend /frontend

RUN npx ng build --prod

###########################

FROM crystallang/crystal:${crystal_version}-alpine
WORKDIR /src

# Install the latest version of LibSSH2 and the GDB debugger
RUN apk add --no-cache \
  ca-certificates \
  gdb \
  iputils \
  libssh2 libssh2-dev libssh2-static \
  tzdata \
  yaml-static

# Add trusted CAs for communicating with external services
RUN update-ca-certificates

RUN mkdir -p /src/bin/drivers

COPY ./backend/shard.yml /src/shard.yml
COPY ./backend/shard.override.yml /src/shard.override.yml
COPY ./backend/shard.lock /src/shard.lock

RUN shards install --production --ignore-crystal-version

COPY ./backend/src /src/src
COPY --from=frontend-build ./src/frontend/dist/driver-spec-runner /src/www

# Build App
RUN shards build --error-trace --release --production --ignore-crystal-version

# Run the app binding on port 8080
EXPOSE 8080
ENTRYPOINT ["/src/bin/test-harness"]
CMD ["/src/bin/test-harness", "-b", "0.0.0.0", "-p", "8080"]
