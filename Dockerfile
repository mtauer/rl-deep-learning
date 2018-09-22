# Use the TensorFlow (CPU only) Docker image based on Ubuntu 16.04
FROM tensorflow/tensorflow

# Install updates and dependencies
RUN apt-get update && apt-get install -y \
  sudo \
#  build-essential \
  curl \
  git

# Install node and npm
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
RUN apt-get install -y \
  nodejs

# Download the Pandemic project
RUN git clone https://github.com/mtauer/rl-deep-learning.git -b feature/dockerize
WORKDIR rl-deep-learning

# Install npm packages
RUN npm install

# Run the application
CMD npm run helloWorld
