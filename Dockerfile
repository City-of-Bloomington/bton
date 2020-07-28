FROM node:12.14

# sort of a hack to make docker cache dependencies based on the state of
# package.json - will only run npm install again if package.json changes
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /home/node/Bton && cp -a /tmp/node_modules /home/node/Bton/

# the .dockerignore file will exclude the node_modules folder from being
# copied from the local machine when we ADD below
WORKDIR /home/node/Bton
ADD . /home/node/Bton

ENTRYPOINT [ "npm", "run-script", "build+start" ]