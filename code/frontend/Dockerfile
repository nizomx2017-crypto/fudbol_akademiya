FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG VITE_DISABLE_RECAPTCHA=false
ARG VITE_BUILD_MODE=production
ARG NODE_ENV=production
ENV VITE_DISABLE_RECAPTCHA=${VITE_DISABLE_RECAPTCHA}
ENV NODE_ENV=${NODE_ENV}
RUN npm run build -- --mode ${VITE_BUILD_MODE}

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
