
import { Component, OnInit } from '@angular/core';
import { ConfirmedValiator } from './confirmed.validator';
import { FormControl, FormGroup, Validators,FormBuilder  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgToastService } from 'ng-angular-popup';
import { ResetPassword } from '../models/reset-password.model';
import { ResetPasswordService } from '../services/reset-password.service';
@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.css']
})
export class NewpasswordComponent implements OnInit {
 

  resetPasswordFrom!:FormGroup;
  emailToken!:string;
  emailToReset!: string;
  resetPasswordObj = new ResetPassword();

  ngOnInit():void{
    this.activatedRoute.queryParams.subscribe(val=>{
      this.emailToReset = val['email'];
      let uriToken = val['code']

      this.emailToken = uriToken.replace(/ /g,'+')
      // console.log(this.emailToken);
      // console.log(this.emailToReset);
    })
  }

      reset(){
          if(this.passForm.value.newpassword && this.passForm.value.confirmpassword ){
            this.resetPasswordObj.email = this.emailToReset;
            this.resetPasswordObj.newPassword = this.passForm.value.newpassword;
            this.resetPasswordObj.confirmPassword = this.passForm.value.confirmpassword;
            this.resetPasswordObj.emailToken = this.emailToken;

            this.resetService.resetPassword(this.resetPasswordObj)
            .subscribe({
              next:(res)=>{
                this.toast.success({detail:"SUCCESS",summary:"Password Reset Successfully",duration:3000});
                this.route.navigate([''])
              },
              error:(err)=>{
                 this.toast.error({detail:"ERROR",summary:"Something went wrong",duration:3000});
              }
            })
          }
          else{
            this.toast.error({detail:"ERROR",summary:"Something went wrong!!",duration:3000});

          }
      }
  //   (function () {
  //     'use strict'
    
  //     // Fetch all the forms we want to apply custom Bootstrap validation styles to
  //     var forms = document.querySelectorAll('.needs-validation')
    
  //     // Loop over them and prevent submission
  //     Array.prototype.slice.call(forms)
  //       .forEach(function (form) {
  //         form.addEventListener('submit', function (event: { preventDefault: () => void; stopPropagation: () => void; }) {
  //           if (!form.checkValidity()) {
  //             event.preventDefault()
  //             event.stopPropagation()
  //           }
    
  //           form.classList.add('was-validated')
  //         }, false)
  //       })
  //   })()` 
  // }
  //pass


 passForm = new FormGroup({
  newpassword: new FormControl('',[Validators.required,Validators.pattern('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}')]),
  confirmpassword: new FormControl('',[Validators.required, Validators.pattern('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}')]),
  oldpassword: new FormControl('',[Validators.required, Validators.pattern('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}')]),
},[
  ConfirmedValiator.MatchPassword('newpassword','confirmpassword'),
  ConfirmedValiator.OldPassword('newpassword','oldpassword'),
])




passUser(){
  // console.warn(this.passForm.value);
  }
get newpassword()
{
  return this.passForm.get('newpassword')
}
get confirmpassword()
{
  return this.passForm.get('confirmpassword')
}
get oldpassword()
{
  return this.passForm.get('oldpassword')
}
get f()
{
  return this.passForm.getError('mismatchPassword') && this.passForm.get('confirmpassword')?.touched;
}
get o()
{
  return this.passForm.getError('mismatchPassword') && this.passForm.get('oldpassword')?.touched;
}

form: FormGroup;
constructor(private fb:FormBuilder,private route:Router,private toast:NgToastService,private activatedRoute:ActivatedRoute,private resetService : ResetPasswordService){
  this.form= fb.group({
    newpassword:['',[Validators.required]],
    confirmpassword:['',[Validators.required]],
    oldpassword:['',[Validators.required]],
  })
  
}



onPass(){
  if (this.passForm.value.newpassword && this.passForm.value.confirmpassword && this.passForm.value.oldpassword)
     {
      this.route.navigate(['']);
      this.toast.success({detail:"SUCCESS",summary:"Password Successfully Change!!",duration:3000});
  }
  else {
    this.toast.error({detail:"ERROR",summary:"Something went wrong",duration:3000});
  }
}

   
}


    





  