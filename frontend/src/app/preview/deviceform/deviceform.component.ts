import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Device } from 'src/app/shared/devices.model';
import { Subscription } from 'rxjs';
import { GatewayService } from 'src/app/shared/gateway.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-deviceform',
  templateUrl: './deviceform.component.html',
  styleUrls: ['./deviceform.component.css']
})
export class DeviceformComponent implements OnInit, OnDestroy {

  dFormGroup: FormGroup;
  d: Device = { UID: null, status: null, vendor: null };
  addSubs: Subscription = new Subscription();
  error: string;

  @Input() sn: string;
  @Output() close = new EventEmitter();

  constructor(private service: GatewayService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.sn = params.sn;

      if (this.sn) {
        this.initForm();
      } else {
        this.cancel();
      }
    });
  }

  ngOnDestroy() {
    this.addSubs.unsubscribe();
  }

  initForm() {
    this.dFormGroup = new FormGroup({
      status: new FormControl(this.d.status, Validators.required),
      UID: new FormControl(this.d.UID, Validators.required),
      vendor: new FormControl(this.d.vendor, Validators.required)
    });
  }

  onSubmit() {
    this.ngOnDestroy();
    this.addSubs = this.service.addDevice(this.dFormGroup.value, this.sn)
      .subscribe((data) => {
        this.error = '';
        this.cancel();
      }, (err: any) => {
        this.error = err.error.message;
      });
  }

  cancel() {
    this.close.emit('');
    // window.location.reload();
  }

}
