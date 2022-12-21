import {Component, OnInit} from '@angular/core';
import {MiscService} from "../../services/misc.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  studydev_auth_token_hide = true;

  constructor(public miscService: MiscService) {
  }

  ngOnInit() {
  }
}
