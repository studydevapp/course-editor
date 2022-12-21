import {Component, Input, NgZone, OnInit} from '@angular/core';
import {ProjectDto} from "../../../dto/Project.dto";
import {ElectronService} from "../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CourseService} from "../../../services/course.service";

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {

  @Input() project: ProjectDto;
  @Input() lang: 'de' | 'en';

  copyingImage = false;
  rand = 0;

  constructor(private electronService: ElectronService,
              private snackService: MatSnackBar,
              private courseService: CourseService,
              private ngZone: NgZone) {
  }

  ngOnInit() {
  }

  changeThumbnail() {
    this.electronService.dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {name: 'PNG Image', extensions: ['png']}
      ]
    }).then(r => {
      this.copyingImage = true;
      if (r.filePaths.length > 0) {
        this.electronService.fs.copyFile(r.filePaths[0], `${this.project.path}/assets/thumbnail.png`, () => {
          this.ngZone.run(() => {
            this.rand = Math.random();
            setTimeout(() => this.copyingImage = false, 500);
            this.snackService.open('Thumbnail changed', undefined, {duration: 2000, panelClass: 'success'});
          });
        });
      }
    });
  }
}
