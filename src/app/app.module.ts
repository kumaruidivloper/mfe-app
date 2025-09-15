import { NgModule, Injector, DoBootstrap } from '@angular/core';
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
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    const elementName = 'user-management-mfe';
    
    // Check if already defined to avoid the error you mentioned
    if (!customElements.get(elementName)) {
      const element = createCustomElement(AppComponent, {
        injector: this.injector
      });
      customElements.define(elementName, element);
      console.log(`${elementName} custom element defined successfully`);
    } else {
      console.log(`${elementName} already defined`);
    }
  }
}