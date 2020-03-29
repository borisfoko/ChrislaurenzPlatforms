import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
  
  // Slick slider config
  public logoSlideConfig: any = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [{
        breakpoint: 1367,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  };

  // Logo
  public logo = [{
      image: 'assets/images/logos/1.png',
      url: 'https://chrislaurenz.de'
    }, {
      image: 'assets/images/logos/2.png',
      url: 'https://www.chanel.com/de'
    }, {
      image: 'assets/images/logos/3.png',
      url: 'https://www.chloe.com/de'
    }, {
      image: 'assets/images/logos/4.png',
      url: 'https://chrislaurenz.de'
    }, {
      image: 'assets/images/logos/5.png',
      url: 'https://www.armani.com/de/giorgioarmani'
    }, {
      image: 'assets/images/logos/6.png',
      url: 'https://www.nike.com/de'
    }]
}