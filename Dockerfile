FROM node:12-alpine as build-stage

WORKDIR /app
COPY ./ /app/
RUN true
RUN npm config set strict-ssl false
RUN npm install && \
    npm run build

FROM nginx:1.22.1-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN true
COPY --from=build-stage /app/build /var/www
RUN true
RUN chmod 0755 /var/www

# Build And create Docker Image
# docker build -t ppap-esakha-process-ui:v1.0.1 -f ./Dockerfile .
# List The Docker Images
# docker image ls
#RUN DOCKER IMAGE
#docker run -p 3000:80 -d ppap-esakha-process-ui:v1.0.1