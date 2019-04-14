import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Gateway } from 'src/app/shared/gateway.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from 'src/app/shared/devices.model';
import { GatewayService } from 'src/app/shared/gateway.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit, OnDestroy {

  @Input() gwList: Gateway[];
  devices: Device[];
  gwsSubs: Subscription = new Subscription();
  delSubs: Subscription = new Subscription();
  sn: string;
  @Output() limit = new EventEmitter();


  constructor(
    private activatedRoute: ActivatedRoute,
    private service: GatewayService,
    private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.sn = params.sn;

      if (this.sn) {
        if (this.gwList.length === 0) {
          this.subGW();
        } else {
          this.fillGW(this.sn);
        }
      }
    });
  }

  subGW() {
    this.ngOnDestroy();
    this.gwsSubs = this.service.getAllGateways().subscribe((data) => {
      this.gwList = data;
      this.fillGW(this.sn);
    });
  }

  fillGW(sn: string) {
    this.devices = this.gwList.filter(x => x.sn === sn)[0].devices;
    this.limit.emit(this.devices.length.toString());
  }

  ngOnDestroy() {
    this.gwsSubs.unsubscribe();
    this.delSubs.unsubscribe();
  }

  deleteDevice(uid: number) {
    this.ngOnDestroy();
    this.delSubs = this.service.deleteDevice(uid, this.sn).subscribe(() => {
      this.subGW();
    });
    // this.router.navigate(['/gateways']);
  }

}
