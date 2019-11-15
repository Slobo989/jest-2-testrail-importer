class Section {
  async selectSection(projectId, selectedSuiteId, api, consoleApp) {
    const sections = await api.getSections(projectId, { suite_id: selectedSuiteId })
    let selectedSectionId
    let repeat

    do {
      // Asks for a section name
      repeat = false

      const selectedSection = await consoleApp.sections(sections)

      // If Create new section is selected, it first checks if the section exists - if it does,
      // it asks for the section selection again (the do-while loop and repeat variable)
      if (selectedSection === 'Create new section') {
        const oldSections = await api.getSections(projectId, { suite_id: selectedSuiteId })
        const newSection = await consoleApp.newSection(selectedSuiteId)
        let exists = false

        // For loop checks if the new section exists in the section list (oldSections) - it compares
        // all the names to the name of the new section
        for (let j = 0; j < oldSections.length; j++) {
          if (oldSections[j].name === newSection.name) {
            // If it finds the same section, repeat and exists is set to true, so the do-while loop repeats
            // and a new section is not created
            repeat = true
            exists = true
            console.log(`${'\x1b[31m'}--! Section already exists. !--${'\x1b[0m'}`)
            break
          }
        }

        // If the section doesn't already exist, it is created
        if (!exists) {
          selectedSectionId = (await api.addSection(projectId, newSection)).id
        }
      } else {
        // If an existing section is selected, the ID is extracted from the string containing the section's ID and name
        ;[selectedSectionId] = selectedSection.split(' - ')
      }
    } while (repeat)

    return selectedSectionId
  }

  async createSection(projectId, suiteId, sectionName, api) {
    const sections = await api.getSections(projectId, { suite_id: suiteId })
    let sectionId
    let exists = false

    for (let i = 0; i < sections.length; i++) {
      if (sections[i].name === sectionName) {
        exists = true
        sectionId = sections[i].id
        break
      }
    }

    if (!exists) {
      sectionId = (await api.addSection(projectId, { suite_id: suiteId, name: sectionName })).id
    }

    return sectionId
  }
}

module.exports = Section
