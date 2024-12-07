# Base image supporting SGX
FROM intel/sgx-dcap:latest

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# SGX-specific environment
ENV SGX_ENABLED=true

EXPOSE 3000

CMD [ "yarn", "start:prod" ]
