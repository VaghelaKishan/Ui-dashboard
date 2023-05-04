import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class UsersDataService {

  url="https://ipinfo.io/8.8.8.8/json?token=360af50b084b43";
  fireauth: any;
  router: any;
  constructor(private http:HttpClient) { }
  users(){
    return this.http.get(this.url);
  }



}
