const { defineConfig } = require('cypress');

require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('after:run', async (results) => {
        function newParser(title) {
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
          // testRunName = 'Cypress Automation',
           parser = newParser
        );
        //await testrailIntegration.addResultsToTestRailTestRun(results, runId = 26);
        //await testrailIntegration.addResultsToTestRailTestRun(results, projectId = 3);
        await testrailIntegration.addResultsToTestRailTestRun(results);
      });
      return config;
    },
    specPattern: 'cypress/e2e/**/*.spec.{js, jsx, ts, tsx}',
  },
});
