import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogRightSidebarComponent } from './blog-right-sidebar/blog-right-sidebar.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'blog/right-sidebar',
        component: BlogRightSidebarComponent
      },
      {
        path: 'blog/details',
        component: BlogDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BlogRoutingModule { }
