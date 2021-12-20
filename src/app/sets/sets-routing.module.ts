import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetsPage } from './sets.page';

const routes: Routes = [
  {
    path: '',
    component: SetsPage
  },
  {
    path: 'set',
    loadChildren: () => import('./set/set.module').then( m => m.SetPageModule)
  },
  {
    path: 'set/:id',
    loadChildren: () => import('./set/set.module').then( m => m.SetPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetsPageRoutingModule {}
