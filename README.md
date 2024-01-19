# ppap-esakha-process-ui
ReactJS repo for PPAP

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### ABOUT

This is a React based UI template repo for Enterprise platform related projects.

### INITIAL CLEANUP

This template has basic components in it like header and buttons which are used across all EP UIs. It also has the auth flow implmented using keycloak JS adaptor and redux in main branch [plans to add non-redux based auth handler in another branch]. Hence the following are the first things one might want to do to tailor the template to their requirment.

> Note: Some components used in other projects may not be present here, or they could be outdated. This is due to a lack of sync with other production repos. So pls check other UI repos if you think a component you need should be here, and consider adding it here if it fits.

- Go through Auth handler and auth slice in redux and understand the flow, and make any changes if required.
- Upgrade core dependencies if required
- Upgrade other dependencies
- Remove unwanted libraries/packages and install required ones.
- Cleanup for storybook:
  - Change/cleanup the providers the storybook render is wrapped in.

### CLI COMMANDS

- To install dependencies:
  > npm install
- To run app (after install):
  > npm start
- To run tests:
  > npm test <path regex>
  eg:
  > npm test storybook
- To run storybook (on port 6006):
  > npm run storybook.

### Steps to setup storybook:

- Run
  > npx -p @storybook/cli sb init
- Delete example stories folder
- Run
  > npm i @storybook/addon-storyshots --also-dev
- Add storybook.test.js with react testing library serialiser
- Add all-providers-decorator.js file where the provider wraps the components with <StylesProvider injectFirst> for overwriting MUI styles and other required providers that the base app uses.
- Import the above decorator and add to preview.js.
