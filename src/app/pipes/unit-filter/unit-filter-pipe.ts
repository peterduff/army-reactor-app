import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unitFilter',
})
export class UnitFilterPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
