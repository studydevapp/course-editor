import {Component, Input, OnInit} from '@angular/core';
import {ProjectDto} from '../../../dto/Project.dto';

@Component({
  selector: 'app-project-tasks',
  templateUrl: './project-tasks.component.html',
  styleUrls: ['./project-tasks.component.scss']
})
export class ProjectTasksComponent implements OnInit {

  @Input() project: ProjectDto;
  @Input() lang: 'de' | 'en';
  editorOptions = {theme: 'vs-dark', language: 'html'};

  constructor() {
  }

  ngOnInit(): void {
  }

}
