import {Injectable} from '@angular/core';
import {Equipment, Option, Unit} from "../../models/unit";
import {Roster} from "../../models/roster";
import {Book} from "../../models/book";
import {Detachment} from "../../models/detachment";

@Injectable({
    providedIn: 'root',
})
export class Construction {

    constructor() {
    }

    assembleUnit(activeBook: Book, activeRoster: Roster, unit: Unit): Unit {
        let activeDetachment = activeBook.detachments.find(detachment => detachment.id === activeRoster.detachmentId);

        if (!unit.equipment) {
            unit.equipment = [];
        }

        if (!unit.enhancements) {
            unit.enhancements = [];
        }

        if (activeDetachment?.additionalKeywords) {
            this.addKeywordsToUnit(activeDetachment, unit);
        }

        if (activeDetachment?.additionalEquipment) {
            this.addEquipmentToUnit(activeDetachment, unit);
        }

        if (unit.keywords.includes('CHARACTER')) {
            this.addWarlordToUnit(unit);
        }

        if (unit.keywords.includes('CHARACTER') && !unit.keywords.includes('EPIC HERO')) {
            this.addEnhancementsToUnit(activeDetachment!, unit);
        }

        if (unit.blueprints) {
            this.addModelsToUnitFromBlueprints(unit);
        }

        return unit;
    }

    updateUnit(unit: Unit, equipment: Equipment, detachment: Detachment): void {
        if (equipment.keywordsConferred || equipment.options) {
            this.updateKeywordsToUnit(unit, equipment);
        }

        if (unit.enhancements) {
            this.removeInvalidEnhancementsFromUnit(unit);
        }

        if (unit.keywords.includes('CHARACTER')) {
            this.addWarlordToUnit(unit);

            if (unit.enhancements && unit.enhancements.length === 0 && !unit.keywords.includes('EPIC HERO')) {
                this.addEnhancementsToUnit(detachment, unit);
            }
        }

        if (!unit.keywords.includes('CHARACTER')) {
            this.removeWarlordFromUnit(unit);
        }
    }

    addKeywordsToUnit(activeDetachment: Detachment, unit: Unit): void {
        activeDetachment.additionalKeywords!.forEach(keyword => {
            if (!unit.keywords.includes(keyword)) {
                if (this.includesAll(unit.keywords, activeDetachment.keywordsRequired ? activeDetachment.keywordsRequired : [])) {
                    unit.keywords.push(keyword);
                }
            }
        });
    }

    addEquipmentToUnit(activeDetachment: Detachment, unit: Unit): void {
        activeDetachment.additionalEquipment!.forEach(additionalEquipment => {
            let disallowed: boolean = false;

            additionalEquipment.keywordsRequired?.forEach(keyword => {
                if (!unit.keywords.includes(keyword)) {
                    disallowed = true;
                }
            });

            if (!disallowed) {
                unit.equipment!.push(additionalEquipment);
            }
        });
    }

    addWarlordToUnit(unit: Unit): void {
        if (!unit.equipment?.find(equip => equip.items?.includes('WARLORD'))) {
            unit.equipment!.push(new Equipment('checkbox', ['WARLORD'], undefined, false, undefined, 'red'));
        }
    }

    removeWarlordFromUnit(unit: Unit): void {
        unit.equipment = unit.equipment?.filter(equip => !equip.items?.includes('WARLORD'));
    }

    addEnhancementsToUnit(activeDetachment: Detachment, unit: Unit): void {
        activeDetachment.enhancements!.forEach(enhancement => {
            unit.enhancements!.push(enhancement);
        });
    }

    removeInvalidEnhancementsFromUnit(unit: Unit): void {
        unit.enhancements!.forEach(enhancement => {
            if (!this.includesAll(unit.keywords, enhancement.keywordsMustCombined) || !unit.keywords.includes('CHARACTER')) {
                enhancement.selected = false;
            }
        });
    }

    addModelsToUnitFromBlueprints(unit: Unit): void {
        unit.models = [];

        unit.blueprints!.forEach(blueprint => {
            for (let i = 0; i < blueprint.min; i++) {
                unit.models.push(blueprint);
            }
        });
    }

    updateKeywordsToUnit(unit: Unit, equipment: Equipment): void {
        if (equipment.selected) {
            equipment.keywordsConferred!.forEach(keyword => {
                if (!unit.keywords.includes(keyword)) {
                    unit.keywords.push(keyword);
                }
            });
        }

        if (!equipment.selected && !equipment.options) {
            equipment.keywordsConferred!.forEach(keyword => {
                unit.keywords = unit.keywords.filter(key => key !== keyword);
            });
        }

        if (equipment.options) {
            equipment.options?.forEach(option => {
                option.keywordsConferred?.forEach(keyword => {
                    unit.keywords = unit.keywords.filter(key => key !== keyword);

                    if (option.selected) {
                        unit.keywords.push(keyword);
                    }
                });
            });
        }
    }

    includesAll (arr: any[], subArr: any[]) {
        for (let item of subArr) {
            if (!arr.includes(item)) return false;
        }
        return true;
    }
}
