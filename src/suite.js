class Suite {
  async selectSuite(projectId, fileName, api, consoleApp, customNames, path) {
    const suites = await api.getSuites(projectId)
    let selectedSuiteId
    let repeat

    do {
      // Asks for a suite name
      repeat = false

      const selectedSuite = await consoleApp.suites(suites, fileName)

      // If Create new suite is selected, it first checks if the suite exists - if it does,
      // it asks for the suite selection again (the do-while loop and repeat variable)
      if (selectedSuite === 'Create new suite') {
        const oldSuites = await api.getSuites(projectId)
        const newSuite = await consoleApp.newSuite()
        let exists = false

        // For loop checks if the new suite exists in the suite list (oldSuites) - it compares all the names to the name of the new suite
        for (let j = 0; j < oldSuites.length; j++) {
          if (oldSuites[j].name === newSuite.name) {
            // If it finds the same suite, repeat and exists is set to true, so the do-while loop repeats and a new suite is not created
            repeat = true
            exists = true
            console.log(`${'\x1b[31m'}--! Suite already exists. !--${'\x1b[0m'}`)
            break
          }
        }

        // If the suite doesn't already exist, it is created
        if (!exists) {
          selectedSuiteId = (await api.addSuite(projectId, newSuite)).id
        }
      } else {
        // If an existing suite is selected, the ID is extracted from the string containing the suite's ID and name
        selectedSuiteId = selectedSuite.split(' - ')[0]
      }
    } while (repeat)

    return selectedSuiteId
  }

  async createSuite(projectId, suiteName, api) {
    const suites = await api.getSuites(projectId)
    let suiteId
    let exists = false

    for (let j = 0; j < suites.length; j++) {
      if (suites[j].name === suiteName) {
        exists = true
        suiteId = suites[j].id
        break
      }
    }

    if (!exists) {
      suiteId = (await api.addSuite(projectId, { name: suiteName })).id
    }

    return suiteId
  }
}

module.exports = Suite
