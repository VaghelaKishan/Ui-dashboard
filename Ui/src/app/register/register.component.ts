import { Component, OnInit } from '@angular/core';
import { PipePipe } from '../pipe.pipe';
import { ElementRef, VERSION, ViewChild } from '@angular/core';
import { Country, State, City } from 'country-state-city';
import {FormArray,FormBuilder,FormControl,FormGroup,Validators,} from '@angular/forms';
import { RouteReuseStrategy, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';

// console.log(Country.getAllCountries());
// console.log(State.getAllStates());
// console.log(City.getAllCities());
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  cc: any;
  submitted: boolean | undefined;

  ngOnInit(): void {
    (function () {
      'use strict';

      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.querySelectorAll('.needs-validation');

      // Loop over them and prevent submission
      Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener(
          'submit',
          function (event: {
            preventDefault: () => void;
            stopPropagation: () => void;
          }) {
            if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
            }

            form.classList.add('was-validated');
          },
          false
        );
      });
    })();
  }
 
  checkArray: Array<string> = [];

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{6,}'),
    ]),
    firstname: new FormControl ('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    middlename: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(10),]),
    address: new FormControl('', [Validators.required,Validators.maxLength(350),]),
    Country1: new FormControl('', [Validators.required]),
    State1: new FormControl('', [Validators.required]),
    City1: new FormControl('', [Validators.required]),
    Country: new FormControl(),
    State: new FormControl(),
    City: new FormControl(),
    profile: new FormControl('', [Validators.required]),
    hobbie: new FormControl('', [Validators.required]),
    Qualification: new FormControl('', [Validators.required]),
    Age: new FormControl(''),
    checkarray :new FormControl(this.checkArray)
  });

  //get
  registerUser() {
    // console.warn(this.registerForm.value);
  }
  get firstname() {
    return this.registerForm.get('firstname');
  }
  get middlename() {
    return this.registerForm.get('middlename');
  }
  get lastname() {
    return this.registerForm.get('lastname');
  }

  get user() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get gender() {
    return this.registerForm.get('gender');
  }
  get date() {
    return this.registerForm.get('date');
  }
  get phone() {
    return this.registerForm.get('phone');
  }
  get address() {
    return this.registerForm.get('address');
  }
  get Country1() {
    return this.registerForm.get('Country1');
  }
  get profile() {
    return this.registerForm.get('profile');
  }
  get hobbie() {
    return this.registerForm.get('hobbie');
  }
  get State1() {
    return this.registerForm.get('State1');
  }
  get City1() {
    return this.registerForm.get('City1');
  }
  get Qualification() {
    return this.registerForm.get('Qualification');
  }
  get Age() {
    return this.registerForm.get('Age');
  }
  get f() {
    return this.registerForm.controls;
  }

  //Age
  // ngOnInit(): void {

  // }
  public year: any;
  public age: string | number = " Get Age ";
  constructor(private fb: FormBuilder, private route: Router,private auth:AuthService,private router:Router,private toast:NgToastService) {
    // this.form = this.fb.group({
    //   checkArray: this.fb.array([], [Validators.required]),
    // });
  }

  public onSubmit(): void {
    this.age = new PipePipe().transform(this.year);
    // console.log(this.age.name);
  }

  //  country
  @ViewChild('country') country: ElementRef | any;
  @ViewChild('city') city: ElementRef | any;
  @ViewChild('state') state: ElementRef | any;
  name = 'Angular ' + VERSION.major;
  countries = Country.getAllCountries();
  states: any = null;
  cities: any = null;

  selectedCountry: null | undefined;
  selectedState: null | undefined;
  selectedCity: null | undefined;


  onCountryChange($event: any): void {
    this.states = State.getStatesOfCountry(
      JSON.parse(this.country.nativeElement.value).isoCode
    );
    this.selectedCountry = JSON.parse(this.country.nativeElement.value);
    this.cities = this.selectedState = this.selectedCity = null;
    var country = JSON.parse(this.country.nativeElement.value).name;
    this.registerForm.get('Country')?.setValue(country);
  }

  onStateChange($event: any): void {
    this.cities = City.getCitiesOfState(
      JSON.parse(this.country.nativeElement.value).isoCode,
      JSON.parse(this.state.nativeElement.value).isoCode
    );
    this.selectedState = JSON.parse(this.state.nativeElement.value);
    this.selectedCity = null;
    var state = JSON.parse(this.state.nativeElement.value).name;
    this.registerForm.get('State')?.setValue(state);
  }

  onCityChange($event: any): void {
    this.selectedCity = JSON.parse(this.city.nativeElement.value);
    var city = JSON.parse(this.city.nativeElement.value).name;
    this.registerForm.get('City')?.setValue(city);
  }

  clear(type: string): void {
    switch (type) {
      case 'country':
        this.selectedCountry =
          this.country.nativeElement.value =
          this.states =
          this.cities =
          this.selectedState =
          this.selectedCity =
            null;
        break;
      case 'state':
        this.selectedState =
          this.state.nativeElement.value =
          this.cities =
          this.selectedCity =
            null;
        break;
      case 'city':
        this.selectedCity = this.city.nativeElement.value = null;
        break;
    }
  }


  // //profile
  url = './assets/Profile-Male-PNG.png';
  onselectFile(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };
    }
  }

  onchange() {
    // console.warn(this.registerForm.value);
    // console.warn(this.form.value);

    if (
      this.registerForm.value.firstname &&
      this.registerForm.value.lastname &&
      this.registerForm.value.middlename &&
      this.registerForm.value.address &&
      this.registerForm.value.date &&
      this.registerForm.value.password &&
      this.registerForm.value.email &&
      this.registerForm.value.phone &&
      this.registerForm.value.Qualification &&
      this.registerForm.value.Country1 &&
      this.registerForm.value.City1 &&
      this.registerForm.value.State1
    ) {
      // this.route.navigate(['']);
      // Swal.fire({
      //   title: 'SUCCESSFULLY REGISTERED ',
      //   icon: 'success',
      // });
      // console.warn(this.registerForm.value);
      // console.warn(this.form.value);

      // ---------perform login for register
      this.auth.signUp(this.registerForm.value)
      .subscribe({
        next:(res=>{
          // alert(res.message)
          this.toast.success({detail:"SUCCESS",summary:res.message,duration:5000});
          this.registerForm.reset();
          this.router.navigate(['']);
        }),
        error:(err=>{
          // alert(err?.error.message)
          this.toast.error({detail:"ERROR",summary:err?.error.message,duration:5000});

        })
      })
    }
     else {
      // Swal.fire({
      //   title: 'PLEASE FILL ALL REQUIERD DETAILS',
      //   icon: 'warning',
      // });
      this.toast.warning({detail:"WARN",summary:"PLEASE FILL ALL VALID DETAILS!",duration:5000});

    }
  }

  //chechbox------------------

  // constructor(private fb: FormBuilder) {
  //   this.form = this.fb.group({
  //     checkArray: this.fb.array([], [Validators.required]),
  // }


  Data: Array<any> = [
    { name: 'Cricket', value: 'Cricket' },
    { name: 'Vollyball', value: 'Vollyball' },
    { name: 'Chess', value: 'Chess' },
    { name: 'Drawing', value: 'Drawing' },
    { name: 'Photography', value: 'Photography' },
    { name: 'Writting', value: 'Writting' },
    { name: 'Dance', value: 'Dance' },
    { name: 'Video Game', value: 'Video Game' },
    { name: 'Web design', value: 'Web design' },
  ];

  onCheckboxChange(e: any) {
    if (e.target.checked) {
      this.checkArray.push(e.target.value);
    } else {
      let i: number = this.checkArray.indexOf(e.target.value);
      this.checkArray.forEach((item: any) => {
        if (item.value == e.target.value) {
          this.checkArray.splice(i,1);
          return;
        }
        i++;
      });
    }
  }

  // gender--------

  selectedGender: string = '';
  Genders: any = ['male'];
  Genders1: any = ['female'];
  Genders2: any = ['other'];
  radiochange(event: any) {
    this.selectedGender = event.target.value;
  }
}


