import {Injectable} from '@angular/core';
import loader from '@monaco-editor/loader';
import * as m from 'monaco-editor';

@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {

  monaco: typeof m = m;

  constructor() {
  }

  setup() {
    /*loader.config({monaco: m});
    loader.init().then(monaco => {
      this.monaco = monaco;
    });*/
    // load loader.js from monaco
    /*const loaderScript = document.createElement('script');
    loaderScript.type = 'text/javascript';
    loaderScript.src = '/assets/monaco/min/vs/loader.js';
    loaderScript.onload = () => {
      window.require.config({paths: {vs: '/assets/monaco/min/vs'}});
    };
    document.body.appendChild(loaderScript);**/
  }
}
