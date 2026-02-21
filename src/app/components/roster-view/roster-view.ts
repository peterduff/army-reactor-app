import {Component, inject, OnInit} from '@angular/core';
import {Book} from "../../models/book";
import {Subscription} from "rxjs";
import {Datafiles} from "../../services/datafiles/datafiles";
import {Memory} from "../../services/memory/memory";
import {Router, RouterLink} from "@angular/router";
import {Roster} from "../../models/roster";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {heroXMarkSolid} from "@ng-icons/heroicons/solid";
import {heroSquare2Stack} from "@ng-icons/heroicons/outline";

@Component({
    selector: 'app-list',
    imports: [NgIcon, RouterLink],
    viewProviders: [provideIcons({heroXMarkSolid, heroSquare2Stack})],
    templateUrl: './roster-view.html',
    styleUrl: './roster-view.scss',
})
export class RosterView implements OnInit {
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

    ngOnInit() {
        this.datafilesService.setCore(this.datafilesService.localGetCore());
        this.datafilesService.setBooks(this.datafilesService.localGetBooks());
        this.memoryService.setActiveRoster(this.memoryService.localGetActiveRoster());
        this.memoryService.setRosters(this.memoryService.localGetRosters());
    }

    findBook(): Book {
        return this.books?.find(book => book.config.rulesetId === this.activeRoster.rulesetId)!;
    }

    findDetachmentName(detachmentId: string): string {
        return this.findBook().detachments.find(detachment => detachment.id === detachmentId)!.name;
    }
}
