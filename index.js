const TestRail = require('testrail')
const dotenv = require('dotenv')
const fs = require('fs')

const ConsoleApp = require('./src/console-app.js')
const Suite = require('./src/suite.js')
const Section = require('./src/section.js')
const TestCase = require('./src/cases.js')

const consoleApp = new ConsoleApp()
const section = new Section()
const suite = new Suite()
const testcase = new TestCase()

let envFile = null

try {
  envFile = fs.readFileSync('.env')
} catch (error) {
  console.error("You don't have an .env file!\n", error)
  process.exit(1)
}

const config = dotenv.parse(envFile)

const api = new TestRail({
  host: config.NETWORK_URL,
  user: config.USERNAME,
  password: config.PASSWORD,
})

class Reporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig
    this._options = options
  }

  async onRunComplete(contexts, results) {
    // Gets the project list from the TestRail API, let's you select a project, and extracts a project ID from the selection
    const specResults = results.testResults
    const projects = await api.getProjects()
    const project = await consoleApp.project(projects)
    const projectId = project.split(' - ')[0]

    // Asks if you want custom names, or if it should auto-generate them from the path
    // (folders = suites, file names = sections, describe names = subsections, it names = case names)
    const customNames = await consoleApp.customNames()

    if (customNames) {
      // For loop goes through the results of different spec files and creates test cases for each
      for (let i = 0; i < specResults.length; i++) {
        const path = specResults[i].testFilePath.split(/(\\)/)
        const file = path[path.length - 1]
        const fileName = file.split('.')[0]
        const testCases = specResults[i].testResults

        const selectedSuiteId = await suite.selectSuite(projectId, fileName, api, consoleApp, customNames, path)
        const selectedSectionId = await section.selectSection(projectId, selectedSuiteId, api, consoleApp)

        await testcase.importCases(projectId, selectedSuiteId, selectedSectionId, testCases, api)

        console.log(`- ${'\x1b[32m'}${file}${'\x1b[0m'} - Spec completed. (${i + 1} of ${specResults.length})`)
      }
    } else {
      for (let i = 0; i < specResults.length; i++) {
        const path = specResults[i].testFilePath.split(/(\\)/)
        const file = path[path.length - 1]
        const suiteName = path[path.length - 3]
        const sectionName = file.split('.')[0]
        const testCases = specResults[i].testResults

        const suiteId = await suite.createSuite(projectId, suiteName, api)
        const sectionId = await section.createSection(projectId, suiteId, sectionName, api)

        await testcase.createCases(projectId, suiteId, sectionId, testCases, api)

        console.log(`- ${'\x1b[32m'}${file}${'\x1b[0m'} - Spec completed. (${i + 1} of ${specResults.length})`)
      }
    }

    console.log(`${'\x1b[36m'}Import finished.${'\x1b[0m'}`)
  }

  async deleteRuns() {
    const getRuns = await api.getRuns(2, { created_after: 1555891200 })
    const runs = getRuns.map(run => run.id)
    runs.forEach(async run => await api.deleteRun(run))
  }
}

module.exports = Reporter
