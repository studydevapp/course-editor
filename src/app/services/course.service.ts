import {Injectable} from '@angular/core';
import * as path from 'path';
import {ElectronService} from '../core/services';
import {MatDialog} from '@angular/material/dialog';
import {CourseSettingsComponent} from '../dialog/course-settings/course-settings.component';
import {CourseMetadataDto} from '../dto/CourseMetadata.dto';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BehaviorSubject, filter} from 'rxjs';
import {ProjectDto, ProjectTaskDto} from '../dto/Project.dto';
import {TaskType, TaskTypes} from "../pages/project/project-tasks/TaskTypes";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  workspace: string;

  $projects = new BehaviorSubject<ProjectDto[]>([]);

  constructor(private electronService: ElectronService,
              private matDialog: MatDialog,
              private snackService: MatSnackBar) {
  }

  setup() {
    this.workspace = localStorage.getItem('workspace');
    if (!this.workspace) {
      // default workspace folder
      this.workspace = path.normalize((window.process.env.HOME ? window.process.env.HOME : 'C:') + '\\StudyDevCourses');
      if (!this.electronService.fs.existsSync(this.workspace)) {
        this.electronService.fs.mkdirSync(this.workspace);
        console.log('created workspace folder', this.workspace);
      }
    }
  }

  updateProjects() {
    this.$projects.next(this.electronService.fs.readdirSync(this.workspace)
      .filter(folder => this.electronService.fs.existsSync(`${this.workspace}/${folder}/metadata.json`))
      .map((folder) => {
        const projectPath = `${this.workspace}/${folder}`;
        const metadata = JSON.parse(this.electronService.fs.readFileSync(`${projectPath}/metadata.json`, 'utf8')) as CourseMetadataDto;
        const packageJson = JSON.parse(this.electronService.fs.readFileSync(`${projectPath}/package.json`, 'utf8'));
        return {
          metadata,
          path: projectPath,
          sdk_version: packageJson.dependencies['@studydev/sdk']
        } as ProjectDto;
      })
    );
  }

  createNewCourse() {
    this.matDialog.open(CourseSettingsComponent, {}).afterClosed().pipe(filter(a => !!a)).subscribe((res: ProjectDto) => {
      if (this.electronService.fs.existsSync(`${this.workspace}/${res.metadata.slug}`)) {
        return this.snackService.open('Course folder already exists', 'OK', {duration: 3000});
      }
      this.snackService.open('Downloading boilerplate course...', undefined, {duration: 3000});
      this.electronService.childProcess.execSync(`git clone https://github.com/studydevapp/boilerplate-course ${this.workspace}/${res.metadata.slug}`);

      // todo: write to metadata.json

      this.snackService.open('Done!', undefined, {duration: 3000});
      this.updateProjects();
    });
  }

  loadProjectInfo(project: ProjectDto) {
    //const indexContent = this.electronService.fs.readFileSync(`${project.path}/src/index.ts`, 'utf8');

    const tasks: ProjectTaskDto[] = [];
    for (let i = 1; this.electronService.fs.existsSync(`${project.path}/src/task${i}.ts`); i++) {
      const taskContent = this.electronService.fs.readFileSync(`${project.path}/src/task${i}.ts`, 'utf8');
      const extendsWhatClass = taskContent.match(/extends\s+([a-zA-Z0-9]+)/)[1];
      const taskType = Object.keys(TaskTypes).find(key => (TaskTypes[key] as TaskType).extendClassName === extendsWhatClass);
      tasks.push({type: TaskTypes[taskType], code: taskContent});
    }

    project.info = {tasks};
  }

  selectWorkspaceFolder() {
    this.electronService.dialog.showOpenDialog({properties: ['openDirectory'], defaultPath: this.workspace}).then(r => {
      if (r.filePaths.length > 0) {
        this.workspace = r.filePaths[0];
        localStorage.setItem('workspace', this.workspace);
        this.updateProjects();
      }
    });
  }

  saveProject(project: ProjectDto) {
    // save metadata
    this.electronService.fs.writeFileSync(`${project.path}/metadata.json`, JSON.stringify(project.metadata, null, 2));

    // update index.ts
    let content = `import {Course, startCourse} from '@studydev/sdk';\n`;
    project.info.tasks.forEach((task, i) => content += `import T${i + 1} from './task${i + 1}';\n`);
    content += `\nstartCourse(new Course([\n${project.info.tasks.map((task, i) => `new T${i + 1}()`).join(', ')}\n]));`;

    this.electronService.fs.writeFileSync(`${project.path}/src/index.ts`, content);

    // reload project
    this.reloadProject(project);
  }

  reloadProject(project: ProjectDto) {
    this.loadProjectInfo(project);
  }
}
