import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl  = "https://localhost:7249/api/User/";
  constructor(private http: HttpClient) { }

  getusers(){
    return this.http.get<any>(this.baseUrl);
  }

  deleteItem(id: number) {
    return this.http.delete(`${this.baseUrl}${id}`);
  }

  // updateData(info:any){
  //   return this.http.put(`${this.baseUrl}`+info.id,info);
  //  }
   getOne(id: number){
     return this.http.get(`${this.baseUrl}${id}`);
   }

  updateData(User: any): Observable<any> {
    const url = `${this.baseUrl}${User.id}`;
    return this.http.put(url, User);
  }

}
