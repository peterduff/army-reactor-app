import {inject, Injectable} from '@angular/core';
import {Model, Unit} from "../../models/unit";
import {Roster} from "../../models/roster";
import {Memory} from "../memory/memory";
import {Book} from "../../models/book";

@Injectable({
    providedIn: 'root',
})
export class Calculation {
    readonly memoryService = inject(Memory);

    rosters!: Roster[];

    constructor() {
        this.memoryService.getRosters().subscribe( data => this.rosters = data);
    }

    calculateModelPoints(model: Model): number {
        let cost = 0;

        if (model?.points) {
            cost += model?.points;
        }

        if (model?.equipment) {
            model.equipment.forEach(equipment => {
                equipment.options?.forEach(option => {
                    if(option.selected && option.points) {
                        cost += option.points;
                    }
                });

                if(equipment.selected && equipment.points) {
                    cost += equipment.points;
                }
            });
        }

        return cost;
    }

    calculateUnitPoints(unit: Unit): number {
        let cost = 0;

        if (unit) {
            // add model cost to running total
            unit.models?.forEach((model: Model) => {
                cost += this.calculateModelPoints(model);
            });

            if (unit.points) {
                if (unit.models) {
                    unit.points.forEach(pointGroup => {
                        if (unit.models) {
                            if (unit.models.length >= pointGroup.minModels && unit.models.length <= pointGroup.maxModels) {
                                cost += pointGroup.cost;
                            }
                        }
                    });
                } else if (unit.blueprints) {
                    cost += unit.points.sort((a,b) => a.cost - b.cost)[0].cost;
                }
            }

            if (unit.equipment) {
                unit.equipment.forEach(equip => {
                    if (equip.options) {
                        if (equip.options.some(option => option.selected)) {
                            cost += equip.options.find(option => option.selected)?.points!;
                        }
                    } else if (equip.points){
                        cost += equip.points;
                    }
                });
            }
        }

        return cost;
    }

    calculateRosterPoints(roster: Roster): number {
        let cost = 0;

        if (roster?.units) {
            roster.units.forEach((unit: Unit) => {
                cost += this.calculateUnitPoints(unit);
            });
        }

        return cost;
    }

    updateRosterPoints(book: Book): Roster[] {
        book.units.forEach(bookUnit => {
            this.rosters.forEach(roster => {
                roster?.units.forEach(unit => {
                    if (bookUnit.id === unit.id) {
                        if (unit?.points && bookUnit?.points) {
                            unit.points = unit.points.sort((a,b) => a.cost - b.cost);
                            bookUnit.points = bookUnit.points.sort((a,b) => a.cost - b.cost);

                            if (JSON.stringify(bookUnit.points) !== JSON.stringify(unit.points)) {
                                console.log('bookUnit.points: ', bookUnit.points);
                                console.log('unit.points: ', unit.points);
                                unit.points = bookUnit.points;
                            }
                        }

                        // if (unit?.models) {
                        //     unit.models.forEach((model) => {
                        //         if (model?.points) {
                        //             let bookModel = bookUnit.models.find(bookModel => model.name === bookModel.name);
                        //
                        //             if (model.points !== bookModel?.points) {
                        //                 model.points = bookModel?.points;
                        //             }
                        //         }
                        //     });
                        // }
                    }
                });
            });
        });

        // book.detachments.forEach(detachment => {
        //     detachment.enhancements.forEach(enhancement => {
        //         this.rosters.forEach(roster => {
        //             roster?.units.forEach(unit => {
        //                 unit.equipment?.forEach(equipment => {
        //                     if (equipment.points !== enhancement.points) {
        //                         equipment.points = enhancement.points;
        //                     }
        //                 });
        //             });
        //         });
        //     });
        // });

        return this.rosters;
        // this.memoryService.setRosters(this.memoryService.cloneObject(this.rosters));
    }
}
