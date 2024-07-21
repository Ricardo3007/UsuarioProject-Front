import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren:()=> import('./pages/auth/auth.routes')
  },
  {
    path: 'home',
/*     canActivate:[authGuard], */
    loadChildren:()=> import('./pages/home/home.routes')
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
