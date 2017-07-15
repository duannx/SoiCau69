import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppAnimation } from '../../../providers/app-animation';
@IonicPage()
@Component({
  selector: 'page-modal-loto-detail',
  templateUrl: 'modal-loto-detail.html',
})
export class ModalLotoDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() { 
    // AppAnimation.getInstance().animate(document.getElementById("center-content"), "slideInUp", "400ms", 1);
  }

}
