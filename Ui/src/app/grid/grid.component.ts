import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsersDataService} from '../services/users-data.service';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { UserStoreService } from '../services/user-store.service';
import { MatDialog } from '@angular/material/dialog';
import { Register2Component } from '../register2/register2.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { Register3Component } from '../register3/register3.component';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit{
  public User:any = [];
  public Role!:string ;
  
  public fullname : string= "";
  constructor(private userData:UsersDataService,private auth:AuthService,
    private api:ApiService,private userStore:UserStoreService, 
    private _dialog: MatDialog,
    private modalService:NgbModal,private route:ActivatedRoute){
  //   userData.users().subscribe((data: any)=>{
  //     this.User=data;
  //     console.warn("data",data);
  // });
}

  ngOnInit(){
    this.api.getusers().subscribe(res=>{
      this.User = res;
      console.log(this.User);
    });

    this.userStore.getFullNameFromStore()
    
    .subscribe(val=>{
      let fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullname = val || fullNameFromToken
    });

    this.userStore.getRoleFromStore()
    .subscribe(val=>{
      const roleFromToken = this.auth.getRoleFromToken();
      this.Role = val || roleFromToken;
    })

    
  }

  logout(){
    this.auth.sighOut();
  }

  deleteItem(id: number) {
    this.api.deleteItem(id).subscribe(() => {
      this.User = null;
      this.api.getusers().subscribe(res=>{
        this.User=res;
      });
    });
  }
  

  Add(){
    this._dialog.open(Register3Component);
  }
 
  editProfileForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    date: new FormControl(''),
    age: new FormControl(''),
    qualification: new FormControl(''),
  });

  openModal(
    targetModal: any,
    user: {
      firstname: any;
      lastname: any;
      email: any;
      phone: any;
      date: any;
      age: any;
      qualification: any;
    }
  ) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    });

    this.editProfileForm.patchValue({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      date: user.date,
      age: user.age,
      qualification: user.qualification,
    });
  }
  onSubmit() {
    this.modalService.dismissAll();
    console.log('res:', this.editProfileForm.getRawValue());
  }
}


