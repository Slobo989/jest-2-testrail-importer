class TestCase {
  async importCases(projectId, selectedSuiteId, selectedSectionId, testCases, api) {
    for (let j = 0; j < testCases.length; j++) {
      let exists = false
      const newCaseName = testCases[j].title

      // The new case name is checked against existing cases from the TestRail API (oldCases)
      const oldCases = await api.getCases(projectId, {
        suite_id: selectedSuiteId,
        section_id: selectedSectionId,
      })

      for (let k = 0; k < oldCases.length; k++) {
        // If there is a name match, the case is not created (exists = true) and the for loop continues to the next case
        if (oldCases[k].title === newCaseName || oldCases[k].id === parseInt(newCaseName.split(':')[0])) {
          exists = true
          break
        }
      }

      // If a test case with the same name doesn't exist, a new test case is created
      if (!exists) {
        await api.addCase(selectedSectionId, {
          title: newCaseName,
          ['custom_exectype']: 2,
        })
      }
    }
  }

  async createCases(projectId, suiteId, sectionId, testCases, api) {
    for (let l = 0; l < testCases.length; l++) {
      const subsectionName = testCases[l].ancestorTitles[0]
      let subsections = await api.getSections(projectId, {
        suite_id: suiteId
      })

      subsections = subsections.filter(sub => sub.parent_id === sectionId)

      let subsectionId
      let exists3 = false

      for (let n = 0; n < subsections.length; n++) {
        if (subsections[n].name === subsectionName) {
          exists3 = true
          subsectionId = subsections[n].id
          break
        }
      }

      if (!exists3) {
        subsectionId = (
          await api.addSection(projectId, {
            suite_id: suiteId,
            parent_id: sectionId,
            name: subsectionName,
          })
        ).id
      }

      let exists = false
      const newCaseName = testCases[l].title

      // The new case name is checked against existing cases from the TestRail API (oldCases)
      const oldCases = await api.getCases(projectId, {
        suite_id: suiteId,
        section_id: subsectionId,
      })

      for (let m = 0; m < oldCases.length; m++) {
        // If there is a name match, the case is not created (exists = true) and the for loop continues to the next case
        if (oldCases[m].title === newCaseName) {
          exists = true
          break
        }
      }

      // If a test case with the same name doesn't exist, a new test case is created
      if (!exists) {
        await api.addCase(subsectionId, {
          title: newCaseName,
          ['custom_exectype']: 2,
        })
      }
    }
  }
}

module.exports = TestCase