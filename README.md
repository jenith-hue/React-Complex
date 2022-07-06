# AM Micro-frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## System Requirements

- [NodeJS](https://nodejs.org/) v10 or greater ([Using NVM](https://github.com/creationix/nvm#installation))
- [npm](https://www.npmjs.com/) v6 or greater

All of these must be available in your `PATH`. To verify things are set up properly, you can run this:

```shell
node --version
npm --version
```
## Getting started

This contains a package hosted on a private repository, so you need to specify the registry where this package is hosted. To do this, ask one of your coleagues for the `.npmrc` file and place it in `client/` (this) folder

Beside this, you will need to use a VPN in order to install the package.

### VPN for 3Pillar Global employees

You should have a VPN client already installed, called `Cisco AnyConnect`. You'll have to enter one of the following URLs (depending on your location) and your 3PG credentials to login to 3PG VPN:

| Location  | URL                        |
| --------- | -------------------------- |
| Cluj/Iași | cljvpn01.3pillarglobal.com |
| Timișoara | timvpn01.3pillarglobal.com |
| Fairfax   | ffxvpn01.3pillarglobal.com |
| Noida     | ndivpn01.3pillarglobal.com |

### VPN for everyone else

To be determined

### Instalation

This project uses npm for dependency management. In order to install the required dependencies you'll need to execute the following command in this directory:

```
npm install
```

## Running the app

To get the app up and running, run:

```
npm start
// or
npm run start:linked // linking racstrap only if you didn npm run watch in the racstrap repo
npm run start:clean // remove the local linkage
```

Open [http://localhost:3002](http://localhost:3002) to view it in the browser.
The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## Testing

If you want to execute the tests, run the following command:

```
npm test
```

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
See the section about [snapshot testing](https://jestjs.io/docs/snapshot-testing) for more information.

If you want to see test coverage matrix, run the following command:

```
npm test:coverage
```

## Building the project

```
npm build
```

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Pull Requests

Prefix your pull request title with the JIRA ticket id. E.g: RPAD-99 My Hug component.
