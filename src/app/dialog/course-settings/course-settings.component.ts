import {Component, Inject, OnInit} from '@angular/core';
import {StudyDevService} from '../../services/study-dev.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProjectDto} from '../../dto/Project.dto';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-course-settings',
  templateUrl: './course-settings.component.html',
  styleUrls: ['./course-settings.component.scss']
})
export class CourseSettingsComponent implements OnInit {

  hideKey = true;

  $topics = this.sdService.getTopics();

  project = {metadata: {}} as ProjectDto;

  fg = this.fb.group({
    key: ['', [Validators.required]],
    slug: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.pattern(/^[a-z0-9-]+$/)
    ]],
    topic: ['', [Validators.required]],
    difficulty: [0, [Validators.required]],
    reward: [0, []],
    active: [false, []],
    is_challenge: [false, []],
    request_features: [[] as string[], []],
  });

  constructor(private sdService: StudyDevService,
              @Inject(MAT_DIALOG_DATA) public data: { project: ProjectDto },
              private dialogRef: MatDialogRef<CourseSettingsComponent>,
              private fb: FormBuilder) {
    if (this.data?.project) {
      this.project = this.data.project;
      this.fg.patchValue({
        key: this.project.key,
        slug: this.project.metadata.slug,
        topic: this.project.metadata.topic,
        difficulty: this.project.metadata.difficulty,
        reward: this.project.metadata.reward,
        active: this.project.metadata.active,
        is_challenge: this.project.metadata.is_challenge,
        request_features: this.project.metadata.request_features,
      });
    }
  }

  ngOnInit() {
  }

  save() {
    this.project.key = this.fg.value.key;
    this.project.metadata = {
      ...this.project.metadata,
      slug: this.fg.value.slug,
      topic: this.fg.value.topic,
      difficulty: this.fg.value.difficulty,
      reward: this.fg.value.reward,
      active: this.fg.value.active,
      is_challenge: this.fg.value.is_challenge,
      request_features: this.fg.value.request_features
    };
    this.dialogRef.close(this.project);
  }
}
