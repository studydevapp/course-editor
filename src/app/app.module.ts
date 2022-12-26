import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CoreModule} from './core/core.module';

import {AppRoutingModule} from './app-routing.module';

// NG Translate
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {AppComponent} from './app.component';
import {MatButtonModule} from '@angular/material/button';
import {OverviewComponent} from './pages/overview/overview.component';
import {CourseSettingsComponent} from './dialog/course-settings/course-settings.component';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FlexModule} from '@angular/flex-layout';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ProjectComponent} from './pages/project/project.component';
import {MatIconModule} from '@angular/material/icon';
import {ProjectTasksComponent} from './pages/project/project-tasks/project-tasks.component';
import {ProjectOverviewComponent} from './pages/project/project-overview/project-overview.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ConfirmDialogComponent} from './dialog/confirm-dialog/confirm-dialog.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatMenuModule} from '@angular/material/menu';
import {SettingsComponent} from './pages/settings/settings.component';
import {CourseExecutionDialogComponent} from './dialog/course-execution-dialog/course-execution-dialog.component';
import {SafePipe} from './common/pipes/Safe.pipe';
import {MatBadgeModule} from '@angular/material/badge';
import {CodeEditorComponent} from './comps/code-editor/code-editor.component';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    CourseSettingsComponent,
    ProjectComponent,
    ProjectTasksComponent,
    ProjectOverviewComponent,
    ConfirmDialogComponent,
    SettingsComponent,
    CourseExecutionDialogComponent,
    SafePipe,
    CodeEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FlexModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatBadgeModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
