import {Component, inject, OnInit} from '@angular/core';
import {Datafiles} from "../../services/datafiles/datafiles";
import {Memory} from "../../services/memory/memory";
import {Router, RouterLink} from "@angular/router";
import {Book} from "../../models/book";
import {Subscription} from "rxjs";
import {Roster} from "../../models/roster";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {faSolidCrown, faSolidVanShuttle, faSolidBoltLightning} from "@ng-icons/font-awesome/solid";
import {mynaFatArrowUpSolid} from "@ng-icons/mynaui/solid";
import {Calculation} from "../../services/calculation/calculation";
import {UnitFilterPipe} from "../../pipes/unit-filter/unit-filter-pipe";
import {AlphabeticalPipe} from "../../pipes/alphabetical/alphabetical-pipe";
import {Unit} from "../../models/unit";
import * as uuid from "uuid";

@Component({
    selector: 'app-add-unit',
    imports: [NgIcon, UnitFilterPipe, AlphabeticalPipe, RouterLink],
    viewProviders: [provideIcons({faSolidCrown, faSolidVanShuttle, faSolidBoltLightning, mynaFatArrowUpSolid})],
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

    addUnit(unit: Unit): void {
        let newUnit = this.memoryService.cloneObject(unit);
        newUnit.uuid = uuid.v4();
        this.activeRoster.units.push(newUnit);
        this.memoryService.setActiveRoster(this.activeRoster);
    }

    unitExistsInRoster(item: Unit): boolean {
        return this.activeRoster.units.some(unit => unit.name === item.name);
    }

    unitNumbersInRoster(item: Unit): number {
        return this.activeRoster.units.filter(unit => unit.name === item.name).length;
    }
}
