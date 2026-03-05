import {Pipe, PipeTransform} from '@angular/core';
import {Option} from "../../models/unit";

@Pipe({
    name: 'equipmentFilter',
})
export class EquipmentFilterPipe implements PipeTransform {

    transform(items: any[], keywords: string[]): any[] {
        let options: Option[] = [];

        items.forEach((item: any) => {
            let blocked = false;

            item.keywordsBlocked?.forEach((keywordBlocked: string) => {
                if (keywords.includes(keywordBlocked)) {
                    blocked = true;
                }
            });

            if (!blocked) {
                options.push(item);
            }
        });

        return options;
    }
}
