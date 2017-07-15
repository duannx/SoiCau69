import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { LotteryDBCenter } from '../../../providers/lottery/lottery';

@IonicPage()
@Component({
  selector: 'page-lottery-help',
  templateUrl: 'lottery-help.html',
})
export class LotteryHelpPage {
  constructor(private mLotteryDBCenter: LotteryDBCenter, private navCtrl: NavController, private mMenuController: MenuController) {

  }



}
