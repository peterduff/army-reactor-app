import {Component, inject} from '@angular/core';
import {Book} from "../../models/book";
import {Subscription} from "rxjs";
import {Datafiles} from "../../services/datafiles/datafiles";
import {Memory} from "../../services/memory/memory";
import {Router} from "@angular/router";
import {JsonPipe} from "@angular/common";
import {Roster} from "../../models/roster";

@Component({
    selector: 'app-list',
    imports: [
        JsonPipe
    ],
    templateUrl: './list.html',
    styleUrl: './list.scss',
})
export class List {
    readonly datafilesService = inject(Datafiles)
    readonly memoryService = inject(Memory)
    readonly router: Router = inject(Router);

    books!: Book[];
    booksSubscription: Subscription;
    activeRoster!: Roster;
    activeRosterSubscription: Subscription;

    constructor() {
        this.booksSubscription = this.datafilesService.getBooks().subscribe(data => this.books = data);
        this.activeRosterSubscription = this.memoryService.getActiveRoster().subscribe(data => this.activeRoster = data);
    }
}
