import {Injectable} from '@angular/core';
import {Model, Unit} from "../../models/unit";
import {Roster} from "../../models/roster";

@Injectable({
    providedIn: 'root',
})
export class Calculation {

    constructor() {
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

        if (roster.units) {
            roster.units.forEach((unit: Unit) => {
                cost += this.calculateUnitPoints(unit);
            });
        }

        return cost;
    }
}
