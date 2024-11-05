import { Routes } from '@angular/router';
import { LoginInternoComponent } from './components/login-interno/login-interno.component';
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent
    },
    {
        path: 'login-interno',
        component: LoginInternoComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
