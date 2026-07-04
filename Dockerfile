FROM node:22-slim AS build

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:1.25.3-bookworm AS nginx

RUN set -xe; \
    rm -f /var/log/nginx/access.log; \
    rm -f /var/log/nginx/error.log; \
    touch /var/log/nginx/access.log; \
    touch /var/log/nginx/error.log \
    ;

FROM scratch

# Nginx binaries, modules, configuration, log and runtime files
COPY --from=nginx /usr/sbin/nginx /usr/bin/nginx
COPY --from=nginx /usr/lib/nginx /usr/lib/nginx
COPY --from=nginx /etc/nginx /etc/nginx
COPY --from=nginx /etc/passwd /etc/passwd
COPY --from=nginx /etc/group /etc/group
COPY --from=nginx /var/log/nginx /var/log/nginx
COPY --from=nginx /var/cache/nginx /var/cache/nginx
COPY --from=nginx /var/run /var/run

# Libraries
COPY --from=nginx /lib/x86_64-linux-gnu/libcrypt.so.1 /lib/x86_64-linux-gnu/libcrypt.so.1
COPY --from=nginx /lib/x86_64-linux-gnu/libpcre2-8.so.0 /lib/x86_64-linux-gnu/libpcre2-8.so.0
COPY --from=nginx /lib/x86_64-linux-gnu/libssl.so.3 /lib/x86_64-linux-gnu/libssl.so.3
COPY --from=nginx /lib/x86_64-linux-gnu/libcrypto.so.3 /lib/x86_64-linux-gnu/libcrypto.so.3
COPY --from=nginx /lib/x86_64-linux-gnu/libz.so.1 /lib/x86_64-linux-gnu/libz.so.1
COPY --from=nginx /lib/x86_64-linux-gnu/libc.so.6 /lib/x86_64-linux-gnu/libc.so.6
COPY --from=nginx /lib64/ld-linux-x86-64.so.2 /lib64/ld-linux-x86-64.so.2
COPY --from=nginx /etc/ld.so.cache /etc/ld.so.cache

# Custom nginx configuration (single-process, serves /wwwroot on 8080)
COPY ./rootfs/ /

# Statically exported site
COPY --from=build /app/out /wwwroot
