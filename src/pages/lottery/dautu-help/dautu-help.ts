import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { LotteryDBCenter, LotoNumber } from "../../../providers/lottery/lottery";
import { ResponseCode } from "../../../providers/app-constant";
import { Utils } from "../../../providers/app-utils";


import { DauTuType } from '../lottery-dautu/lottery-dautu';

@IonicPage()
@Component({
  selector: 'page-dautu-help',
  templateUrl: 'dautu-help.html',
})
export class DauTuHelpPage {
  mType : DauTuType;
  constructor( public mLotteryDBCenter: LotteryDBCenter, public navCtrl: NavController, public navParams: NavParams) {
    this.mLotteryDBCenter.getCategories();
    this.mType = this.navParams.get("type");
  }

  ionViewDidEnter() {

  }
  onClickBack() {
    this.navCtrl.pop();
  }
  onClickHelp() {

  }

}
