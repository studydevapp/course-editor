import {Component, Inject, OnInit} from '@angular/core';
import {StudyDevService} from '../../services/study-dev.service';
import {CourseMetadataDto} from '../../dto/CourseMetadata.dto';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-course-settings',
  templateUrl: './course-settings.component.html',
  styleUrls: ['./course-settings.component.scss']
})
export class CourseSettingsComponent implements OnInit {

  $topics = this.sdService.getTopics();

  metadata = {} as CourseMetadataDto;

  constructor(private sdService: StudyDevService,
              @Inject(MAT_DIALOG_DATA) public data: { course_metadata: CourseMetadataDto },
              private dialogRef: MatDialogRef<CourseSettingsComponent>) {
    if (this.data?.course_metadata) {
      this.metadata = this.data.course_metadata;
    }
  }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.metadata);
  }
}
