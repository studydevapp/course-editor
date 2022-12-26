import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {CourseService} from '../../services/course.service';
import {HttpClient} from '@angular/common/http';
import {ProjectDto} from '../../dto/Project.dto';
import {ElectronService} from '../../core/services';

const semver = require('semver');

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  latestSdkVersion: string;

  constructor(public courseService: CourseService,
              private electronService: ElectronService,
              private changeDetectorRef: ChangeDetectorRef,
              private ngZone: NgZone,
              private http: HttpClient) {
  }

  ngOnInit() {
    //this.courseService.createNewCourse();
    this.http.get<{ version: string }>('https://registry.npmjs.org/@studydev/sdk/latest').subscribe(res => {
      this.latestSdkVersion = res.version;
    });
  }

  hasUpdate(sdkVersion: string) {
    return semver.diff(this.latestSdkVersion, sdkVersion.replace('^', ''));
  }

  update(project: ProjectDto) {
    project['_sdk_update'] = true;
    const cmd = this.electronService.childProcess.exec(`cd ${project.path} && npm install @studydev/sdk@${this.latestSdkVersion}`);
    cmd.on('exit', () => {
      this.courseService.updateProjects();
      project['_sdk_update'] = false;
      this.ngZone.run(() => this.changeDetectorRef.detectChanges());
    });
    cmd.stdout.on('data', (data) => {
      console.log(data);
    });
    cmd.stderr.on('data', (data) => {
      console.error(data);
    });
  }

}
