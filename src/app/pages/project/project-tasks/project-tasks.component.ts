import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProjectDto} from '../../../dto/Project.dto';
import {TaskType, TaskTypes} from './TaskTypes';
import {ElectronService} from '../../../core/services';
import {CourseService} from '../../../services/course.service';
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../../dialog/confirm-dialog/confirm-dialog.component";
import {filter} from "rxjs";

@Component({
  selector: 'app-project-tasks',
  templateUrl: './project-tasks.component.html',
  styleUrls: ['./project-tasks.component.scss']
})
export class ProjectTasksComponent implements OnInit {

  taskTypes = TaskTypes;

  @Input() project: ProjectDto;
  @Input() lang: 'de' | 'en';

  @Output() save = new EventEmitter();

  constructor(private electronService: ElectronService,
              private dialog: MatDialog,
              private courseService: CourseService) {
  }

  ngOnInit() {
    // load tasks
    // ${this.project.path}/src/index.ts
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

    this.save.emit();
  }

  deleteTask(deleteIndex: number) {
    this.dialog.open(ConfirmDialogComponent, {data: {message: 'Do you really want to delete this task?<br/>(Save all open files in your editor for this course, otherwise you will lose data!)'}}).afterClosed().pipe(filter(d => !!d)).subscribe(() => {
      this.project.metadata.text.de.tasks.splice(deleteIndex, 1);
      this.project.metadata.text.en.tasks.splice(deleteIndex, 1);
      this.save.emit(); // this will also load task content
      // delete all task files & recreate them
      this.project.info.tasks.forEach((t, i) => this.electronService.fs.rmSync(`${this.project.path}/src/task${i + 1}.ts`));
      this.project.info.tasks.splice(deleteIndex, 1);
      this.project.info.tasks.forEach((t, index) => {
        this.electronService.fs.writeFileSync(`${this.project.path}/src/task${index + 1}.ts`, t.code);
      });
      this.save.emit();
    });
  }

  openInVsCode(i: number) {
    this.electronService.childProcess.execSync(`code ${this.project.path}/src/task${i + 1}.ts`);
  }
}
