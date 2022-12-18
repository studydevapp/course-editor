import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OverviewComponent} from './pages/overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
    pathMatch: 'full'
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
