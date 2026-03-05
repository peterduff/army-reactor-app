import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'alphabetical'
})
export class AlphabeticalPipe implements PipeTransform {

    transform(items: any[], param?: string): any {
        if (!items) {
            return [];
        }

        if (param) {
            items = items.sort((item1, item2) => {
                if (item1[param] > item2[param]) {
                    return 1;
                }

                if (item1[param] < item2[param]) {
                    return -1;
                }

                return 0;
            });
        } else {
            items = items.sort((item1, item2) => {
                if (item1 > item2) {
                    return 1;
                }

                if (item1 < item2) {
                    return -1;
                }

                return 0;
            });
        }

        return items;
    }

}
