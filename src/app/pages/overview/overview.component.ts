import {Component, OnInit} from '@angular/core';
import {CourseService} from '../../services/course.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  constructor(public courseService: CourseService) {
  }

  ngOnInit() {
    //this.courseService.createNewCourse();
  }

}
