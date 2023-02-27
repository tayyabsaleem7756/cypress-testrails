/**
 * Module provides Cypress autotests integration with Test Rail
 * @module TestrailIntegration
 */

const axios = require('axios').default;
const fs = require('fs');

/**
 * TestrailIntegration class contains necessary functions for using TestRail
 */
class TestrailIntegration {
  /**
   *
   * @param {String} username - username for Test Rail
   * @param {String} password - password for Test Rail
   * @param {String} hostname - hostname for Test Rail
   * @param {Number} projectId - project ID from Test Rail
   * @param {String} testRunName - Template for New Test Run in Test Rail
   * @param {Function} parser - function for parsing Autotest name
   */
  constructor(
      username,
      password,
      hostname,
      projectId,
      testRunName = undefined,
      parser = undefined,
  ) {
    this.configs = {
      username,
      password,
      hostname,
      projectId,
    };

    if (this.configs.username && this.configs.password &&
      this.configs.hostname && this.configs.projectId) {
      this.api = `${this.configs.hostname}index.php?/api/v2`;
      this.auth = {
        username: this.configs.username,
        password: this.configs.password,
      };
      this.headers = {'Content-Type': 'application/json'};
    } else {
      const errorMessage = 'Check that username, password, hostname, ' +
        'projectId and testRunName fields are existed in file or in params';
      throw new Error(errorMessage);
    }

    if (parser) {
      this.parser = parser;
    }

    const date = new Date();
    const dateForTestRunName = date.toISOString().split('T')[0];
    this.testRunName = testRunName ? testRunName :
      `${dateForTestRunName} Test Run: Cypress Autotest`;
  }

  /**
   *
   * @param {String} title - Title from Cypress test
   * @return {Array} - Array with Test Case IDs
   */
  getTestCaseIdsFromTitle(title) {
    const splittedTitle = title.split(':');
    const testCaseIds = splittedTitle[0]
        .split(',')
        .map((element) => element = element.trim().substring(1));
    return testCaseIds;
  }

  /**
   *
   * @param {Number} testCaseId - Test Case ID from Test Rail
   * @param {Object} result - Result from Cypress run
   * @param {String} message - Message for failed test
   * @param {Number} runId - Run ID from Test Rail
   */
  async addResultToTestRunByTestCaseId(
      testCaseId,
      result,
      message,
      runId = 0,
  ) {
    const testRailRunId = runId ? runId : this.runId;
    const addResultForCaseApi = `${this.api}/add_result_for_case/` +
      `${testRailRunId}/${testCaseId}`;

    /**
      1: Passed
      2: Blocked
      3: Untested (not allowed when adding a new result)
      4: Retest
      5: Failed
     */
    let statusId;
    switch (result) {
      case 'failed':
        statusId = 5;
        break;
      case 'passed':
        statusId = 1;
        break;
      default:
        statusId = 0;
    }

    if (statusId) {
      const body = {
        status_id: statusId,
        comment: statusId === 5 ? message : '',
      };

      await axios.post(addResultForCaseApi, JSON.stringify(body), {
        headers: this.headers,
        auth: this.auth,
      }).catch(() => null);
    }
  }

  /**
   *
   * @param {Array} testCaseIds
   */
  async addNewTestRun(testCaseIds) {
    const addRunApi = `${this.api}/add_run/${this.configs.projectId}`;
    const body = {
      name: this.testRunName,
      include_all: false,
      case_ids: testCaseIds,
    };
    return axios.post(addRunApi, JSON.stringify(body), {
      headers: this.headers,
      auth: this.auth,
    }).then((resp) => resp.data.id)
      .catch(() => null);
  }

  /**
   * 
   * @param {Object} results - Results from Cypress test run
   */
  async getTestCaseIdsAndResultsFromCypressResults(results) {
    const testResults = [];
    const testCaseIdsForResults = [];

    results.runs.forEach((run) => {
      run.tests.forEach((test) => {
        const testCaseIds = this.parser ? this.parser(test.title[test.title.length - 1]) : 
          this.getTestCaseIdsFromTitle(test.title[test.title.length - 1]);

        testCaseIds.forEach((testCaseId) => {
          testResults.push({
            testCaseId,
            testResult: test.state,
            testMessage: test.displayError,
          });
        });

        testCaseIdsForResults.push(...testCaseIds);
      });
    });

    return {
      testResults,
      testCaseIdsForResults
    }
  }

  /**
   *
   * @param {Object} results - Results from Cypress test run
   * @param {Number} runId - Test Run ID for Test Rail Test Run
   */
  async addResultsToTestRailTestRun(results, runId = 0) {
    const obj = await this.getTestCaseIdsAndResultsFromCypressResults(results);

    let testRunId = runId;

    if (!testRunId) {
      testRunId = await this.addNewTestRun(
          obj.testCaseIdsForResults,
      );
    }

    await Promise.all(obj.testResults.map(async (test) => {
      await this.addResultToTestRunByTestCaseId(
          test.testCaseId,
          test.testResult,
          test.testMessage,
          testRunId,
      );
    }));
  }
}

module.exports = TestrailIntegration;
