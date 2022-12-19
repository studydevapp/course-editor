import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OverviewComponent} from './pages/overview/overview.component';
import {ProjectComponent} from './pages/project/project.component';
import {PendingChangesGuard} from './common/guards/pending-changes.guard';
import {SettingsComponent} from './pages/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
    pathMatch: 'full',
    title: 'Overview'
  },
  {path: 'settings', component: SettingsComponent, title: 'Settings'},
  {
    path: 'project/:slug',
    component: ProjectComponent,
    title: (data) => data.params.slug,
    canDeactivate: [PendingChangesGuard]
  },
  /*{
    path: '**',
    component: PageNotFoundComponent
  }*/
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
