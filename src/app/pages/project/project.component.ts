import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {CourseService} from '../../services/course.service';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs';
import {MatDialog} from "@angular/material/dialog";
import {ProjectDto} from "../../dto/Project.dto";
import {CourseSettingsComponent} from "../../dialog/course-settings/course-settings.component";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  //project = this.courseService.$projects.value[this.activatedRoute.snapshot.data.slug];

  $project = this.activatedRoute.params.pipe(
    map(d => d.slug),
    map(slug => this.courseService.$projects.value.find(p => p.metadata.slug === slug))
  );

  constructor(private title: Title,
              private activatedRoute: ActivatedRoute,
              private courseService: CourseService,
              private dialog: MatDialog) {
  }

  ngOnInit() {

  }

  openSettings(project: ProjectDto) {
    this.dialog.open(CourseSettingsComponent, {
      data: {project}
    });
  }
}
