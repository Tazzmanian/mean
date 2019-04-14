import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Gateway } from 'src/app/shared/gateway.model';
import { GatewayService } from 'src/app/shared/gateway.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.component.html',
  styleUrls: ['./gateway.component.css']
})
export class GatewayComponent implements OnInit, OnDestroy {

  @Input() gw: Gateway;
  delSubs = new Subscription();
  @Output() remove = new EventEmitter<string>();

  constructor(private service: GatewayService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.delSubs.unsubscribe();
  }


  deleteGateway(sn: string) {
    this.ngOnDestroy();
    this.delSubs = this.service.deleteGateway(sn).subscribe(() => {
      this.remove.emit(sn);
    });
  }

}
