# FROM node:16-bullseye-slim AS build
FROM node:16-alpine AS build

COPY . /src
WORKDIR /src

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle the app source inside the Docker image
COPY . .

RUN npm i pm2 -g

# Define the command to run the app
ENTRYPOINT ["pm2-runtime", "index.js"]