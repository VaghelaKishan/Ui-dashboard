import { Component, OnInit } from '@angular/core';
import { UsersDataService } from '../services/users-data.service';
import { UserStoreService } from '../services/user-store.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register3',
  templateUrl: './register3.component.html',
  styleUrls: ['./register3.component.css'],
})
export class Register3Component implements OnInit {
  public User:any = [];
  public Role!:string ;
  id:any;
  data: any;
  public fullname : string= "";
  constructor(private userData:UsersDataService,private auth:AuthService,
    private api:ApiService,private userStore:UserStoreService, private _dialog: MatDialog,private modalService:NgbModal,
     private route:ActivatedRoute,
    ){}
  ngOnInit() {
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

    this.id = this.route.snapshot.params['id'];
      this.getOne();
  }

  editProfileForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    date: new FormControl(''),
    Age: new FormControl(''),
    Qualification: new FormControl(''),
  });

  openModal(
    targetModal: any,
    user: {
      firstname: any;
      lastname: any;
      email: any;
      phone: any;
      date: any;
      Age: any;
      Qualification: any;
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
      Age: user.Age,
      Qualification: user.Qualification,
    });
  }
  deleteItem(id: number) {
    this.api.deleteItem(id).subscribe(() => {
      this.User = null;
      this.api.getusers().subscribe(res=>{
        this.User=res;
      });
    });
  }


  logout(){
    this.auth.sighOut();
  }
  onSubmit() {
    this.modalService.dismissAll();
    console.log('res:', this.editProfileForm.getRawValue());
  }

  getOne(){
    this.api.getOne(this.id).subscribe(data=>{
      this.data = data;
      console.log(this.data);
    })
  }
}
