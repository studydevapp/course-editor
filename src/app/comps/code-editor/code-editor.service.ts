import {Injectable} from '@angular/core';
import * as m from 'monaco-editor';

@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {

  monaco: typeof m = m;

  constructor() {
  }

  setup() {
    m.editor.defineTheme('studydev', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#021b3a'
      }
    });
  }
}
