import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipe'
})
export class PipePipe implements PipeTransform {

  transform(value: any): number {
    let val=new Date(value).getFullYear();
    let today = new Date().getFullYear();
    let age= (today-val);
    return age;
  }

}
