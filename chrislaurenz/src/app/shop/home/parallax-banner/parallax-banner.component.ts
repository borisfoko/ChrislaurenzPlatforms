import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parallax-banner',
  templateUrl: './parallax-banner.component.html',
  styleUrls: ['./parallax-banner.component.scss']
})
export class ParallaxBannerComponent implements OnInit {
    
  public year: string;
  constructor() { }

  ngOnInit() {
    this.year = new Date().getFullYear().toString();
  }

}
