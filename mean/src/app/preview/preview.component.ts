import { Component, OnInit, OnDestroy } from '@angular/core';
import { GatewayService } from '../shared/gateway.service';
import { Subscription } from 'rxjs';
import { Gateway } from '../shared/gateway.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit, OnDestroy {

  gwListSubs: Subscription = new Subscription();
  gwList: Gateway[] = [];

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

}
