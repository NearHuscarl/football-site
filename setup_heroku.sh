#!/bin/bash

if ! [ -x "$(command -v heroku)" ]; then
  echo 'Error: heroku CLI is not installed.' >&2
  exit 1
fi

if [ ! -f "$PWD/.env_development" ]; then
    echo ".env_development not found!"
    echo "Please follow the instruction on https://github.com/NearHuscarl/react-boilerplate to setup firebase"
    exit 1
fi

# before that make sure you've logged in and create heroku app
# heroku login
# heroku create app-name

keyValues=""

for line in $(cat "$PWD/.env_development"); do
    key="${line%=*}"

    # substitution to remove any newlines https://stackoverflow.com/questions/12524308/bash-strip-trailing-linebreak-from-output
    value="$(echo "${line#*=}")"
    keyValues+="$key=$value "
done

heroku config:set $keyValues