import {inject, Injectable} from '@angular/core';
import {Roster} from "../../models/roster";
import {ToastrService} from "ngx-toastr";
import {Book} from "../../models/book";
import {Datafiles} from "../datafiles/datafiles";
import {Memory} from "../memory/memory";
import {Calculation} from "../calculation/calculation";
import {Unit} from "../../models/unit";

@Injectable({
    providedIn: 'root'
})
export class Export {
    readonly toastr = inject(ToastrService);
    readonly datafilesService = inject(Datafiles);
    readonly memoryService = inject(Memory);
    readonly calculationService = inject(Calculation);

    books!: Book[];
    activeRoster!: Roster;

    constructor() {
        this.datafilesService.getBooks().subscribe(data => this.books = data);
        this.memoryService.getActiveRoster().subscribe(data => this.activeRoster = data);
    }

    copyToClipboard(): void {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = this.writeList();
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.toastr.success('Copied to Clipboard', '', {timeOut:2000});
    }

    writeList(): string {
        let roster = this.activeRoster;

        let list =
            'KEYWORD: ' + this.findBookKeyword() + '\n' +
            'DETACHMENT: ' + this.findDetachmentName() + '\n' +
            'TOTAL POINTS: ' + this.calculationService.calculateRosterPoints(this.activeRoster) + '\n' +
            '------------------------\n' +
            '\n' +
            '[CHARACTERS]\n';

        roster.units.forEach(unit => {
            if (unit.keywords.includes('CHARACTER')) {
                list += this.writeUnit(unit);
            }
        });

        list += '[BATTLELINE]\n\n';
        roster.units.forEach(unit => {
            if (unit.keywords.includes('BATTLELINE') &&
                !unit.keywords.includes('CHARACTER')) {
                list += this.writeUnit(unit);
            }
        });

        list += '[DEDICATED TRANSPORTS]\n\n';
        roster.units.forEach(unit => {
            if (unit.keywords.includes('DEDICATED TRANSPORT') &&
                !unit.keywords.includes('BATTLELINE') &&
                !unit.keywords.includes('CHARACTER')) {
                list += this.writeUnit(unit);
            }
        });

        list += '[OTHER]\n\n';
        roster.units.forEach(unit => {
            if (!unit.keywords.includes('DEDICATED TRANSPORT') &&
                !unit.keywords.includes('BATTLELINE') &&
                !unit.keywords.includes('CHARACTER')) {
                list += this.writeUnit(unit);
            }
        });

        return list;
    }

    writeUnit(unit: Unit): string {
        let unitText = unit.name + ' [' + this.calculationService.calculateUnitPoints(unit) + 'pts]\n';
        let uniqueEquipmentStack: any[] = [];

        unit.models.forEach(model => {
            model.equipment?.forEach(selectedEquipment => {
                let equipmentStack: string[] = [];

                if (selectedEquipment.type !== 'dropdown') {
                    if (selectedEquipment.selected || selectedEquipment.type === 'text') {
                        selectedEquipment.items?.forEach(item => {
                            equipmentStack.push(item);
                        });
                    }
                } else {
                    selectedEquipment.options?.forEach(option => {
                        if (option.selected) {
                            option.items.forEach(item => {
                                equipmentStack.push(item);
                            });
                        }
                    });
                }

                equipmentStack.forEach((equipment) => {
                    if (uniqueEquipmentStack.find(item => item.name === equipment.trim())) {
                        uniqueEquipmentStack.find(item => item.name === equipment.trim()).count++;
                    } else {
                        uniqueEquipmentStack.push({count: 1, name:equipment.trim()});
                    }
                })
            });
        });

        unit.equipment?.forEach(selectedEquipment => {
            let equipmentStack: string[] = [];

            if (selectedEquipment.type !== 'dropdown') {
                if (selectedEquipment.selected || selectedEquipment.type === 'text') {
                    selectedEquipment.items?.forEach(item => {
                        equipmentStack.push(item);
                    });
                }
            } else {
                selectedEquipment.options?.forEach(option => {
                    if (option.selected) {
                        option.items.forEach(item => {
                            equipmentStack.push(item);
                        });
                    }
                });
            }

            equipmentStack.forEach((equipment) => {
                if (uniqueEquipmentStack.find(item => item.name === equipment.trim())) {
                    uniqueEquipmentStack.find(item => item.name === equipment.trim()).count++;
                } else {
                    uniqueEquipmentStack.push({count: 1, name:equipment.trim()});
                }
            })
        });

        uniqueEquipmentStack.forEach(item => {
            if (item.count > 1) {
                unitText += ' - ' + item.count + 'x ' + item.name + '\n';
            } else {
                unitText += ' - ' + item.name + '\n';
            }
        });

        return unitText + '\n';
    }

    findBookKeyword(): string {
        return this.books?.find(book => book.config.rulesetId === this.activeRoster.rulesetId)!.config.keyword;
    }

    findDetachmentName(): string {
        return this.books?.find(book => book.config.rulesetId === this.activeRoster.rulesetId)!.detachments.find(detachment => detachment.id === this.activeRoster.detachmentId)!.name;
    }
}
