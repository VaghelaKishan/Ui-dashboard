import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private fullname$ = new BehaviorSubject<string>("")
  private Role$ = new BehaviorSubject<string>("");

  constructor() { }

  public getRoleFromStore(){
    return this.Role$.asObservable();
  }

  public setRoleForStore(Role:string){
    this.Role$.next(Role);
  }

  public getFullNameFromStore(){
    return this.fullname$.asObservable();
  }

  public setFullNameForStore(fullname:string){
    this.fullname$.next(fullname);
  }
}
