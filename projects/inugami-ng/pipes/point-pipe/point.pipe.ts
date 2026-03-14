import {Pipe, PipeTransform} from '@angular/core';
import {Point} from 'inugami-ng/models';

@Pipe({
  name: 'inuPipePoint',
  standalone: true
})
export class InuPointPipe implements PipeTransform {

  transform(value: Point, ...args: any[]): any {
    if (!value) return '';

    const result: string[] = [];
    result.push(`x : ${this.format(value.x)}`);
    result.push(`y : ${this.format(value.y)}`);
    return result.join(' | ');
  }

  private format(value: number): string {
    const str = `${value}`;
    const result: string[] = [];

    for (let i = 4 - str.length; i>=0; i--) {
      result.push('_');
    }
    result.push(str);
    return result.join('');
  }
}
