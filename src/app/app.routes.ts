import { Routes } from '@angular/router';
import {Home} from "./components/home/home";
import {List} from "./components/list/list";
import {Datafiles} from "./components/datafiles/datafiles";

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'home', component: Home},
    {path: 'list', component: List},
    {path: 'datafiles', component: Datafiles}
];
