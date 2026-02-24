import {Component, inject, OnInit} from '@angular/core';
import {Datafiles} from "../../services/datafiles/datafiles";
import {Memory} from "../../services/memory/memory";
import {Router} from "@angular/router";
import {Alliance, Book} from "../../models/book";
import {Roster} from "../../models/roster";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {faSolidCrown, faSolidVanShuttle, faSolidBoltLightning, faSolidUserGroup} from "@ng-icons/font-awesome/solid";
import {mynaFatArrowUpSolid} from "@ng-icons/mynaui/solid";
import {Calculation} from "../../services/calculation/calculation";
import {UnitFilterPipe} from "../../pipes/unit-filter/unit-filter-pipe";
import {AlphabeticalPipe} from "../../pipes/alphabetical/alphabetical-pipe";
import {Equipment, Option, Unit} from "../../models/unit";
import * as uuid from "uuid";

@Component({
    selector: 'app-add-unit',
    imports: [NgIcon, UnitFilterPipe, AlphabeticalPipe],
    viewProviders: [provideIcons({faSolidCrown, faSolidVanShuttle, faSolidBoltLightning, mynaFatArrowUpSolid, faSolidUserGroup})],
    templateUrl: './add-unit.html',
    styleUrl: './add-unit.scss',
})
export class AddUnit implements OnInit {
    readonly datafilesService = inject(Datafiles);
    readonly memoryService = inject(Memory);
    readonly calculationService = inject(Calculation);
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
            let book = this.books?.find(book => book.units.find(unit => unit.id === detachmentUnitId))!;
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

    addUnit(unit: Unit): void {
        let newUnit = this.assembleUnit(this.memoryService.cloneObject(unit));
        newUnit.uuid = uuid.v4();
        this.activeRoster.units.push(newUnit);
        this.activeRoster.units = new AlphabeticalPipe().transform(this.activeRoster.units, 'name');
        this.memoryService.setActiveRoster(this.activeRoster);
    }

    assembleUnit(unit: Unit): Unit {
        if (!unit.equipment) {
            unit.equipment = [];
        }

        if (unit.keywords.includes('CHARACTER')) {
            unit.equipment.push(new Equipment('checkbox', ['WARLORD'], undefined, false, undefined, 'red'));

            if (!unit.keywords.includes('EPIC HERO')) {
                let enhancements: Option[] = [];
                this.activeBook.detachments.find(detachment => detachment.id === this.activeRoster.detachmentId)?.enhancements.forEach(enhancement => {
                    if (this.includesAll(unit.keywords, enhancement.keywordsMustCombined)) {
                        enhancements.push(new Option([enhancement.name], false, enhancement.points));
                    }
                });

                unit.equipment.push(new Equipment('dropdown', undefined, enhancements, undefined, undefined, 'yellow'));
            }
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

    findAlliances(): Alliance[] {
        let allies: Alliance[] = [];

        let detachmentAllianceUnits: string[] = this.activeBook.detachments.find(detachment => detachment.id === this.activeRoster.detachmentId)!.additionalDatasheets;

        console.log(detachmentAllianceUnits);

        detachmentAllianceUnits.forEach(allyId => {
            let alliance = new Alliance('', []);
            this.books.forEach(book => {
                book.units.forEach(unit => {
                    if (allyId === unit.id) {
                        unit.ally = true;
                        alliance.units.push(unit);
                    }
                });
                allies.push(alliance);
            });
        });
        console.log('allies1: ', allies);

        this.activeBook.config.associatedRulesets.forEach(ruleset => {
            let book = this.books.find(book => book.config.rulesetId === ruleset)!;
            let alliance = new Alliance (book.config.name, []);
            book.units.forEach(unit => {
                unit.ally = true;
                alliance.units.push(unit);
            });

            allies.push(alliance);
        });

        console.log('allies2: ', allies);

        return allies;
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
