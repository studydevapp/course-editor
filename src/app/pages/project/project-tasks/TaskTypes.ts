export abstract class TaskType {

  abstract extendClassName: string;
  abstract template: string;

}


export const TaskTypes = {
  TEXT_ONLY: {
    extendClassName: 'TextOnlyTask',
    template: `import { TextOnlyTask } from "@studydev/sdk";

export default class Task extends TextOnlyTask {

}`
  } as TaskType,
  RUN_CODE: {
    extendClassName: 'RunCodeTask',
    template: `import { RunCodeTask } from "@studydev/sdk";

export default class Task extends RunCodeTask {
    constructor() {
        super('javascript', '123', 'console.log(123)')
    }
}`
  } as TaskType,
  RUN_FUNCTION: {
    extendClassName: 'RunFunctionTask',
    template:
      `import { RunFunctionTask } from "@studydev/sdk";

export default class Task extends RunFunctionTask {
    constructor() {
        super({
            javascript: 'function checkAge(age) {\\n\\n}',
            // list all languages you want to support...
        }, {
            name: 'checkAge',
            checks: [
                { args: [20], expect: false },
                { args: [18], expect: true },
                { args: [0], expect: false }
            ]
        })
    }
}`
  },
  WEB: {
    extendClassName: 'WebTask',
    template: `import { WebTask } from "@studydev/sdk";

export default class Task extends WebTask {
    constructor() {
        super(webApp => {

        }, false)
    }
}`
  }
};
