import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BlogRoutingModule } from './blog-routing.module'

import { BlogRightSidebarComponent } from './blog-right-sidebar/blog-right-sidebar.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    BlogRoutingModule
  ],
  declarations: [
    BlogRightSidebarComponent,
    BlogDetailsComponent
  ]
})
export class BlogModule { }
