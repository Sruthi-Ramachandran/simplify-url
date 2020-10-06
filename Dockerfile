# Using node.js v12 image
FROM node:12
# Create directory
RUN mkdir -p /usr/simplifyurl
WORKDIR /usr/simplifyurl
# Install dependencies
COPY package.json /usr/simplifyurl
RUN npm --loglevel=error install
# Copy source
COPY . /usr/simplifyurl
# Expose port
EXPOSE 4100
# Add DB Env Variable
ENV DATABASE=mongodb://mongo:27017
# Start application
CMD [ "npm", "start" ]