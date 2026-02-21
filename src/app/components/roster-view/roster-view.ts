import {Component, inject, OnInit} from '@angular/core';
import {Book} from "../../models/book";
import {Subscription} from "rxjs";
import {Datafiles} from "../../services/datafiles/datafiles";
import {Memory} from "../../services/memory/memory";
import {Router, RouterLink} from "@angular/router";
import {Roster} from "../../models/roster";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {heroXMarkSolid} from "@ng-icons/heroicons/solid";
import {UnitFilterPipe} from "../../pipes/unit-filter/unit-filter-pipe";
import {AlphabeticalPipe} from "../../pipes/alphabetical/alphabetical-pipe";
import {Calculation} from "../../services/calculation/calculation";
import {Equipment, Model, Unit} from "../../models/unit";
import * as uuid from "uuid";
import {heroSquare2Stack} from "@ng-icons/heroicons/outline";
import {UpperCasePipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {faSolidCheck, faSolidCaretDown} from "@ng-icons/font-awesome/solid";

@Component({
    selector: 'app-list',
    imports: [NgIcon, RouterLink, UnitFilterPipe, AlphabeticalPipe, UpperCasePipe, ReactiveFormsModule],
    viewProviders: [provideIcons({heroXMarkSolid, heroSquare2Stack, faSolidCaretDown, faSolidCheck})],
    templateUrl: './roster-view.html',
    styleUrl: './roster-view.scss',
})
export class RosterView implements OnInit {
    readonly datafilesService = inject(Datafiles);
    readonly memoryService = inject(Memory);
    readonly calculationService = inject(Calculation);
    readonly router: Router = inject(Router);

    books!: Book[];
    booksSubscription: Subscription;
    activeRoster!: Roster;
    activeRosterSubscription: Subscription;
    activeUnit!: Unit;
    activeUnitSubscription: Subscription;

    constructor() {
        this.booksSubscription = this.datafilesService.getBooks().subscribe(data => this.books = data);
        this.activeRosterSubscription = this.memoryService.getActiveRoster().subscribe(data => this.activeRoster = data);
        this.activeUnitSubscription = this.memoryService.getActiveUnit().subscribe(data => this.activeUnit = data);
    }

    ngOnInit() {
        this.datafilesService.setCore(this.datafilesService.localGetCore());
        this.datafilesService.setBooks(this.datafilesService.localGetBooks());
        this.memoryService.setActiveRoster(this.memoryService.localGetActiveRoster());
        this.memoryService.setRosters(this.memoryService.localGetRosters());
    }

    openUnit(unit: Unit): void {
        this.memoryService.setActiveUnit(unit);
    }

    findBook(): Book {
        return this.books?.find(book => book.config.rulesetId === this.activeRoster.rulesetId)!;
    }

    findDetachmentName(detachmentId: string): string {
        return this.findBook().detachments.find(detachment => detachment.id === detachmentId)!.name;
    }

    duplicateUnit(unit: Unit): void {
        let newUnit = unit;
        newUnit.uuid = uuid.v4();
        this.activeRoster.units.push(newUnit);
        this.memoryService.setActiveRoster(this.activeRoster);
    }

    removeUnit(unit: Unit): void {
        this.activeRoster.units.splice(this.activeRoster.units.indexOf(unit), 1);
        this.memoryService.setActiveRoster(this.memoryService.cloneObject(this.activeRoster));
    }

    addModel(unit: Unit, blueprint: Model): void {
        unit.models.push(blueprint);
        this.memoryService.setActiveRoster(this.activeRoster);
    }

    removeModel(model: Model): void {
        this.activeUnit.models.splice(this.activeUnit.models.indexOf(model), 1);
        this.memoryService.setActiveRoster(this.activeRoster);
    }

    findSubModelCount(model: Model): number {
        return this.activeUnit.models.filter(refModel => refModel.name === model.name).length;
    }

    findSelectedDropdown(equipment: Equipment): string {
        let option = equipment.options.find(option => option.selected);
        return this.concatenateItemName(option!.items);
    }

    concatenateItemName(items: string[]): string {
        return items.join(', ');

    }
}
