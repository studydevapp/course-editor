import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  settings = {
    deepl_api_key: '',
    studydev_auth_token: ''
  };

  constructor(private snackService: MatSnackBar,
              private http: HttpClient) {
  }

  setup() {
    if (localStorage.getItem('settings')) {
      this.settings = {
        ...this.settings,
        ...JSON.parse(localStorage.getItem('settings'))
      };
    }
  }

  saveSettings() {
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  translate(targetLang: string, text: string[]) {
    return this.http.post<any>(`https://api-free.deepl.com/v2/translate`, {
      target_lang: targetLang,
      text: text,
      ignore_tags: ['pre', 'mark'],
      tag_handling: 'xml'
    }, {
      headers: {
        Authorization: 'DeepL-Auth-Key ' + this.settings.deepl_api_key
      }
    }).pipe(
      map(r => r.translations as { text: string }[])
    );
  }

}
