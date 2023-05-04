
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import Swal from 'sweetalert2';
import { ResetPasswordService } from '../services/reset-password.service';
@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {
  auth: any;
 

  ngOnInit():void{
    (function () {
      'use strict'
    
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.querySelectorAll('.needs-validation')
    
      // Loop over them and prevent submission
      Array.prototype.slice.call(forms)
        .forEach(function (form) {
          form.addEventListener('submit', function (event: { preventDefault: () => void; stopPropagation: () => void; }) {
            if (!form.checkValidity()) {
              event.preventDefault()
              event.stopPropagation()
            }
    
            form.classList.add('was-validated')
          }, false)
        })
    })()
  }
    
  
  
  forgetForm = new FormGroup({
      email:new FormControl('',[Validators.required,Validators.email]),
   
    })
  
    forgetUser(){
      console.warn(this.forgetForm.value);
      }


    get email(){
      return this.forgetForm.get('email');
    }
   
    public resetPasswordEmail!:string;
    public isValidEmail!:boolean;
    constructor(private route:Router,private toast:NgToastService,private resetService:ResetPasswordService){}

    onforget(){
      if (this.forgetForm.value.email )
         {
          this.route.navigate(['newpassword']);
          console.log(this.resetPasswordEmail);
          this.resetPasswordEmail="";

          this.toast.success({detail:"SUCCESS",summary:"Email Verify",duration:5000});
          console.warn(this.forgetForm.value); 
      }
      else {
        this.toast.warning({detail:"WARN",summary:"Email Not Verify",duration:5000}); 
    }
    }

    onForgot(){
      if(this.checkValidEmail(this.resetPasswordEmail)){
        console.log(this.resetPasswordEmail);
        this.resetPasswordEmail="";
        this.toast.success({detail:"SUCCESS",summary:"Email Verify",duration:5000});
      }
      else{
        this.toast.error({detail:"ERROR",summary:"Email Not Verify",duration:5000});
      }
    }

    checkValidEmail(event: string){
      const value = event;
      const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
      this.isValidEmail = pattern.test(value);
      return this.isValidEmail;
  
    }

    confirmToSend(){
      if(this.checkValidEmail(this.resetPasswordEmail)){
        console.log(this.resetPasswordEmail);

        // Api Call to be done
        this.resetService.sendResetPasswordLink(this.resetPasswordEmail)
        .subscribe({
          next:(res)=>{
          this.route.navigate(['']);
            this.toast.success({detail:"SUCCESS",summary:"Check out the Email Link Send!",duration:3000});
            this.resetPasswordEmail="";
            // const buttonRef =document.getElementById("closeBtn");
            // buttonRef?.click();
          },
          error:(err)=>{
            this.toast.error({detail:"ERROR",summary:"Something went wrong",duration:3000});

          }
          
        })


      }
    }
  
}
