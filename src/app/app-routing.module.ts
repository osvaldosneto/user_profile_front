import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './view/home/home.component';
import { LoginComponent } from './view/login/login.component';
import { AuthGuard } from './service/auth.guard';
import { UserFormComponent } from './view/user-form/user-form.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user-form',
    component: UserFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: '**', 
    redirectTo: '/' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
