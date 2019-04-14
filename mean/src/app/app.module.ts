import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreviewComponent } from './preview/preview.component';
import { GatewayComponent } from './preview/gateway/gateway.component';
import { DeviceComponent } from './preview/device/device.component';
import { HttpClientModule } from '@angular/common/http';
import { GatewayformComponent } from './preview/gatewayform/gatewayform.component';
import { DeviceformComponent } from './preview/deviceform/deviceform.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    PreviewComponent,
    GatewayComponent,
    DeviceComponent,
    GatewayformComponent,
    DeviceformComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
