import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetComponent } from './reset/reset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { SignInWithApple } from '@awesome-cordova-plugins/sign-in-with-apple/ngx';




@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ResetComponent,
    DeleteAccountComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    Facebook,
    SignInWithApple
  ]
})
export class AuthModule { }
