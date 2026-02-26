import {Routes} from '@angular/router';
import {Home} from "./components/home/home";
import {RosterView} from "./components/roster-view/roster-view";
import {AddDatafiles} from "./components/add-datafiles/add-datafiles";
import {NewRoster} from "./components/new-roster/new-roster";
import {AddUnit} from "./components/add-unit/add-unit";
import {UnitView} from "./components/unit-view/unit-view";
import {Faq} from "./components/faq/faq";

export const routes: Routes = [
    {
        path: '', component: Home
    },
    {
        path: 'home', component: Home
    },
    {
        path: 'datafiles', component: AddDatafiles
    },
    {
        path: 'newroster', component: NewRoster
    },
    {
        path: 'roster', component: RosterView
    },
    {
        path: 'addunit', component: AddUnit
    },
    {
        path: 'unit', component: UnitView
    },
    {
        path: 'faq', component: Faq
    }
];
