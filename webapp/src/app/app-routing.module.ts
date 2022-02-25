import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchComponent} from './components/search/search.component';
import {CollectionComponent} from './components/collection/collection.component';
import {LogInComponent} from './components/log-in/log-in.component';
import {RegisterComponent} from './components/register/register.component';
import {AuthGuardService} from './services/auth-guard.service';

const routes: Routes = [
    {path: 'search', component: SearchComponent},
    {path: 'login', component: LogInComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'collections', component: CollectionComponent, canActivate: [AuthGuardService]},
    {path: '**', component: SearchComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
