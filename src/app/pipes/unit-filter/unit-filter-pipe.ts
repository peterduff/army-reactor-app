import {Pipe, PipeTransform} from '@angular/core';
import {Unit} from "../../models/unit";

@Pipe({
    name: 'unitFilter',
})
export class UnitFilterPipe implements PipeTransform {

    transform(items: Unit[], unitType: string): Unit[] {
        let units: Unit[] = [];

        items.forEach(item => {
            if (item) {
                if (unitType === 'CHARACTER' && !item.ally) {
                    if (item.keywords.includes('CHARACTER')) {
                        units.push(item);
                    }
                } else if (unitType === 'BATTLELINE' && !item.ally) {
                    if (item.keywords.includes('BATTLELINE') &&
                        !item.keywords.includes('CHARACTER')) {
                        units.push(item);
                    }
                } else if (unitType === 'DEDICATED TRANSPORT' && !item.ally) {
                    if (item.keywords.includes('DEDICATED TRANSPORT') &&
                        !item.keywords.includes('BATTLELINE') &&
                        !item.keywords.includes('CHARACTER')) {
                        units.push(item);
                    }
                } else if (unitType === 'OTHER' && !item.ally) {
                    if (!item.keywords.includes('DEDICATED TRANSPORT') &&
                        !item.keywords.includes('BATTLELINE') &&
                        !item.keywords.includes('CHARACTER')) {
                        units.push(item);
                    }
                } else if (unitType === 'ALLIES') {
                    if (item.ally) {
                        units.push(item);
                    }
                }
            }
        });

        return units;
    }

}
