import {Pipe, PipeTransform} from '@angular/core';
import {Config} from "../models/config";
import {Roster} from "../models/roster";

@Pipe({
    name: 'configFilter',
})
export class ConfigFilterPipe implements PipeTransform {

    transform(items: Config[], rosters: Roster[]): Config[] {
        let bookIds: string[] = [];

        rosters.forEach(roster => bookIds.push(roster.rulesetId));

        return items.filter(item => bookIds.includes(item.rulesetId));
    }
}
