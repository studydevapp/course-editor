export abstract class TaskType {

  abstract extendClassName: string;
  abstract template: string;

}


export const TaskTypes = {
  TEXT_ONLY: {
    extendClassName: 'TextOnlyTask',
    template: 'import { TextOnlyTask } from "@studydev/sdk";\n\nexport default class Task extends TextOnlyTask {\n\n}'
  } as TaskType,
  RUN_CODE: {
    extendClassName: 'RunCodeTask',
    template: `import { RunCodeTask } from "@studydev/sdk";\n\nexport default class Task extends RunCodeTask {\n constructor(){\n  super('javascript','','')\n }\n}`
  } as TaskType
};
