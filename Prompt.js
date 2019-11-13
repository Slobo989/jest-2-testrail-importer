const inquirer = require('inquirer')

class Prompt {
  constructor() {
    this.answers = {}
  }

  ask(question) {
    return new Promise(resolve => {
      inquirer.prompt([question]).then(answer => {
        this.answers[question.name] = answer[question.name]
      }).then(answer => resolve(answer))
    })
  }

  complete() {
    let answers = this.answers
    this.answers = {}
    return answers
  }

  get(answer) {
    return this.answers[answer]
  }
}

module.exports = new Prompt()