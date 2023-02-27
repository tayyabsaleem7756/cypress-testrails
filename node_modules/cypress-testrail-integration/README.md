<h1>cypress-testrail-integration</h1>

<a href="https://www.npmjs.com/package/cypress-testrail-integration"><img src="https://static.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png"></a> <a href="https://github.com/Smoliarick/cypress-testrail-integration"><img src="https://github.githubassets.com/favicons/favicon.png" style="background: white"></a>

This package helps to create a new Test Run in Test Rail with results from Cypress Run.

<h1>Content</h1>

- [Installation](#installation)
- [Add package into `cypress.config.js` file](#add-package-into-cypressconfigjs-file)
- [Update titles for autotests using template](#update-titles-for-autotests-using-template)
- [Running code](#running-code)
- [Your own parser and titles for autotests](#your-own-parser-and-titles-for-autotests)
- [Your own name for Test Rail Test Runs](#your-own-name-for-test-rail-test-runs)
- [Using created Test Run for results](#using-created-test-run-for-results)
- [Example](#example)


## Installation

```
npm i cypress-testrail-integration
```

## Add package into `cypress.config.js` file

1. Create any file with Test Rail credentials and data. Example (`.env` file):

```
TESTRAIL_USERNAME=your_testrail_username
TESTRAIL_PASSWORD=your_testrail_password
TESTRAIL_HOSTNAME=https://your_domain.testrail.io/
TESTRAIL_PROJECT_ID=your_testrail_project_id
```

2. Export package and create a new object into the [`after-run-api`](https://docs.cypress.io/api/plugins/after-run-api) part of the cypress config file (use credentials and data for Test Rail from step 1).
3. Run `addResultsToTestRailTestRun` method for creating a new Test Run in Test Rail (with Test Case IDs from autotests) and adding results into created Test Run.

Full code:

```js
const { defineConfig } = require('cypress');

require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('after:run', async (results) => {
        // Export package
        const TestrailIntegration = require('cypress-testrail-integration');
        // Create a new object with Test Rail credentials and data
        const testrailIntegration = new TestrailIntegration(
          process.env.TESTRAIL_USERNAME, // Test Rail username
          process.env.TESTRAIL_PASSWORD, // Test Rail password
          process.env.TESTRAIL_HOSTNAME, // Test Rail hostname
          process.env.TESTRAIL_PROJECT_ID, // Test Rail project_id
        );
        // Create a new Test Run in Test Rail and add results from Cypress Run
        await testrailIntegration.addResultsToTestRailTestRun(results);
      });
      return config;
    },
    specPattern: 'cypress/e2e/**/*.spec.{js, jsx, ts, tsx}',
  },
});
```

## Update titles for autotests using template

Update titles for your autotests using this template:

```js
it('[Test Case IDs with any first letter]: [Autotest\'s title]', () => {
  // autotest
});
```

Example:

```js
it('C1, C2: Verify that google page has input field', () => {
  // autotest
});
```

```js
it('C3: Verify that google page doesn\'t have input field ', () => {
  // autotest
});
```

## Running code

If you completed to updated autotests titles and config file, run this command for test:

```
npx cypress run
```

If all works OK, you will see a new Test Run with results. It contains all Test Cases with Test Case IDs from your autotests.

Video example:

https://user-images.githubusercontent.com/104084410/210332253-d14ed4e4-f3f0-4e4f-8de5-7c97809d7d81.mp4

## Your own parser and titles for autotests

If you want to use your own parser and titles for autotests, you can add a new parser into the constructor for `TestrailIntegration`.

1. Create a new parser for the `cypress.config.js` file
2. Add it into the `TestrailIntegration` constructor as a `parser` param
3. Update your autotests titles using your own parser

Example:

```js
setupNodeEvents(on, config) {
  on('after:run', async (results) => {
    function newParser(title) { // new parser
      const splittedTitle = title.split(':');
      const testCaseIds = splittedTitle[0]
        .split(',')
        .map((element) => element = element.trim().substring(1));
      return testCaseIds;
    }
        
    const TestrailIntegration = require('cypress-testrail-integration');
    const testrailIntegration = new TestrailIntegration(
      process.env.TESTRAIL_USERNAME,
      process.env.TESTRAIL_PASSWORD,
      process.env.TESTRAIL_HOSTNAME,
      process.env.TESTRAIL_PROJECT_ID,
      parser = newParser // adding a new parser
    );
    await testrailIntegration.addResultsToTestRailTestRun(results);
  });
  return config;
},
```

⚠️ Be careful, new parser should return array of the Test Case IDs. Example: `['1', '2', '3', '4', '5', '6', '7']` or `['1']` for 1 Test Case ID.

## Your own name for Test Rail Test Runs

Default name is `[Today's date] Test Run: Cypress Autotest`, e.g. `2023-01-03 Test Run: Cypress Autotest`.

If you want to add a new name for Test Rail Test Run, add it into the constructor. Example:

```js
setupNodeEvents(on, config) {
  on('after:run', async (results) => {   
    const TestrailIntegration = require('cypress-testrail-integration');
    const testrailIntegration = new TestrailIntegration(
      process.env.TESTRAIL_USERNAME,
      process.env.TESTRAIL_PASSWORD,
      process.env.TESTRAIL_HOSTNAME,
      process.env.TESTRAIL_PROJECT_ID,
      testRunName = 'New Test Run' // adding a new name for Test Run
    );
    await testrailIntegration.addResultsToTestRailTestRun(results);
  });
  return config;
},
```

## Using created Test Run for results

If you want to use created Test Run in Test Rail for adding results, you can add it's ID into the `addResultsToTestRailTestRun` method. Example:

```js
setupNodeEvents(on, config) {
  on('after:run', async (results) => {   
    const TestrailIntegration = require('cypress-testrail-integration');
    const testrailIntegration = new TestrailIntegration(
      process.env.TESTRAIL_USERNAME,
      process.env.TESTRAIL_PASSWORD,
      process.env.TESTRAIL_HOSTNAME,
      process.env.TESTRAIL_PROJECT_ID
    );

    // 25 is ID for existed Test Rail Test Run
    await testrailIntegration.addResultsToTestRailTestRun(results, runId = 25);
  });
  return config;
},
```

## Example

You can use this example: https://github.com/Smoliarick/cypress-testrail-integration-example. This project was set up using cypress-testrail-integration package.