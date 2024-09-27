FROM node:18 AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build -- --configuration=production

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /usr/src/app/dist/user-profile-management /usr/share/nginx/html

EXPOSE 80
