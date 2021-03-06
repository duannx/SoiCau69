import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Alert, AlertController } from 'ionic-angular';
import { LotteryDBCenter } from '../../../providers/lottery/lottery';

@IonicPage()
@Component({
  selector: 'page-lottery-user-lotohistory',
  templateUrl: 'lottery-user-lotohistory.html',
})
export class LotteryUserLotoHistoryPage {
  constructor(
    private mAlerController: AlertController,
    private mLotteryDBCenter: LotteryDBCenter,
    private navCtrl: NavController,
    private mMenuController: MenuController) {

  }

  ionViewDidEnter() {

  }
  
}
