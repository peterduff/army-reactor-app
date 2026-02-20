import {Pipe, PipeTransform} from '@angular/core';
import {Roster} from "../models/roster";

@Pipe({
    name: 'rosterFilter',
})
export class RosterFilterPipe implements PipeTransform {

    transform(items: Roster[], configId: string): Roster[] {
        return items.filter(item => item.rulesetId === configId);
    }
}
