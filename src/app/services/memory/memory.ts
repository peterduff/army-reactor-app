import {inject, Injectable} from '@angular/core';
import {Book} from "../../models/book";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Core} from "../../models/core";
import {Roster} from "../../models/roster";
import {Datafiles} from "../datafiles/datafiles";
import {Unit} from "../../models/unit";

@Injectable({
    providedIn: 'root',
})
export class Memory {
    readonly datafilesService = inject(Datafiles)

    readonly activeUnit = new Subject<Unit>();
    readonly activeRoster = new Subject<Roster>();
    readonly rosters = new BehaviorSubject<Roster[]>([]);

    books: Book[] = [];
    core!: Core;
    _rosters!: Roster[];

    constructor() {
        this.datafilesService.getBooks().subscribe( data => this.books = data);
        this.datafilesService.getCore().subscribe( data => this.core = data);
        this.getRosters().subscribe( data => this._rosters = data);
    }

    setActiveRoster(activeRoster: Roster): void {
        this.activeRoster.next(activeRoster);
        localStorage.setItem('activeRoster', JSON.stringify(activeRoster));

        let targetRoster = this._rosters.find(roster => roster.uuid === activeRoster.uuid);
        this._rosters.splice(this._rosters.indexOf(targetRoster!), 1, activeRoster);
        this.setRosters(this._rosters);
    }

    getActiveRoster(): Observable<Roster> {
        return this.activeRoster.asObservable();
    }

    localGetActiveRoster(): Roster {
        return JSON.parse(localStorage.getItem('activeRoster')!);
    }

    setRosters(rosters: Roster[]): void {
        this.rosters.next(rosters);
        localStorage.setItem('rosters', JSON.stringify(rosters));
    }

    getRosters(): Observable<Roster[]> {
        return this.rosters.asObservable();
    }

    localGetRosters(): Roster[] {
        return JSON.parse(localStorage.getItem('rosters')!);
    }

    setActiveUnit(unit: Unit | null): void {
        this.activeUnit.next(unit!);
    }

    getActiveUnit(): Observable<Unit> {
        return this.activeUnit.asObservable();
    }

    cloneObject(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }
}
