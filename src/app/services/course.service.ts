import {Injectable} from '@angular/core';
import * as path from 'path';
import {ElectronService} from '../core/services';
import {MatDialog} from "@angular/material/dialog";
import {CourseSettingsComponent} from "../dialog/course-settings/course-settings.component";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  workspace: string;

  constructor(private electronService: ElectronService,
              private matDialog: MatDialog) {
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

  createNewCourse() {
    this.matDialog.open(CourseSettingsComponent, {}).afterClosed().subscribe(res => {
      
    });
  }
}
