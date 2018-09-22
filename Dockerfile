# Use a Node.js docker image based on Alpine Linux
FROM node:8.11-alpine

# Install updates and dependencies
RUN apk add --no-cache \
  git

# Download and install the Pandemic project
RUN git clone https://github.com/mtauer/rl-deep-learning.git && \
  cd rl-deep-learning

RUN ls -l
