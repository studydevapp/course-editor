import {Injectable} from '@angular/core';
import * as path from 'path';
import {ElectronService} from '../core/services';
import {MatDialog} from '@angular/material/dialog';
import {CourseSettingsComponent} from '../dialog/course-settings/course-settings.component';
import {CourseMetadataDto} from '../dto/CourseMetadata.dto';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BehaviorSubject, filter} from 'rxjs';
import {ProjectDto} from '../dto/Project.dto';

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
        const metadata = JSON.parse(this.electronService.fs.readFileSync(`${this.workspace}/${folder}/metadata.json`, 'utf8')) as CourseMetadataDto;
        const packageJson = JSON.parse(this.electronService.fs.readFileSync(`${this.workspace}/${folder}/package.json`, 'utf8'));
        return {
          metadata,
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

  selectWorkspaceFolder() {
    this.electronService.dialog.showOpenDialog({properties: ['openDirectory'], defaultPath: this.workspace}).then(r => {
      if (r.filePaths.length > 0) {
        this.workspace = r.filePaths[0];
        localStorage.setItem('workspace', this.workspace);
        this.updateProjects();
      }
    });
  }
}
