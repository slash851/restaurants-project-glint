# Backend Functions

Backend app is created with inversify framework and typescript language.
DB used is posgres db version 13.



## Development server

### prerequirements

node version `14.x.x`

dev server require `.env` file in functions directory
file has to contain `DB_URI=xxx` property to connecto to DB where xxx is URL to the database

### running server

install dependencies
`yarn install`


Run `yarn run start` for a dev server. Navigate to path displayed in the log


## Build

Run `tsc` to build the project. The build artifacts will be stored in the `lib/` directory.

## Running unit tests

Run `npm run test` to execute the unit tests 

## Deployment



### prerequirements

install firebase cli and login to firebase account

production environemnt require db variale:
`DB_URI=xxx` to connect to database

### deploy command
Run `firebase deploy --only functions`

Note: deployment command takes care of compiling source to js so no need for building lib artifacts


## database

Production version of the app is connected to postgress database hosted in heroku

Below Schema of the db

![database schema](https://live.staticflickr.com/65535/51903656240_f222a87255_z.jpg)


