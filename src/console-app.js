const prompt = require('./prompt')
const inquirer = require('inquirer')

class ConsoleApp {
  project = async projects => {
    console.log('\n')

    const projectNames = [new inquirer.Separator()]

    for (let i = 0; i < projects.length; i++) {
      projectNames.push(projects[i].id + ' - ' + projects[i].name)
    }

    await prompt.ask({
      type: 'list',
      name: 'project',
      message: 'Select project:',
      choices: projectNames,
    })

    return prompt.complete().project
  }

  customNames = async () => {
    console.log('\n')

    await prompt.ask({
      type: 'confirm',
      name: 'custom',
      message: `Do you want to name suites and sections?\n  (If not, they will be generated automatically)\n  (Default is auto-generated)\n `,
      default: false,
    })

    return prompt.complete().custom
  }

  suites = async (suites, fileName) => {
    console.log('\n')

    const suiteNames = [new inquirer.Separator(), 'Create new suite', new inquirer.Separator()]

    for (let i = 0; i < suites.length; i++) {
      suiteNames.push(suites[i].id + ' - ' + suites[i].name)
    }

    await prompt.ask({
      type: 'list',
      name: 'suites',
      message: `Select suite for spec: ${'\x1b[32m'}${fileName}${'\x1b[0m'}`,
      choices: suiteNames,
    })

    return prompt.complete().suites
  }

  newSuite = async () => {
    console.log('\n')

    await prompt.ask({
      type: 'input',
      name: 'newSuiteName',
      message: `Enter name for the new suite:`,
    })

    await prompt.ask({
      type: 'input',
      name: 'newSuiteDescription',
      message: 'Enter description: (optional)',
    })

    const complete = prompt.complete()

    return {
      name: complete.newSuiteName,
      description: complete.newSuiteDescription,
    }
  }

  sections = async sections => {
    console.log('\n')

    const sectionNames = [new inquirer.Separator(), 'Create new section', new inquirer.Separator()]

    for (let i = 0; i < sections.length; i++) {
      sectionNames.push(sections[i].id + ' - ' + sections[i].name)
    }

    await prompt.ask({
      type: 'list',
      name: 'sections',
      message: `Select section:`,
      choices: sectionNames,
    })

    return prompt.complete().sections
  }

  newSection = async suiteId => {
    console.log('\n')

    await prompt.ask({
      type: 'input',
      name: 'newSectionName',
      message: `Enter name for the new section:`,
    })

    const complete = prompt.complete()

    return { suite_id: suiteId, name: complete.newSectionName }
  }
}

module.exports = ConsoleApp
