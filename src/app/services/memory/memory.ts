import {inject, Injectable} from '@angular/core';
import {Book} from "../../models/book";
import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";
import {Core} from "../../models/core";
import {Roster} from "../../models/roster";
import {Datafiles} from "../datafiles/datafiles";

@Injectable({
    providedIn: 'root',
})
export class Memory {
    readonly datafilesService = inject(Datafiles)

    readonly activeRoster = new Subject<Roster>();
    readonly rosters = new BehaviorSubject<Roster[]>([]);

    books: Book[] = [];
    booksSubscription: Subscription;
    core!: Core;
    coreSubscription: Subscription;

    constructor() {
        this.booksSubscription = this.datafilesService.getBooks().subscribe( data => this.books = data);
        this.coreSubscription = this.datafilesService.getCore().subscribe( data => this.core = data);
    }

    setActiveRoster(activeRoster: Roster): void {
        this.activeRoster.next(activeRoster);
        localStorage.setItem('activeRoster', JSON.stringify(activeRoster));
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

    cloneObject(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }
}
