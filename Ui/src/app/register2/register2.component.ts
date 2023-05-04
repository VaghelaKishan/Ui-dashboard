import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators  } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register2',
  templateUrl: './register2.component.html',
  styleUrls: ['./register2.component.css']
})
export class Register2Component implements OnInit{
  
  empForm:FormGroup;

  constructor(private _fb:FormBuilder,  
    private _emService: EmployeeService,
    private _dialogRef:MatDialogRef<Register2Component>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _coreservice: CoreService,private router:Router,private route:ActivatedRoute
    ){
      this.empForm=this._fb.group({
        firstname:'',
        lastname:'',
        email:'',
        phone:'',
        dob:'',
        age:'',
        gender:'',
        qualification:'',
      });
  }
 

  ngOnInit(): void {
    this.empForm.patchValue(this.data);
    if (this.data && this.data.firstname) {
      this.empForm.patchValue({
        firstname: this.data.firstname
      });}
  }

  onFormSubmit(){
    if(this.empForm.valid){
      this._dialogRef.close(this.empForm.value);
      console.log(this.empForm.value);
      if(this.data){
        this._emService.updateEmployee(this.data.id,this.empForm.value).subscribe({
          next: (val:any)=>{
            // alert('Employee detail updated!');
            this._coreservice.openSnackBar('Employee detail updated!');
            this._dialogRef.close(true);
          },
          error:(err:any)=>{
            console.error(err);
          }
        });
      }
      else{
        this._emService.addEmployee(this.empForm.value).subscribe({
          next: (val:any)=>{
            // alert('Employee added successfully');
            this._coreservice.openSnackBar('Employee added successfully');
            this._dialogRef.close(true);
          },
          error:(err:any)=>{
            console.error(err);
          }
          
        });
      }
      console.log(this.empForm.value);
      
    }
  }

  
}
