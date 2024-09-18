import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  timedOut = false;
  lastPing?: Date = null;
  updatesAvailable: Subscription;
  constructor(

  ) {
  }

  ngOnDestroy(): void {
 
  }
  ngOnInit(): void {
  
  }
  onActivate(event) {
    window.scroll(0, 0);
  }

}
