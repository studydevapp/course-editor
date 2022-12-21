import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ProjectDto} from "../../dto/Project.dto";
import {APP_CONFIG} from "../../../environments/environment";
import {MiscService} from "../../services/misc.service";

@Component({
  selector: 'app-course-execution-dialog',
  templateUrl: './course-execution-dialog.component.html',
  styleUrls: ['./course-execution-dialog.component.scss']
})
export class CourseExecutionDialogComponent implements OnInit {

  src: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { project: ProjectDto },
              private miscService: MiscService) {
    this.src = (APP_CONFIG.production ? `https://study.dev` : `http://localhost:4200`) + `/dashboard/explore?start_course_immediately=${data.project.metadata.slug}&auth_token=${miscService.settings.studydev_auth_token}`;
  }

  ngOnInit() {
  }

}
