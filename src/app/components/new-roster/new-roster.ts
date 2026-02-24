import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Core} from "../../models/core";
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
    books!: Book[];
    rosters!: Roster[] ;

    bookId!: string;
    detachmentId!: string;

    constructor() {
        this.datafilesService.getCore().subscribe(data => this.core = data);
        this.datafilesService.getBooks().subscribe(data => this.books = data);
        this.memoryService.getRosters().subscribe(data => this.rosters = data);
    }

    ngOnInit() {
        this.datafilesService.setCore(this.datafilesService.localGetCore());
        this.datafilesService.setBooks(this.datafilesService.localGetBooks());
        this.bookId = this.books[0].config.rulesetId;
        this.detachmentId = this.findBook().detachments[0].id;
    }

    findBook(): Book {
        return this.books?.find(book => book.config.rulesetId === this.bookId)!;
    }

    findDetachmentName(detachmentId: string): string {
        return this.findBook().detachments.find(detachment => detachment.id === detachmentId)!.name;
    }

    updateDetachmentIdDefault(): void {
        this.detachmentId = this.findBook().detachments[0].id;
    }

    createList(name: string) {
        let newRoster = new Roster(uuid.v4(), name ? name : this.findDetachmentName(this.detachmentId), this.bookId, this.detachmentId, []);
        this.rosters ? this.rosters.push(newRoster) : this.rosters = [newRoster];
        this.memoryService.setRosters(this.rosters);
        this.memoryService.setActiveRoster(newRoster);
        this.router.navigate(['/roster']);
    }
}
