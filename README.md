# [Football 365]

Latest football news, fixtures, results, statistics, standings

# Details

## Library and tool

-  Front-end: react-redux
-  Back-end: firebase

## APIs used

- [Football data]
- [News API]

# Setup

## Download

* Install [nodejs] and yarn (optional, you can just use npm)

```bash
$ npm install -g yarn
```

* Open the terminal and type
```bash
$ git clone https://github.com/NearHuscarl/football-site
$ cd football-site
$ yarn install
```

## Setup login systems

Follow [firebase instructions](https://firebase.google.com/docs/auth/?authuser=0) to add different login systems in your app

## Setup firebase

-  Get your firebase environment variables after creating a firebase project
-  Fill in the `.env_development` file for development database
-  Fill in the `.env_test` file for seperate testing database if needed
-  Make sure git doesn't track those 2 files as they are your passwords to the database

## Setup service APIs:

-  Get API keys (free) from [News API] and [Sportmonks]
-  Fill in the `.api_keys` file
-  In the root folder, run `./setup_heroku.sh`

## Build

```bash
$ yarn run build:dev
$ yarn run dev-server
```

## Test (Not available now)

```bash
$ yarn test
```

## Deploy on heroku
- Install heroku CLI on your computer

```bash
$ heroku login
$ cd <project-dir>
$ heroku create app-name
$ ./setup_heroku.sh # this is bash script, use git bash to run on window
$ git remote -v # confirm the remote is setup
$ git push heroku master
```


[nodejs]: https://nodejs.org/en/download/
[Football 365]: https://football-365.herokuapp.com/
[News API]: https://newsapi.org/
[Sportmonks]: https://www.sportmonks.com
[Football data]: https://www.football-data.org/