import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetComponent } from './forget/forget.component';
import { NewpasswordComponent } from './newpassword/newpassword.component';
import { GridComponent } from './grid/grid.component';
import { Grid2Component } from './grid2/grid2.component';
import { Register2Component } from './register2/register2.component';

import { AuthGuard } from './guards/auth.guard';
import { Register3Component } from './register3/register3.component';
import { Grid3Component } from './grid3/grid3.component';


const routes: Routes = [
  {
    path:'',
    component:LoginComponent,
  },
  {
    path:'register',
    component:RegisterComponent,
  },
  {
    path:'register2',
    component:Register2Component,
  },
  {
    path:'register3',
    component:Register3Component,
  },
  {
    path:'forget',
    component:ForgetComponent,
  },
  {
    path:'newpassword',
    component:NewpasswordComponent,
  },
  {
    path:'grid',
    component:GridComponent,canActivate:[AuthGuard]
  },
  {
    path:'grid2',
    component:Grid2Component,
  },
  {
    path:'grid/grid3/:id',
    component:Grid3Component,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
