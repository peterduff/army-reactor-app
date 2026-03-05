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
import {Construction} from "../../services/construction/construction";
import {Detachment, Enhancement} from "../../models/detachment";
import {EnhancementFilterPipe} from "../../pipes/enhancement-filter/enhancement-filter-pipe";
import {EquipmentFilterPipe} from "../../pipes/equipment-filter/equipment-filter-pipe";

@Component({
    selector: 'app-unit-view',
    imports: [RouterLink, NgIcon, AlphabeticalPipe, UpperCasePipe, ReactiveFormsModule, EnhancementFilterPipe, EquipmentFilterPipe],
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
    readonly constructionService = inject(Construction);
    readonly router: Router = inject(Router);

    books!: Book[];
    activeRoster!: Roster;
    activeUnit!: Unit;

    activeBook!: Book;
    activeDetachment!: Detachment;

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

        this.activeBook = this.books?.find(book => book.config.rulesetId === this.activeRoster.rulesetId)!;
        this.activeDetachment = this.activeBook.detachments.find(detachment => detachment.id === this.activeRoster.detachmentId)!;
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
            if (option.points) {
                return option.items.join('') + ' [' + option.points + ']';
            } else {
                return  option.items.join('');
            }
        } else {
            return '-';
        }
    }

    optionEnhancementName(option: Option): string {
        if (option.points) {
            return option.items.join('') + ' [' + option.points + ']';
        } else {
            return  option.items.join('');
        }
    }

    findEnhancementName(enhancements: Enhancement[]): string {
        let selectedEnhancement = enhancements?.find(enhancement => enhancement.selected);
        if (selectedEnhancement) {
            return selectedEnhancement.name + ' [' + selectedEnhancement.points + ']'
        } else {
            return '-';
        }
    }

    concatenateItemName(items: string[]): string {
        return items.join(', ');
    }

    updateEquipmentDropdown(equipment: Equipment, selectedOption: Option | undefined): void {
        equipment.options!.forEach(option => option.selected = false);
        if (equipment.options!.some(option => option === selectedOption)) {
            equipment.options!.find(option => option === selectedOption)!.selected = true;
        }

        this.constructionService.updateUnit(this.activeUnit, equipment, this.activeDetachment);
        this.memoryService.setActiveUnit(this.activeUnit);
    }

    updateEnhancementDropdown(enhancements: Enhancement[], selectedEnhancement: Enhancement | undefined): void {
        enhancements!.forEach(enhancement => enhancement.selected = false);
        if (enhancements!.some(enhancement => enhancement === selectedEnhancement)) {
            enhancements!.find(enhancement => enhancement === selectedEnhancement)!.selected = true;
        }

        this.memoryService.setActiveUnit(this.activeUnit);
    }

    updateEquipmentCheck(equipment: Equipment): void {
        equipment.selected = !equipment.selected;

        this.constructionService.updateUnit(this.activeUnit, equipment, this.activeDetachment);
        this.memoryService.setActiveUnit(this.memoryService.cloneObject(this.activeUnit));
    }
}
