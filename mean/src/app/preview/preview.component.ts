import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { GatewayService } from '../shared/gateway.service';
import { Subscription } from 'rxjs';
import { Gateway } from '../shared/gateway.model';
import { Router } from '@angular/router';
import { DeviceComponent } from './device/device.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit, OnDestroy {

  gwListSubs: Subscription = new Subscription();
  gwList: Gateway[] = [];
  dC = false;
  showGw: boolean;
  showD: boolean;

  @ViewChild('devices') devices: DeviceComponent;

  constructor(private gws: GatewayService, private router: Router) { }

  ngOnInit() {
    this.loadGW();
  }

  loadGW() {
    this.gwListSubs = this.gws.getAllGateways().subscribe((data) => {
      this.gwList = [...data];
    });
  }

  ngOnDestroy(): void {
    this.gwListSubs.unsubscribe();
  }

  onRemove(sn) {
    this.ngOnDestroy();
    // this.loadGW();
    this.router.navigate(['/']);
  }

  dCount(count) {
    this.dC = count < 10;
  }

  onClickGw() {
    this.showGw = true;
    this.showD = false;
  }

  onClickD() {
    this.showGw = false;
    this.showD = true;
  }

  closeGW() {
    this.showGw = false;
    this.loadGW();
  }

  closeD() {
    this.showD = false;
    this.loadGW();
    this.devices.ngOnInit();
  }
}
