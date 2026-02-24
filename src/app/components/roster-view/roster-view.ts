import {Component, inject, OnInit} from '@angular/core';
import {Book} from "../../models/book";
import {Datafiles} from "../../services/datafiles/datafiles";
import {Memory} from "../../services/memory/memory";
import {Router, RouterLink} from "@angular/router";
import {Roster} from "../../models/roster";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {heroXMarkSolid} from "@ng-icons/heroicons/solid";
import {UnitFilterPipe} from "../../pipes/unit-filter/unit-filter-pipe";
import {AlphabeticalPipe} from "../../pipes/alphabetical/alphabetical-pipe";
import {Calculation} from "../../services/calculation/calculation";
import {Equipment, Model, Option, Unit} from "../../models/unit";
import * as uuid from "uuid";
import {heroSquare2Stack} from "@ng-icons/heroicons/outline";
import {UpperCasePipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {faSolidCheck, faSolidCaretDown, faSolidCrown, faSolidVanShuttle, faSolidBoltLightning, faSolidUserGroup} from "@ng-icons/font-awesome/solid";
import {mynaFatArrowUpSolid} from "@ng-icons/mynaui/solid";
import {Export} from "../../services/export/export";

@Component({
    selector: 'app-list',
    imports: [NgIcon, RouterLink, UnitFilterPipe, AlphabeticalPipe, UpperCasePipe, ReactiveFormsModule],
    viewProviders: [provideIcons({heroXMarkSolid, heroSquare2Stack, faSolidCaretDown, faSolidCheck, faSolidCrown, faSolidVanShuttle, faSolidBoltLightning, mynaFatArrowUpSolid, faSolidUserGroup})],
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
    }

    findBook(): Book {
        return this.books?.find(book => book.config.rulesetId === this.activeRoster.rulesetId)!;
    }

    findDetachmentName(detachmentId: string): string {
        return this.findBook().detachments.find(detachment => detachment.id === detachmentId)!.name;
    }

    duplicateUnit(unit: Unit): void {
        let newUnit = this.memoryService.cloneObject(unit);
        newUnit.uuid = uuid.v4();
        this.activeRoster.units.push(newUnit);
        this.activeRoster.units = new AlphabeticalPipe().transform(this.activeRoster.units, 'name');
        this.memoryService.setActiveRoster(this.activeRoster);
        this.memoryService.setActiveUnit(null);
    }

    removeUnit(unit: Unit): void {
        this.activeRoster.units.splice(this.activeRoster.units.indexOf(unit), 1);
        this.memoryService.setActiveRoster(this.memoryService.cloneObject(this.activeRoster));
        this.memoryService.setActiveUnit(null);
        this.deleteId = '';
    }

    addModel(unit: Unit, blueprint: Model): void {
        unit.models.push(blueprint);
        unit.models = new AlphabeticalPipe().transform(unit.models, 'name');
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
        let option = equipment.options?.find(option => option.selected);
        if (option) {
            return this.concatenateItemName(option!.items);
        } else {
            return '-';
        }
    }

    findSelectedDropdownWithPoints(equipment: Equipment): string {
        let option = equipment.options?.find(option => option.selected);
        if (option) {
            return this.concatenateItemName(option!.items) + ' [' + option?.points + ']';
        } else {
            return '-';
        }
    }

    optionEnhancementName(option: Option): string {
        return option.items.join('') + ' [' + option.points + ']';
    }

    concatenateItemName(items: string[]): string {
        return items.join(', ');
    }

    updateModelEquipmentDropdown(options: Option[], selectedOption: Option | undefined): void {
        options.forEach(option => option.selected = false);
        if (options.some(option => option === selectedOption)) {
            options.find(option => option === selectedOption)!.selected = true;
        }
        this.memoryService.setActiveRoster(this.activeRoster);
    }

    updateModelEquipmentCheck(equipment: Equipment): void {
        equipment.selected = !equipment.selected;
        this.memoryService.setActiveRoster(this.activeRoster);
    }
}
