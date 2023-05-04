import { Component, OnInit ,ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { Register2Component } from '../register2/register2.component';
import { EmployeeService } from '../services/employee.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CoreService } from '../core/core.service';
@Component({
  selector: 'app-grid2',
  templateUrl: './grid2.component.html',
  styleUrls: ['./grid2.component.css']
})
export class Grid2Component implements OnInit{
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'email','dob','gender','qualification','company','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 

 constructor(private _dialog:MatDialog,private _empService:EmployeeService,private _coreService:CoreService){}

 ngOnInit(): void {
   this.getEmployeeList();
 }
 openAddEditEmpForm(){
  const DialogRef= this._dialog.open(Register2Component);
    DialogRef.afterClosed().subscribe({
      next: (val)=>{
        if(val){
          this.getEmployeeList();
        }
      }
    });
 }

 getEmployeeList(){
  this._empService.getEmployeeList().subscribe({
    next:(res)=>{
      this.dataSource=new MatTableDataSource(res);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
    },
    error:(err)=>{
      console.log(err);
    }
  })
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
deleteEmployee(id:number){
  this._empService.deleteEmployee(id).subscribe({
    next: (res)=>{
      // alert('Employee deleted');
      this._coreService.openSnackBar('Employee deleted','done');
      this.getEmployeeList(); //automatically referece
    },
    error: console.log,
  })
}

openEditForm(data:any){  // edit fuctionality
  const dialogRef = this._dialog.open(Register2Component,{
    data:data
  });
  dialogRef.afterClosed().subscribe({
    next: (val)=>{
      if(val){
        this.getEmployeeList();
      }
    }
  });
 
}
}
