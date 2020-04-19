# Chrislaurenz (User-Frontend) Environment Setup

```bash
Setup instructions 
```

## 1. Replace the proxy config as follow:

```bash
Under following Url <a href="https://github.com/borisfoko/ChrislaurenzPlatforms/blob/master/chrislaurenz/src/proxy.conf.json">Link</a> replace 
the target "https://api.chrislaurenz.de" by "http://localhost:8000"
```

## 2. Replace the environment setting:

```bash
Under the following Url <a href="https://github.com/borisfoko/ChrislaurenzPlatforms/blob/master/chrislaurenz/src/app/shared/environments/environment.ts">Link</a> replace 
the serverUrl "https://api.chrislaurenz.de/api" by "http://localhost:8000/api"
```

## 3. Explore the Frontend Application

```bash
cd chrislaurenz
npm install
npm start
(Open the following url http://localhost:4200)
```