import {Component, Inject, OnInit} from '@angular/core';
import {StudyDevService} from '../../services/study-dev.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProjectDto} from '../../dto/Project.dto';

@Component({
  selector: 'app-course-settings',
  templateUrl: './course-settings.component.html',
  styleUrls: ['./course-settings.component.scss']
})
export class CourseSettingsComponent implements OnInit {

  hideKey = true;

  $topics = this.sdService.getTopics();

  project = {metadata: {}} as ProjectDto;

  constructor(private sdService: StudyDevService,
              @Inject(MAT_DIALOG_DATA) public data: { project: ProjectDto },
              private dialogRef: MatDialogRef<CourseSettingsComponent>) {
    if (this.data?.project) {
      this.project = this.data.project;
    }
  }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.project);
  }
}
