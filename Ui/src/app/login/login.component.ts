import { Component, OnInit ,ContentChild } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { NgModule } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from '../services/user-store.service';
import { ResetPasswordService } from '../services/reset-password.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit  {


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
  })
}



 loginForm = new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.pattern('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}')]),
    check: new FormControl('',[Validators.required]),
    

  })

  loginUser(){
    // console.warn(this.loginForm.value);
    }
  get email(){
    return this.loginForm.get('email');
  }
  get password()
  {
    return this.loginForm.get('password')
  }
  get check()
  {
    return this.loginForm.get('check')
  }


  constructor(private route:Router,private auth:AuthService,
    private router:Router,private toast:NgToastService,
    private userStore:UserStoreService,private resetService:ResetPasswordService,private obj:ActivatedRoute 
    ){}
 
  onchange(){
    // console.warn(this.registerForm.value);
    // console.warn(this.form.value);
  
    if (this.loginForm.valid) {
      // this.route.navigate(['grid']);
      // console.warn(this.loginForm.value);
      
      // send the obj to database
      this.auth.login(this.loginForm.value)
      .subscribe({
        next:(res)=>{
          this.toast.success({detail:"SUCCESS",summary:res.message,duration:5000});
          this.router.navigate(['grid'])
          this.loginForm.reset();
          // this.auth.storeToken(res.token);
           this.auth.storeToken(res.accessToken);
           this.auth.storeRefreshToken(res.refreshToken);
          const tokenPayload = this.auth.decodeToken();
          this.userStore.setFullNameForStore(tokenPayload.name);
          this.userStore.setRoleForStore(tokenPayload.role)
        },
        error:(err)=>{
          // console.log(err);
          this.toast.error({detail:"ERROR",summary:"User Not Found",duration:5000});

        }
      })
    }

    else {
      this.toast.warning({detail:"WARN",summary:"PLEASE FILL ALL VALID DETAILS!",duration:5000});
    }
  }


  
}
