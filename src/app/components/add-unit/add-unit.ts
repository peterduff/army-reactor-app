import {Component, inject, OnInit} from '@angular/core';
import {Datafiles} from "../../services/datafiles/datafiles";
import {Memory} from "../../services/memory/memory";
import {Router} from "@angular/router";
import {Alliance, Book} from "../../models/book";
import {Roster} from "../../models/roster";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {faSolidCrown, faSolidVanShuttle, faSolidXmark, faSolidBoltLightning, faSolidUserGroup, faSolidCaretLeft} from "@ng-icons/font-awesome/solid";
import {mynaFatArrowUpSolid} from "@ng-icons/mynaui/solid";
import {Calculation} from "../../services/calculation/calculation";
import {UnitFilterPipe} from "../../pipes/unit-filter/unit-filter-pipe";
import {AlphabeticalPipe} from "../../pipes/alphabetical/alphabetical-pipe";
import {Unit} from "../../models/unit";
import * as uuid from "uuid";
import {BlockedFilterPipe} from "../../pipes/blocked-filter/blocked-filter-pipe";
import {Construction} from "../../services/construction/construction";

@Component({
    selector: 'app-add-unit',
    imports: [NgIcon, UnitFilterPipe, AlphabeticalPipe, BlockedFilterPipe],
    viewProviders: [provideIcons({faSolidXmark, faSolidCrown, faSolidCaretLeft, faSolidVanShuttle, faSolidBoltLightning, mynaFatArrowUpSolid, faSolidUserGroup})],
    templateUrl: './add-unit.html',
    styleUrl: './add-unit.scss',
})
export class AddUnit implements OnInit {
    readonly datafilesService = inject(Datafiles);
    readonly memoryService = inject(Memory);
    readonly calculationService = inject(Calculation);
    readonly constructionService = inject(Construction);
    readonly router: Router = inject(Router);

    books!: Book[];
    activeRoster!: Roster;

    activeBook!: Book;

    constructor() {
        this.datafilesService.getBooks().subscribe(data => this.books = data);
        this.memoryService.getActiveRoster().subscribe(data => this.activeRoster = data);
    }

    ngOnInit() {
        this.datafilesService.setCore(this.datafilesService.localGetCore());
        this.datafilesService.setBooks(this.datafilesService.localGetBooks());
        this.memoryService.setRosters(this.memoryService.localGetRosters());
        this.memoryService.setActiveRoster(this.memoryService.localGetActiveRoster());

        this.activeBook = this.books?.find(book => book.config.rulesetId === this.activeRoster.rulesetId)!;
        this.createAlliances();
    }

    createAlliances(): void {
        this.activeBook.alliances = [];
        let detachmentUnitIds: string[] = this.activeBook.detachments.find(detachment => detachment.id === this.activeRoster.detachmentId)!.additionalDatasheets;

        detachmentUnitIds.forEach(detachmentUnitId => {
            let alliance = new Alliance('', []);
            let book = this.books?.find(book => book.units.find(unit => unit.id === detachmentUnitId));

            if (book) {
                alliance.name = book.config.name;

                book.units.forEach(unit => {
                    if (this.activeBook.alliances!.find(alliance => alliance.name === book.config.name)) {
                        if (detachmentUnitId === unit.id) {
                            unit.ally = true;
                            this.activeBook.alliances!.find(alliance => alliance.name === book.config.name)!.units.push(unit);
                        }
                    } else {
                        if (detachmentUnitId === unit.id) {
                            unit.ally = true;
                            alliance.units.push(unit);
                        }
                    }
                });

                if (!this.activeBook.alliances!.find(alliance => alliance.name === book.config.name)) {
                    this.activeBook.alliances!.push(this.memoryService.cloneObject(alliance));
                }
            }
        });

        this.activeBook.config.associatedRulesets.forEach(ruleset => {
            let book = this.books.find(book => book.config.rulesetId === ruleset)!;
            let alliance = new Alliance (book.config.name, []);
            book.units.forEach(unit => {
                unit.ally = true;
                alliance.units.push(unit);
            });

            this.activeBook.alliances!.push(this.memoryService.cloneObject(alliance));
        });
    }

    findBlockList(): string[] {
        if (this.activeBook.detachments.find(detachment => detachment.id === this.activeRoster.detachmentId)!.blockedDatasheets) {
            return this.activeBook.detachments.find(detachment => detachment.id === this.activeRoster.detachmentId)?.blockedDatasheets!;
        } else {
            return []
        }
    }

    addUnit(unit: Unit): void {
        let newUnit = this.assembleUnit(this.memoryService.cloneObject(unit));
        newUnit.uuid = uuid.v4();
        this.activeRoster.units.push(newUnit);
        this.activeRoster.units = new AlphabeticalPipe().transform(this.activeRoster.units, 'name');
        this.memoryService.setActiveRoster(this.activeRoster);
    }

    removeUnit(unit: Unit): void {
        let similarUnit: Unit = this.activeRoster.units.find(u => u.name === unit.name)!;
        this.activeRoster.units.splice(this.activeRoster.units.indexOf(similarUnit), 1);
        this.memoryService.setActiveRoster(this.memoryService.cloneObject(this.activeRoster));
    }

    assembleUnit(unit: Unit): Unit {
        return this.constructionService.assembleUnit(this.activeBook, this.activeRoster, unit);
    }

    unitExistsInRoster(item: Unit): boolean {
        return this.activeRoster.units.some(unit => unit?.name === item.name);
    }

    unitNumbersInRoster(item: Unit): number {
        return this.activeRoster.units.filter(unit => unit?.name === item.name).length;
    }
}
