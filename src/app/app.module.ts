import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { UserManagementComponent } from './user-management/user-management.component';

@NgModule({
  declarations: [
    AppComponent,
    UserManagementComponent
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [],
  bootstrap: []  // 👈 empty bootstrap
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    // Create custom element
    const userManagementElement = createCustomElement(UserManagementComponent, { injector: this.injector });
    customElements.define('user-management-mfe', userManagementElement);
  }
}