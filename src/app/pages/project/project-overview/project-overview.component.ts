import {Component, Input, NgZone, OnInit} from '@angular/core';
import {ProjectDto} from '../../../dto/Project.dto';
import {ElectronService} from '../../../core/services';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CourseService} from '../../../services/course.service';
import {MiscService} from '../../../services/misc.service';

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

  langs = ['de', 'en'];

  constructor(private electronService: ElectronService,
              private snackService: MatSnackBar,
              private courseService: CourseService,
              private miscService: MiscService,
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

  translate(source: 'de' | 'en', target: string, i: number) {
    this.miscService.translate(target, [
      this.project.metadata.text[source].tasks[i].title,
      this.project.metadata.text[source].tasks[i].content
    ]).subscribe(r => {
      this.project.metadata.text[target].tasks[i].title = r[0].text;
      this.project.metadata.text[target].tasks[i].content = r[1].text;
    });
  }
}
