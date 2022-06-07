FROM node:14-bullseye-slim

WORKDIR /formatter

COPY ./ /formatter/

RUN chmod +x /formatter/docker-entrypoint.sh

RUN npm install

RUN npm link

ENTRYPOINT [ "/formatter/docker-entrypoint.sh" ]
