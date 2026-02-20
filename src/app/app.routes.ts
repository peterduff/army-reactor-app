import { Routes } from '@angular/router';
import {Home} from "./components/home/home";
import {List} from "./components/list/list";
import {AddDatafiles} from "./components/add-datafiles/add-datafiles";
import {NewList} from "./components/new-list/new-list";

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'home', component: Home},
    {path: 'list', component: List},
    {path: 'datafiles', component: AddDatafiles},
    {path: 'newlist', component: NewList}
];
