import { Routes } from '@angular/router';
import { DefaultComponent } from './shared/components/layouts/default/default.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component'; // Import the RegisterComponent
import { MasterComponent } from './shared/components/layouts/master/master.component';
import { TodoComponent } from './pages/todo/todo.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'register', component: RegisterComponent } // Add register route
    ],
  },
  {
    path: '',
    component: MasterComponent,
    children: [{ path: 'todo', component: TodoComponent }],
  },
];

