import {Injectable, NgZone} from '@angular/core';
import * as path from 'path';
import {ElectronService} from '../core/services';
import {MatDialog} from '@angular/material/dialog';
import {CourseSettingsComponent} from '../dialog/course-settings/course-settings.component';
import {CourseMetadataDto} from '../dto/CourseMetadata.dto';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BehaviorSubject, filter} from 'rxjs';
import {ProjectDto, ProjectTaskDto} from '../dto/Project.dto';
import {TaskType, TaskTypes} from "../pages/project/project-tasks/TaskTypes";
import {APP_CONFIG} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  workspace: string;

  $projects = new BehaviorSubject<ProjectDto[]>([]);

  constructor(private electronService: ElectronService,
              private matDialog: MatDialog,
              private ngZone: NgZone,
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
        const key = this.electronService.fs.existsSync(`${projectPath}/key.sd`) ? this.electronService.fs.readFileSync(`${projectPath}/key.sd`, 'utf8') : '';

        return {
          metadata,
          path: projectPath,
          key,
          sdk_version: packageJson.dependencies['@studydev/sdk']
        } as ProjectDto;
      })
    );
  }

  createNewCourse() {
    this.matDialog.open(CourseSettingsComponent, {}).afterClosed().pipe(filter(a => !!a)).subscribe((res: ProjectDto) => {
      if (this.electronService.fs.existsSync(`${this.workspace}/${res.metadata.slug}`)) {
        return this.snackService.open('Course folder already exists', 'OK', {duration: 3000, panelClass: 'error'});
      }
      this.snackService.open('Downloading boilerplate course...', undefined, {duration: 10_000});
      const e = this.electronService.childProcess.exec(`git clone https://github.com/studydevapp/boilerplate-course ${this.workspace}/${res.metadata.slug} && cd ${this.workspace}/${res.metadata.slug} && npm i`)
      e.on('exit', (code) => {
        if (code === 0) {
          this.ngZone.run(() => {
            // write initial config to metadata.json
            res.path = `${this.workspace}/${res.metadata.slug}`;
            res.info = {tasks: []};
            res.metadata = {
              ...JSON.parse(this.electronService.fs.readFileSync(`${res.path}/metadata.json`, 'utf8')) as CourseMetadataDto,
              ...res.metadata
            };
            this.saveProject(res);

            this.snackService.open('Done!', undefined, {duration: 3000, panelClass: 'success'});
            this.updateProjects();
          });
        }
      });
      e.stdout.on('data', (data) => {
        console.log(data);
      });
      e.stderr.on('data', (data) => {
        this.ngZone.run(() => {
          console.error(data);
          this.snackService.open(data, undefined, {duration: 10_000, panelClass: 'error'});
        });
      });
    });
  }

  loadProjectInfo(project: ProjectDto) {
    //const indexContent = this.electronService.fs.readFileSync(`${project.path}/src/index.ts`, 'utf8');
    project.metadata = JSON.parse(this.electronService.fs.readFileSync(`${project.path}/metadata.json`, 'utf8')) as CourseMetadataDto;

    const tasks: ProjectTaskDto[] = [];
    for (let i = 1; this.electronService.fs.existsSync(`${project.path}/src/task${i}.ts`); i++) {
      const taskContent = this.electronService.fs.readFileSync(`${project.path}/src/task${i}.ts`, 'utf8');
      const extendsWhatClass = taskContent.match(/extends\s+([a-zA-Z0-9]+)/)[1];
      const taskType = Object.keys(TaskTypes).find(key => (TaskTypes[key] as TaskType).extendClassName === extendsWhatClass);
      tasks.push({type: TaskTypes[taskType], code: taskContent});
    }
    console.log(tasks);
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
    // save metadata & key
    this.electronService.fs.writeFileSync(`${project.path}/metadata.json`, JSON.stringify(project.metadata, null, 2));
    this.electronService.fs.writeFileSync(`${project.path}/key.sd`, project.key);

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

  async buildProject(project: ProjectDto) {
    return new Promise<void>((res, rej) => {
      const additionalArgs = !APP_CONFIG.production ? 'STUDYDEV_API=http://localhost:4200 ' : '';
      const e = this.electronService.childProcess.exec(`cd ${project.path} && npm install && env COURSE_KEY=${project.key} ${additionalArgs}node ./node_modules/@studydev/sdk/src/cli.js`);
      e.on('exit', (code) => {
        if (code === 0) {
          res();
        } else {
          rej();
        }
      });
      e.stdout.on('data', (data) => {
        console.log(data);
      });
      e.stderr.on('data', (data) => {
        console.error(data);
        this.snackService.open(data, undefined, {duration: 10_000, panelClass: 'error'});
      });
    });
  }
}
