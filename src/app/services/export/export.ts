import {inject, Injectable} from '@angular/core';
import {Roster} from "../../models/roster";
import {ToastrService} from "ngx-toastr";
import {Book} from "../../models/book";
import {Datafiles} from "../datafiles/datafiles";
import {Memory} from "../memory/memory";
import {Calculation} from "../calculation/calculation";
import {Unit} from "../../models/unit";
import {UnitFilterPipe} from "../../pipes/unit-filter/unit-filter-pipe";

@Injectable({
    providedIn: 'root'
})
export class Export {
    readonly toastr = inject(ToastrService);
    readonly datafilesService = inject(Datafiles);
    readonly memoryService = inject(Memory);
    readonly calculationService = inject(Calculation);
    readonly unitFilterPipe = inject(UnitFilterPipe);

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
            if (unit.keywords.includes('CHARACTER') && !unit.ally) {
                list += unit.name;
                if (unit.models.length > 1) {
                    list += ' (' + unit.models.length + ' models)';
                }
                list += ' [' + this.calculationService.calculateUnitPoints(unit) + 'pts]\n';
                list += this.writeUnit(unit) + '\n';
            }
        });

        if (this.unitFilterPipe.transform(roster.units, 'BATTLELINE').length > 0) {
            list += '[BATTLELINE]\n\n';
        }
        this.unitFilterPipe.transform(roster.units, 'BATTLELINE').forEach(unit => {
            list += unit.name;
            if (unit.models.length > 1) {
                list += ' (' + unit.models.length + ' models)';
            }
            list += ' [' + this.calculationService.calculateUnitPoints(unit) + 'pts]\n';
            list += this.writeUnit(unit) + '\n';
        });

        if (this.unitFilterPipe.transform(roster.units, 'DEDICATED TRANSPORT').length > 0) {
            list += '[DEDICATED TRANSPORT]\n\n';
        }
        this.unitFilterPipe.transform(roster.units, 'DEDICATED TRANSPORT').forEach(unit => {
            list += unit.name;
            if (unit.models.length > 1) {
                list += ' (' + unit.models.length + ' models)';
            }
            list += ' [' + this.calculationService.calculateUnitPoints(unit) + 'pts]\n';
            list += this.writeUnit(unit) + '\n';
        });

        if (this.unitFilterPipe.transform(roster.units, 'OTHER').length > 0) {
            list += '[OTHER]\n\n';
        }
        this.unitFilterPipe.transform(roster.units, 'OTHER').forEach(unit => {
            list += unit.name;
            if (unit.models.length > 1) {
                list += ' (' + unit.models.length + ' models)';
            }
            list += ' [' + this.calculationService.calculateUnitPoints(unit) + 'pts]\n';
            list += this.writeUnit(unit) + '\n';
        });

        if (this.unitFilterPipe.transform(roster.units, 'ALLIES').length > 0) {
            list += '[ALLIES]\n\n';
        }
        this.unitFilterPipe.transform(roster.units, 'ALLIES').forEach(unit => {
            list += unit.name;
            if (unit.models.length > 1) {
                list += ' (' + unit.models.length + ' models)';
            }
            list += ' [' + this.calculationService.calculateUnitPoints(unit) + 'pts]\n';
            list += this.writeUnit(unit) + '\n';
        });

        list += 'Army Reactor [v1.0.1]';

        return list;
    }

    writeUnit(unit: Unit): string {
        let unitText = '';

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

        unit.enhancements?.forEach(enhancement => {
            if (enhancement.selected) {
                uniqueEquipmentStack.push({count: 1, name: enhancement.name.trim()})
            }
        });

        uniqueEquipmentStack.forEach(item => {
            if (item.count > 1) {
                unitText += ' - ' + item.count + 'x ' + item.name + '\n';
            } else {
                unitText += ' - ' + item.name + '\n';
            }
        });

        return unitText;
    }

    findBookKeyword(): string {
        return this.books?.find(book => book.config.rulesetId === this.activeRoster.rulesetId)!.config.keyword;
    }

    findDetachmentName(): string {
        return this.books?.find(book => book.config.rulesetId === this.activeRoster.rulesetId)!.detachments.find(detachment => detachment.id === this.activeRoster.detachmentId)!.name;
    }

    shareViaWhatsApp(message: string) {
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(this.writeList())}`;
        window.open(whatsappUrl, '_blank');
    }
}
