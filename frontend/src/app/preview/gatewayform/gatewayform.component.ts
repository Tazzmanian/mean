import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Gateway } from 'src/app/shared/gateway.model';
import { GatewayService } from 'src/app/shared/gateway.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gatewayform',
  templateUrl: './gatewayform.component.html',
  styleUrls: ['./gatewayform.component.css']
})
export class GatewayformComponent implements OnInit, OnDestroy {

  gwFormGroup: FormGroup;
  gw: Gateway = { name: '', sn: '', IPv4: '', devices: [] };
  addSubs: Subscription = new Subscription();
  error: string;

  @Output() close = new EventEmitter();

  constructor(private service: GatewayService) { }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    this.addSubs.unsubscribe();
  }

  initForm() {
    this.gwFormGroup = new FormGroup({
      name: new FormControl(this.gw.name, Validators.required),
      sn: new FormControl(this.gw.sn, Validators.required),
      IPv4: new FormControl(this.gw.IPv4, Validators.required)
    });
  }

  onSubmit() {
    console.log(this.gwFormGroup.value);
    this.ngOnDestroy();
    this.addSubs = this.service.addGateway(this.gwFormGroup.value)
      .subscribe((data) => {
        this.error = '';
        this.close.emit('');
      }, (err: any) => {
        console.log(err);
        this.error = err.error.message;
      });
  }

  cancel() {
    this.close.emit('');
  }

}
