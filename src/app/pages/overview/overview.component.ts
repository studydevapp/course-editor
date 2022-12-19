import {Component, OnInit} from '@angular/core';
import {CourseService} from '../../services/course.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  latestSdkVersion: string;

  constructor(public courseService: CourseService,
              private http: HttpClient) {
  }

  ngOnInit() {
    //this.courseService.createNewCourse();
    this.http.get<{ version: string }>('https://registry.npmjs.org/@studydev/sdk/latest').subscribe(res => {
      this.latestSdkVersion = res.version;
    });
  }

}
