import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CodeEditorService} from "./code-editor.service";
import {editor} from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('monacoContainer') monacoContainer: ElementRef;

  @Input() content: string;
  @Output() contentChange = new EventEmitter<string>();

  @Input() language: string;

  codeEditor: IStandaloneCodeEditor;

  constructor(private codeEditorService: CodeEditorService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.codeEditor = this.codeEditorService.monaco.editor.create(this.monacoContainer.nativeElement, {
      model: this.codeEditorService.monaco.editor.createModel(this.content, this.language),
      theme: 'vs-dark',
      automaticLayout: true
    });

    this.codeEditor.onDidChangeModelContent(() => {
      this.contentChange.emit(this.codeEditor.getValue());
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content'] && this.codeEditor && this.codeEditor.getValue() !== changes['content'].currentValue) {
      this.codeEditor.setValue(changes['content'].currentValue);
    }
  }

}
