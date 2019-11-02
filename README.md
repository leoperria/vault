# Vault API

### Prerequisites

- Node.js 8.x+ (https://nodejs.org/it/download/)
- Yarn (https://yarnpkg.com/lang/en/docs/install/#debian-stable) 
- Docker (https://docs.docker.com/v17.09/engine/installation/)
- Docker compose (https://docs.docker.com/compose/install/)

#### Installation instruction

```bash
$ yarn 
$ cp .env.example .env

```

#### Execute the service in development (with autoreload)

```bash

$ yarn docker:dev
  
  ....
  
  vault-api_1  | Server started on port 3010 (development)

```

#### Interacting with the API

```bash
$ curl --request PUT  \
       --url 'http://localhost:3010/v1/vault/test123?encryption_key=PASSWORD123' \
       --header 'Content-Type: application/json' \
       --data '{"test": 123, "test1":{"a":0.1,"b":"HELLO"}}'
```

```json
{"saved":true}
```

```bash
$ curl --request PUT \
      --url 'http://localhost:3010/v1/vault/test456?encryption_key=PASSWORD123' \
      --header 'Content-Type: application/json' \
      --data '{"test": 456, "test1":{"a":0.2,"b":"HELLO2"}}'

```

```json
{"saved":true}
```

```bash
$ curl --request GET \
       --url 'http://localhost:3010/v1/vault/test*?decryption_key=PASSWORD123'
```

```json
[ 
   {"id":"test123","value":{"test":123,"test1":{"a":0.1,"b":"HELLO"}}}, 
   {"id":"test456","value":{"test":456,"test1":{"a":0.2,"b":"HELLO2"}}}
]
```

#### Run tests

```bash
$ yarn docker:test
```

#### Run in production

The app require a MongoDB instance running. It production-like environment can
be started with the following command:

```bash
$ ./bin/run_prod_docker.sh
```

### Boilerplate 

Boilerplate code to https://github.com/danielfsousa/express-rest-es2017-boilerplate
