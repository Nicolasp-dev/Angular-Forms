import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {

  loginForm={
    email: 'hello@test.com',
    password: '123456'
  }

  constructor() {}

  ngOnInit() {}

  login(loginForm: NgForm, event: Event) {
    console.log(loginForm.value, loginForm.valid);
  }
}
