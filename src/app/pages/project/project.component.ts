import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {CourseService} from '../../services/course.service';
import {ActivatedRoute} from '@angular/router';
import {map, Observable, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ProjectDto} from '../../dto/Project.dto';
import {CourseSettingsComponent} from '../../dialog/course-settings/course-settings.component';
import {ComponentCanDeactivate} from '../../common/guards/pending-changes.guard';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  //project = this.courseService.$projects.value[this.activatedRoute.snapshot.data.slug];

  projectCopy: ProjectDto;
  project: ProjectDto;

  lang: 'de' | 'en' = 'de';

  subs = new Subscription();

  constructor(private title: Title,
              private activatedRoute: ActivatedRoute,
              private courseService: CourseService,
              private dialog: MatDialog) {
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.hasChanged();
  }

  ngOnInit() {
    this.subs.add(this.activatedRoute.params.pipe(
        map(d => d.slug),
        map(slug => this.courseService.$projects.value.find(p => p.metadata.slug === slug)),
      ).subscribe(p => {
        this.project = JSON.parse(JSON.stringify(p));
        this.projectCopy = JSON.parse(JSON.stringify(p));
      })
    );
  }

  openSettings() {
    this.dialog.open(CourseSettingsComponent, {
      data: {project: this.project}
    });
  }

  hasChanged = () => JSON.stringify(this.projectCopy) !== JSON.stringify(this.project);

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
