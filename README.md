Say hey game telegram bot
=========================

Installation
------------

```console
  $ git clone https://github.com/ofkindness/sayhey.git
  $ cd sayhey && git fetch && git checkout develop && npm install
```

Dockerize
---------

```console
docker build -t sayhey .

docker run -e NODE_ENV=development -e TELEGRAM_TOKEN=yourtelegramtoken --link redis -p 127.0.0.1:3000:3000 -d sayhey
```

Start
-----

DEBUG=* TELEGRAM_TOKEN=yourtelegramtoken npm start

Tests
-----

npm test
