import {Component, OnInit} from '@angular/core';
import {ElectronService} from './core/services';
import {TranslateService} from '@ngx-translate/core';
import {APP_CONFIG} from '../environments/environment';
import {Title} from '@angular/platform-browser';
import {CourseService} from './services/course.service';
import {MiscService} from './services/misc.service';
import {CodeEditorService} from './comps/code-editor/code-editor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  test = 'test';
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    public title: Title,
    public courseService: CourseService,
    public miscService: MiscService,
    public codeEditorService: CodeEditorService,
  ) {
    this.translate.setDefaultLang('en');
    console.log('APP_CONFIG', APP_CONFIG);

    /*if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }*/
  }

  ngOnInit() {
    this.courseService.setup();
    this.miscService.setup();
    this.codeEditorService.setup();
    this.courseService.updateProjects();
  }
}
