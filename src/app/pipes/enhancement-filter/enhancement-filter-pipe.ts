import {Pipe, PipeTransform} from '@angular/core';
import {Equipment, Option, Unit} from "../../models/unit";

@Pipe({
    name: 'enhancementFilter',
})
export class EnhancementFilterPipe implements PipeTransform {

    transform(items: any[], keywords: string[]): any[] {
        let options: Option[] = [];

        if (!keywords.includes('CHARACTER')) {
            return [];
        }

        items.forEach((item: any) => {
            if (this.includesAll(keywords, item.keywordsMustCombined)) {
                options.push(item);
            }
        });

        return options;
    }

    includesAll (arr: any[], subArr: any[]) {
        for (let item of subArr) {
            if (!arr.includes(item)) return false;
        }
        return true;
    }
}
