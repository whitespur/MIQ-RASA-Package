FROM mhart/alpine-node:10 as builder

RUN apk add --no-cache make gcc g++ python
COPY ./server ./server
COPY ./package*.json ./
RUN npm install --production

FROM mhart/alpine-node:10

ENV http_port=5001
ARG HEALTHCHECK_CMD="curl --silent http://localhost:${http_port}/api/v2/health 2>&1 | grep '\"Rasa UI is running\"'"

ENV rasanluendpoint "http://localhost:5000"
ENV rasacoreendpoint "http://localhost:5005"
ENV postgresserver "postgres://postgres:rasaui@localhost:5432/rasa"

WORKDIR /opt/rasaui
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /server ./server

COPY ./package*.json ./
COPY ./resources ./resources
COPY ./web ./web
RUN addgroup -S rasaui \
    && adduser -G rasaui -S rasaui \
    && chown -R rasaui:rasaui . \
    && chmod -R 0777 .

HEALTHCHECK CMD ${HEALTHCHECK_CMD}

EXPOSE ${http_port}
USER rasaui
RUN ls -p -ls /archive/server01.miq.ai
ENTRYPOINT sh -c "hostname -i; npm start"
