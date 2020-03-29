import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PriceComponent implements OnInit {
  
  // Using Output EventEmitter
  @Output() priceFilters = new EventEmitter();
	
  // define min, max and range
  public min : number = 5;
  public max : number = 250;
  public range = [5,250];
  
  constructor() { }
  
  ngOnInit() {  }

  // rangeChanged
  priceChanged(event:any) {
    setInterval(() => {
      this.priceFilters.emit(event);
    }, 250);
  }

}
