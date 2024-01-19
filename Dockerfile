FROM node:12-alpine as build-stage

WORKDIR /app
COPY ./ /app/
RUN true
RUN npm install && \
    npm run build

FROM 384588637744.dkr.ecr.ap-south-1.amazonaws.com/ep-nginx:1.22.1-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN true
COPY --from=build-stage /app/build /var/www
RUN true
RUN chmod 0755 /var/www
