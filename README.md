# Example for cypress-testrail-integration package

1. Clone this project: 
  + `https://github.com/Smoliarick/cypress-testrail-integration-example.git` for HTTPS
  + `git@github.com:Smoliarick/cypress-testrail-integration-example.git` for SSH
2. Run `npm install` command
3. Create `.env` file with configs for Test Rail. You can use [this example](.env.example):
  ```
  TESTRAIL_USERNAME=your_testrail_username
  TESTRAIL_PASSWORD=your_testrail_password
  TESTRAIL_HOSTNAME=https://your_domain.testrail.io/
  TESTRAIL_PROJECT_ID=your_testrail_project_id
  ```
4. Create several Test Cases into your Test Rail and add their IDs into the [autotests](cypress/e2e) using this template:
  ```js
  it('C1, C2: Verify that google page has input field', () => {
    cy.visit('https://www.google.com/');
    cy.get('input').should('be.visible');
  });
  ```
  where `C1` and `C2` are Test Case IDs. You can use another letter for Test Case IDs. Add `,` to separate several Test Case IDs. If you want to use only 1 Test Case ID, don't add a new `,`. Example:
  ```js
  it('C3: Verify that google page doesn\'t have input field ', () => {
    cy.visit('https://www.google.com/');
    cy.get('input').should('not.be.visible');
  });
  ```
5. Run `npx cypress run` command
6. When Cypress Run is completed, open Test Runs in Test Rail. New Test Run with default name (e.g. `2023-01-03 Test Run: Cypress Autotest`) and results from Cypress Run should be created

## Add a new parser for autotest's titles

Default template for autotests:

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

If you want to add a new parser for autotest's titles, add it into the constructor. Example:

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

## Add another title for Test Rail Test Run

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

## Video example with running

https://user-images.githubusercontent.com/104084410/210332253-d14ed4e4-f3f0-4e4f-8de5-7c97809d7d81.mp4
