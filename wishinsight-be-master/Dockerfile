## Build Environment
FROM node:18-alpine AS build-env
# Build Steps
ADD . /app
WORKDIR /app
COPY package.json package*.json ./
RUN npm install 
RUN npm run build
COPY . .
## Run Environment
FROM node:18-alpine
# Copy Build artefacts
COPY --from=build-env /app /app
# Run Code
WORKDIR /app
CMD [ "node", "." ]