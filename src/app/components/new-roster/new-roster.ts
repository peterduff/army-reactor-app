import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Core} from "../../models/core";
import {Subscription} from "rxjs";
import {Datafiles} from "../../services/datafiles/datafiles";
import {Book} from "../../models/book";
import {FormsModule} from "@angular/forms";
import * as uuid from 'uuid';
import {Roster} from "../../models/roster";
import {Memory} from "../../services/memory/memory";

@Component({
    selector: 'app-new-list',
    imports: [
        FormsModule
    ],
    templateUrl: './new-roster.html',
    styleUrl: './new-roster.scss',
})
export class NewRoster implements OnInit {
    readonly datafilesService = inject(Datafiles);
    readonly memoryService = inject(Memory);
    readonly router: Router = inject(Router);

    core!: Core;
    coreSubscription: Subscription;
    books!: Book[];
    booksSubscription: Subscription;
    rosters!: Roster[] ;
    rostersSubscription: Subscription;

    bookId!: string;
    detachmentId!: string;

    constructor() {
        this.coreSubscription = this.datafilesService.getCore().subscribe(data => this.core = data);
        this.booksSubscription = this.datafilesService.getBooks().subscribe(data => this.books = data);
        this.rostersSubscription = this.memoryService.getRosters().subscribe(data => this.rosters = data);
    }

    ngOnInit() {
        this.datafilesService.setCore(this.datafilesService.localGetCore());
        this.datafilesService.setBooks(this.datafilesService.localGetBooks());
    }

    findBook(): Book {
        return this.books?.find(book => book.config.rulesetId === this.bookId)!;
    }

    findDetachmentName(detachmentId: string): string {
        return this.findBook().detachments.find(detachment => detachment.id === detachmentId)!.name;
    }

    createList(name: string) {
        let newRoster = new Roster(uuid.v4(), name ? name : this.findDetachmentName(this.detachmentId), this.bookId, this.detachmentId, []);
        this.memoryService.setActiveRoster(newRoster);
        this.rosters ? this.rosters.push(newRoster) : this.rosters = [newRoster];
        this.memoryService.setRosters(this.rosters);

        this.router.navigate(['/roster']);
    }
}
