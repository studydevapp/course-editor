import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {CourseService} from '../../services/course.service';
import {ActivatedRoute} from '@angular/router';
import {map, Observable, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ProjectDto} from '../../dto/Project.dto';
import {CourseSettingsComponent} from '../../dialog/course-settings/course-settings.component';
import {ComponentCanDeactivate} from '../../common/guards/pending-changes.guard';
import {MatSnackBar} from "@angular/material/snack-bar";
import {TaskType, TaskTypes} from "./project-tasks/TaskTypes";
import {ElectronService} from "../../core/services";
import {CourseExecutionDialogComponent} from "../../dialog/course-execution-dialog/course-execution-dialog.component";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  taskTypes = TaskTypes;

  //project = this.courseService.$projects.value[this.activatedRoute.snapshot.data.slug];

  projectCopy: ProjectDto;
  project: ProjectDto;

  lang: 'de' | 'en' = 'de';

  loading = false;

  subs = new Subscription();

  constructor(private title: Title,
              private activatedRoute: ActivatedRoute,
              private courseService: CourseService,
              private snackService: MatSnackBar,
              private electronService: ElectronService,
              private dialog: MatDialog) {
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    //return !this.hasChanged();
    return true; // TODO: remove after release
  }

  ngOnInit() {
    this.subs.add(this.activatedRoute.params.pipe(
        map(d => d.slug),
        map(slug => this.courseService.$projects.value.find(p => p.metadata.slug === slug)),
      ).subscribe(p => {
        this.project = JSON.parse(JSON.stringify(p));
        this.courseService.loadProjectInfo(this.project);

        this.projectCopy = JSON.parse(JSON.stringify(this.project));
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

  addTask(taskType: TaskType) {
    // create new file
    //this.electronService.fs.writeFileSync(`${this.project.path} / src /${this.project.metadata.text}`, template);

    this.project.metadata.text.de.tasks.push({title: '', content: ''});
    this.project.metadata.text.en.tasks.push({title: '', content: ''});

    // this is for the saveProject function
    this.project.info.tasks.push({type: taskType, code: ''});

    // create new file with content
    this.electronService.fs.writeFileSync(`${this.project.path}/src/task${this.project.metadata.text.de.tasks.length}.ts`, taskType.template);

    this.save();
  }

  async saveDeployStart() {
    try {
      this.loading = true;
      this.save();
      await this.deploy();
      this.startCourse();
    } catch (e) {
      console.error(e);
      if (e) {
        this.snackService.open(e as string ?? 'Failed', undefined, {duration: 3000});
      }
    }
    this.loading = false;
  }

  save() {
    this.courseService.saveProject(this.project);
    this.projectCopy = JSON.parse(JSON.stringify(this.project));
    this.snackService.open('Saved', undefined, {duration: 2000});
  }

  async deploy() {
    await this.courseService.buildProject(this.project);
  }

  startCourse() {
    this.dialog.open(CourseExecutionDialogComponent, {
      data: {project: this.project},
      panelClass: 'no-padding-full-width'
    });
  }
}
