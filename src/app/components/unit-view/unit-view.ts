import {Component, inject, OnInit} from '@angular/core';
import {Datafiles} from "../../services/datafiles/datafiles";
import {Memory} from "../../services/memory/memory";
import {Calculation} from "../../services/calculation/calculation";
import {Router, RouterLink} from "@angular/router";
import {Book} from "../../models/book";
import {Roster} from "../../models/roster";
import {Equipment, Model, Option, Unit} from "../../models/unit";
import {AlphabeticalPipe} from "../../pipes/alphabetical/alphabetical-pipe";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {UpperCasePipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {heroSquare2Stack} from "@ng-icons/heroicons/outline";
import {
    faSolidBoltLightning,
    faSolidCaretDown,
    faSolidCaretLeft,
    faSolidCheck,
    faSolidCrown, faSolidUserGroup,
    faSolidVanShuttle, faSolidXmark
} from "@ng-icons/font-awesome/solid";
import {mynaFatArrowUpSolid} from "@ng-icons/mynaui/solid";

@Component({
    selector: 'app-unit-view',
    imports: [RouterLink, NgIcon, AlphabeticalPipe, UpperCasePipe, ReactiveFormsModule],
    viewProviders: [provideIcons({
        faSolidXmark,
        heroSquare2Stack,
        faSolidCaretLeft,
        faSolidCaretDown,
        faSolidCheck,
        faSolidCrown,
        faSolidVanShuttle,
        faSolidBoltLightning,
        mynaFatArrowUpSolid,
        faSolidUserGroup
    })],
    templateUrl: './unit-view.html',
    styleUrl: './unit-view.scss',
})
export class UnitView implements OnInit {
    readonly datafilesService = inject(Datafiles);
    readonly memoryService = inject(Memory);
    readonly calculationService = inject(Calculation);
    readonly router: Router = inject(Router);

    books!: Book[];
    activeRoster!: Roster;
    activeUnit!: Unit;

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
        this.memoryService.setActiveUnit(this.memoryService.localGetActiveUnit());
    }

    addModel(unit: Unit, blueprint: Model): void {
        unit.models.push(this.memoryService.cloneObject(blueprint));
        unit.models = new AlphabeticalPipe().transform(unit.models, 'name');
        this.memoryService.setActiveUnit(unit);
    }

    removeModel(model: Model): void {
        this.activeUnit.models.splice(this.activeUnit.models.indexOf(model), 1);
        this.memoryService.setActiveUnit(this.activeUnit);
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

    updateEquipmentDropdown(options: Option[], selectedOption: Option | undefined): void {
        options.forEach(option => option.selected = false);
        if (options.some(option => option === selectedOption)) {
            options.find(option => option === selectedOption)!.selected = true;
        }
        this.memoryService.setActiveUnit(this.activeUnit);
    }

    updateEquipmentCheck(equipment: Equipment): void {
        equipment.selected = !equipment.selected;
        this.memoryService.setActiveUnit(this.activeUnit);
    }
}
