# Vault API

Thanks for boilerplate code to https://github.com/danielfsousa/express-rest-es2017-boilerplate


## Prerequisites

- Node.js 8.x+ (https://nodejs.org/it/download/)
- Yarn (https://yarnpkg.com/lang/en/docs/install/#debian-stable) 
- Docker (https://docs.docker.com/v17.09/engine/installation/)
- Docker compose (https://docs.docker.com/compose/install/)

### Installation instruction

```bash
$ yarn 
```

### Execute the service in development

```bash
$ cp .env.example .env
$ yarn docker:dev
  
  ....
  
  vault-api_1  | Server started on port 3010 (development)

$ curl --request PUT  --url 'http://localhost:3010/v1/vault/test123?encryption_key=PASSWORD123' --header 'Content-Type: application/json' --data '{"test": 123, "test1":{"a":0.1,"b":"HELLO"}}'

{"saved":true}

$ curl --request PUT --url 'http://localhost:3010/v1/vault/test456?encryption_key=PASSWORD123' --header 'Content-Type: application/json' --data '{"test": 456, "test1":{"a":0.2,"b":"HELLO2"}}'

{"saved":true}

$ curl --request GET --url 'http://localhost:3010/v1/vault/test*?decryption_key=PASSWORD123'

[{"id":"test123","value":{"test":123,"test1":{"a":0.1,"b":"HELLO"}}},{"id":"test456","value":{"test":456,"test1":{"a":0.2,"b":"HELLO2"}}}]x
```

### Run tests

```bash
$ yarn docker:test
```

