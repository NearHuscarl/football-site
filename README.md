# React Boilerplate

React boilerplate is a front-end template to quickly prototype react applications

# Details

## Library and tool

-  Front-end: react-redux
-  Back-end: firebase
-  Testing: jest and enzyme

## Pages

-  Login page
-  Dashboard page
-  404/Not found page
-  Loading page
-  Confirm Modal

# Setup

## Download

* Install [nodejs] and yarn (optional, you can just use npm)

```bash
$ npm install -g yarn
```

* Open the terminal and type
```bash
$ git clone https://github.com/NearHuscarl/react-boilerplate
$ cd react-boilerplate
$ yarn install
```

## Setup login systems

Follow [firebase instructions](https://firebase.google.com/docs/auth/?authuser=0) to add different login systems in your app

## Setup firebase

-  Get your firebase environment variables after creating a firebase project
-  Fill in the .env_development file for development database
-  Fill in the .env_test file for seperate testing database if needed
-  In the root folder, run `./setup_heroku.sh`
-  Make sure git doesn't track those 2 files as they are your passwords to the database

## Build

```bash
$ yarn run build:dev
$ yarn run dev-server
```

## Test

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
