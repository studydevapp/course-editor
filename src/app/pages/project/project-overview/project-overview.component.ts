import {Component, Input, OnInit} from '@angular/core';
import {ProjectDto} from "../../../dto/Project.dto";

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {

  @Input() project: ProjectDto;
  @Input() lang: 'de' | 'en';

  constructor() {
  }

  ngOnInit(): void {
  }

}
