import { Routes } from '@angular/router';
import { NotfoundComponent } from './shop/home/notfound/notfound.component';

export const rootRouterConfig: Routes = [
  {
    path: '',
    pathMatch: 'full',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule),
      },
      {
        path: 'blog',
        pathMatch: 'full',
        loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule)
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotfoundComponent
  }
];