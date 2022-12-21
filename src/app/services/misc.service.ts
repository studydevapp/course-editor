import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  settings = {
    deepl_api_key: '',
    studydev_auth_token: ''
  };

  constructor(private snackService: MatSnackBar) {
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

  translate(targetLang: string, text: string) {
    return new Promise((resolve, reject) => {
      fetch(`https://api.deepl.com/v2/translate?auth_key=${this.settings.deepl_api_key}&target_lang=${targetLang}&text=${text}`)
        .then(response => response.json())
        .then(data => {
          resolve(data.translations[0].text);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

}
