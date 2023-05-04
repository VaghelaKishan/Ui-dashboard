import { ValidationErrors } from "@angular/forms";
import {AbstractControl, ValidatorFn} from '@angular/forms';
export class ConfirmedValiator
 {

   static MatchPassword = (pass:string, confirmpass:string): ValidatorFn => {

       return (control: AbstractControl): ValidationErrors | null => {
           const passctrl:any = control.get(pass);
           const cpassctrl:any = control.get(confirmpass);

           return passctrl && cpassctrl && passctrl.value !== cpassctrl.value? {mismatchPassword : true} : null;
       }
    }

    static OldPassword = (pass:string, confirmpass:string): ValidatorFn => {

        return (control: AbstractControl): ValidationErrors | null => {
            const passctrl:any = control.get(pass);
            const cpassctrl:any = control.get(confirmpass);
 
            return passctrl && cpassctrl && passctrl.value === cpassctrl.value? {mismatchPassword : true} : null;
        }
     }
}