# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY ./frontend_ex ./
RUN npm install
RUN npm run build
 
# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]