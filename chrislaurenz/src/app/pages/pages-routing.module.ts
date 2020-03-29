import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LookbookComponent } from './lookbook/lookbook.component';
// Portfolio Page
import { GridTwoColComponent } from './portfolio/grid-two-col/grid-two-col.component';
import { GridThreeColComponent } from './portfolio/grid-three-col/grid-three-col.component';
import { GridFourColComponent } from './portfolio/grid-four-col/grid-four-col.component';
import { MasonaryTwoGridComponent } from './portfolio/masonary-two-grid/masonary-two-grid.component';
import { MasonaryThreeGridComponent } from './portfolio/masonary-three-grid/masonary-three-grid.component';
import { MasonaryFourGridComponent } from './portfolio/masonary-four-grid/masonary-four-grid.component';
import { MasonaryFullwidthComponent } from './portfolio/masonary-fullwidth/masonary-fullwidth.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'lookbook',
        component: LookbookComponent
      },
      {
        path: 'grid/two/column',
        component: GridTwoColComponent
      },
      {
        path: 'grid/three/column',
        component: GridThreeColComponent
      },
      {
        path: 'grid/four/column',
        component: GridFourColComponent
      },
      {
        path: 'grid/two/masonary',
        component: MasonaryTwoGridComponent
      },
      {
        path: 'grid/three/masonary',
        component: MasonaryThreeGridComponent
      },
      {
        path: 'grid/four/masonary',
        component: MasonaryFourGridComponent
      },
      {
        path: 'fullwidth/masonary',
        component: MasonaryFullwidthComponent
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
