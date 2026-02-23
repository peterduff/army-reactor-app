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
import {Equipment, Model, Option, Unit} from "../../models/unit";
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
        this.memoryService.setRosters(this.memoryService.localGetRosters());
        this.memoryService.setActiveRoster(this.memoryService.localGetActiveRoster());

        this.activeBook = this.books?.find(book => book.config.rulesetId === this.activeRoster.rulesetId)!;
    }

    addUnit(unit: Unit): void {
        let newUnit = this.assembleUnit(this.memoryService.cloneObject(unit));
        newUnit.uuid = uuid.v4();
        this.activeRoster.units.push(newUnit);
        this.memoryService.setActiveRoster(this.activeRoster);
    }

    assembleUnit(unit: Unit): Unit {
        if (unit.keywords.includes('CHARACTER')) {
            if (!unit.equipment) {
                unit.equipment = [];
            }

            unit.equipment.push(new Equipment('checkbox', ['WARLORD'], undefined, false));

            let enhancements: Option[] = [];
            this.activeBook.detachments.find(detachment => detachment.id === this.activeRoster.detachmentId)?.enhancements.forEach(enhancement => {
                if (this.includesAll(unit.keywords, enhancement.keywordsMustCombined)) {
                    enhancements.push(new Option([enhancement.name], false, enhancement.points));
                }
            });

            unit.equipment.push(new Equipment('dropdown', undefined, enhancements));
        }

        if (unit.blueprints) {
            unit.models = [];

            unit.blueprints.forEach(blueprint => {
                for (let i = 0; i < blueprint.min; i++) {
                    unit.models.push(blueprint);
                }
            });
        }

        return unit;
    }

    unitExistsInRoster(item: Unit): boolean {
        return this.activeRoster.units.some(unit => unit.name === item.name);
    }

    unitNumbersInRoster(item: Unit): number {
        return this.activeRoster.units.filter(unit => unit.name === item.name).length;
    }

    includesAll (arr: any[], subArr: any[]) {
        for (let item of subArr) {
            if (!arr.includes(item)) return false;
        }
        return true;
    }
}
