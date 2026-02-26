import {Component, inject, OnInit} from '@angular/core';
import {Book} from "../../models/book";
import {Datafiles} from "../../services/datafiles/datafiles";
import {Memory} from "../../services/memory/memory";
import {Router, RouterLink} from "@angular/router";
import {Roster} from "../../models/roster";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {UnitFilterPipe} from "../../pipes/unit-filter/unit-filter-pipe";
import {AlphabeticalPipe} from "../../pipes/alphabetical/alphabetical-pipe";
import {Calculation} from "../../services/calculation/calculation";
import {Unit} from "../../models/unit";
import {heroSquare2Stack} from "@ng-icons/heroicons/outline";
import {ReactiveFormsModule} from "@angular/forms";
import {
    faSolidCheck,
    faSolidCaretDown,
    faSolidCrown,
    faSolidVanShuttle,
    faSolidBoltLightning,
    faSolidUserGroup, faSolidXmark
} from "@ng-icons/font-awesome/solid";
import {mynaFatArrowUpSolid} from "@ng-icons/mynaui/solid";
import {Export} from "../../services/export/export";

@Component({
    selector: 'app-list',
    imports: [NgIcon, RouterLink, UnitFilterPipe, AlphabeticalPipe, ReactiveFormsModule],
    viewProviders: [provideIcons({
        faSolidXmark,
        heroSquare2Stack,
        faSolidCaretDown,
        faSolidCheck,
        faSolidCrown,
        faSolidVanShuttle,
        faSolidBoltLightning,
        mynaFatArrowUpSolid,
        faSolidUserGroup
    })],
    templateUrl: './roster-view.html',
    styleUrl: './roster-view.scss',
})
export class RosterView implements OnInit {
    readonly datafilesService = inject(Datafiles);
    readonly memoryService = inject(Memory);
    readonly exportService = inject(Export);
    readonly calculationService = inject(Calculation);
    readonly router: Router = inject(Router);

    books!: Book[];
    activeRoster!: Roster;
    activeUnit!: Unit;

    deleteId!: string;

    constructor() {
        this.datafilesService.getBooks().subscribe(data => this.books = data);
        this.memoryService.getActiveRoster().subscribe(data => this.activeRoster = data);
        this.memoryService.getActiveUnit().subscribe(data => this.activeUnit = data);
    }

    ngOnInit() {
        this.datafilesService.setCore(this.datafilesService.localGetCore());
        this.datafilesService.setBooks(this.datafilesService.localGetBooks());
        this.memoryService.setRosters(this.memoryService.localGetRosters());
        this.memoryService.setActiveRoster(this.memoryService.localGetActiveRoster());
    }

    openUnit(unit: Unit): void {
        this.memoryService.setActiveUnit(unit);
        this.router.navigate(['/unit']);
    }

    findBook(): Book {
        return this.books?.find(book => book.config.rulesetId === this.activeRoster.rulesetId)!;
    }

    findDetachmentName(detachmentId: string): string {
        return this.findBook().detachments.find(detachment => detachment.id === detachmentId)!.name;
    }

    removeUnit(unit: Unit): void {
        this.activeRoster.units.splice(this.activeRoster.units.indexOf(unit), 1);
        this.memoryService.setActiveRoster(this.memoryService.cloneObject(this.activeRoster));
        this.router.navigate(['/roster']);
        this.deleteId = '';
    }
}
