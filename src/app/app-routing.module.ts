import { LoginComponent } from './login/login.component';
import { AddformComponent } from './addform/addform.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './Services/auth.guard';

const routes: Routes = [
  { path: 'addform', component: AddformComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'admin', loadChildren: () => import('./admin-panel/admin-panel.module').then(m => m.AdminPanelModule) },

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
