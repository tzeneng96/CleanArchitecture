import { Component } from '@angular/core';

@Component({
  selector: 'footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrl: './footer-nav.component.css'
})
export class FooterNavComponent {
  public version: string;
  now = new Date();
  constructor() {
  }

  navLinks = [

  ];
  ngOnInit(): void { }
}
