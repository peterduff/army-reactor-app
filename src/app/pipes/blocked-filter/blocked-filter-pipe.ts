import {Pipe, PipeTransform} from '@angular/core';
import {Unit} from "../../models/unit";

@Pipe({
    name: 'blockedFilter',
})
export class BlockedFilterPipe implements PipeTransform {

    transform(items: Unit[], blockList: string[] ): Unit[] {
        let units: Unit[] = [];

        units = items.filter(item => !blockList.includes(item.id));

        return units;
    }

}
