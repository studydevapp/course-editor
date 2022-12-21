import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProjectDto} from '../../../dto/Project.dto';
import {ElectronService} from '../../../core/services';
import {CourseService} from '../../../services/course.service';
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../../dialog/confirm-dialog/confirm-dialog.component";
import {filter} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TaskTypes} from "./TaskTypes";

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
              private snackService: MatSnackBar,
              private courseService: CourseService) {
  }

  ngOnInit() {
    // load tasks
    // ${this.project.path}/src/index.ts
  }

  deleteTask(deleteIndex: number) {
    this.dialog.open(ConfirmDialogComponent, {data: {message: 'Do you really want to delete this task?<br/>(Save all open files in your editor for this course, otherwise you will lose data!)'}}).afterClosed().pipe(filter(d => !!d)).subscribe(() => {
      this.save.emit(); // this will also load task content
      this.project.metadata.text.de.tasks.splice(deleteIndex, 1);
      this.project.metadata.text.en.tasks.splice(deleteIndex, 1);
      // delete all task files & recreate them
      this.project.info.tasks.forEach((t, i) => this.electronService.fs.rmSync(`${this.project.path}/src/task${i + 1}.ts`));
      this.project.info.tasks.splice(deleteIndex, 1);
      this.project.info.tasks.forEach((t, i) => this.electronService.fs.writeFileSync(`${this.project.path}/src/task${i + 1}.ts`, t.code));
      this.save.emit();
    });
  }

  openInVsCode(i: number) {
    this.electronService.childProcess.execSync(`code ${this.project.path}/src/task${i + 1}.ts`);
  }

  copyCodeTemplateToClipboard(codeLang: string) {
    navigator.clipboard.writeText(`<pre class="code-highlight" data-lang="text/${codeLang}">\n</pre>`).then(() => {
      this.snackService.open('Successfully copied into clipboard.', undefined, {duration: 3000, panelClass: 'success'});
    }).catch(err => {
      this.snackService.open('Could not copy to clipboard: ' + err, undefined, {duration: 3000, panelClass: 'error'});
    });
  }
}
