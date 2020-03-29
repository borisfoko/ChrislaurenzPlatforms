import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PagesRoutingModule } from './pages-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { LookbookComponent } from './lookbook/lookbook.component';
import { GridTwoColComponent } from './portfolio/grid-two-col/grid-two-col.component';
import { GridThreeColComponent } from './portfolio/grid-three-col/grid-three-col.component';
import { GridFourColComponent } from './portfolio/grid-four-col/grid-four-col.component';
import { MasonaryTwoGridComponent } from './portfolio/masonary-two-grid/masonary-two-grid.component';
import { MasonaryThreeGridComponent } from './portfolio/masonary-three-grid/masonary-three-grid.component';
import { MasonaryFourGridComponent } from './portfolio/masonary-four-grid/masonary-four-grid.component';
import { MasonaryFullwidthComponent } from './portfolio/masonary-fullwidth/masonary-fullwidth.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    PagesRoutingModule,
    SlickCarouselModule
  ],
  declarations: [
    LookbookComponent,
    GridTwoColComponent,
    GridThreeColComponent,
    GridFourColComponent,
    MasonaryTwoGridComponent,
    MasonaryThreeGridComponent,
    MasonaryFourGridComponent,
    MasonaryFullwidthComponent
  ]
})
export class PagesModule { }
