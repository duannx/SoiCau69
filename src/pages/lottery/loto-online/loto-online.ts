import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-loto-online',
  templateUrl: 'loto-online.html',
})
export class LotoOnlinePage {
  page = 'play';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  ionViewDidLoad() { 
  }
  onChange(event) { 
  }

}
