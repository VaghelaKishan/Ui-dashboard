import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt'
import { TokenApiModel } from '../models/token-api.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string ="https://localhost:7249/api/User/";
  private userPayload:any;
  constructor(private http:HttpClient,private router:Router) { 
    this.userPayload = this.decodeToken();
  }

  signUp(userobj:any){
    return this.http.post<any>(`${this.baseUrl}register`,userobj)
  }

  sighOut(){
    localStorage.clear();
    // localStorage.removeItem('Token');  --same
    this.router.navigate([''])
  }

  login(loginobj:any){
    return this.http.post<any>(`${this.baseUrl}authenticate`,loginobj)
  }


  // token validation then component access
  storeToken(tokenValue: string){
    localStorage.setItem(`token`,tokenValue)
  }
  storeRefreshToken(tokenValue: string){
    localStorage.setItem(`refreshToken`,tokenValue)
  }


  getToken(){
    return localStorage.getItem('token')
  }
  getRefreshToken(){
   return localStorage.getItem(`refreshToken`)
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('token')  // !! - convert to string to boolean
  }

  decodeToken(){
    const jwtHelper = new JwtHelperService();
    const token =  this.getToken()!;
    // console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token)
  }

  getfullNameFromToken(){
    if(this.userPayload)
    return this.userPayload.name;
  }
  getRoleFromToken(){
    if(this.userPayload)
    return this.userPayload.Role;
  }

  renewToken(tokenApi:TokenApiModel){
    return this.http.post<any>(`${this.baseUrl}refresh`,tokenApi)
  }

 
}
