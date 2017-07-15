import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LotteryLivePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lottery-live',
  templateUrl: 'lottery-live.html',
})
export class LotteryLivePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() { 
  }
  width: number = 400;
  onClickTest() {
    this.width = this.width - 50;  
    let iframe = <HTMLIFrameElement>(document.getElementById("mIframe"));  
    iframe.style.width = this.width + "px !important";
  }
}
