import {Component, inject, OnInit} from '@angular/core';
import {Datafiles} from "../../services/datafiles/datafiles";
import {Memory} from "../../services/memory/memory";
import {Router} from "@angular/router";
import {Book} from "../../models/book";
import {Subscription} from "rxjs";
import {Roster} from "../../models/roster";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {faSolidPlus} from "@ng-icons/font-awesome/solid";
import {heroSquare2Stack} from "@ng-icons/heroicons/outline";
import {Calculation} from "../../services/calculation/calculation";

@Component({
    selector: 'app-add-unit',
    imports: [

    ],
    viewProviders: [provideIcons({faSolidPlus, heroSquare2Stack})],
    templateUrl: './add-unit.html',
    styleUrl: './add-unit.scss',
})
export class AddUnit implements OnInit {
    readonly datafilesService = inject(Datafiles);
    readonly memoryService = inject(Memory);
    readonly calculationService = inject(Calculation);
    readonly router: Router = inject(Router);

    books!: Book[];
    booksSubscription: Subscription;
    activeRoster!: Roster;
    activeRosterSubscription: Subscription;

    activeBook!: Book;

    constructor() {
        this.booksSubscription = this.datafilesService.getBooks().subscribe(data => this.books = data);
        this.activeRosterSubscription = this.memoryService.getActiveRoster().subscribe(data => this.activeRoster = data);
    }

    ngOnInit() {
        this.datafilesService.setCore(this.datafilesService.localGetCore());
        this.datafilesService.setBooks(this.datafilesService.localGetBooks());
        this.memoryService.setActiveRoster(this.memoryService.localGetActiveRoster());
        this.memoryService.setRosters(this.memoryService.localGetRosters());

        this.activeBook = this.books?.find(book => book.config.rulesetId === this.activeRoster.rulesetId)!;
    }
}
