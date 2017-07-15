import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { LotteryDBCenter } from '../../../providers/lottery/lottery';

export class DauTuType {
  id: number;
  name: string;
  page: string;
}


@IonicPage()
@Component({
  selector: 'page-lottery-dautu',
  templateUrl: 'lottery-dautu.html',
})
export class LotteryDauTuPage {
  _types: Array<DauTuType> = [
    { id: 0, name: "Lô cặp nuôi 3 ngày", page: "DauTuCapPage" },
    { id: 1, name: "Bạch thủ nuôi 7 ngày", page: "DauTuBachThuPage" },
    { id: 2, name: "Dàn 3 con trong ngày", page: "DauTuDanBaPage" },
    { id: 3, name: "Dàn 4 con trong ngày", page: "DauTuDanBonPage" },
    { id: 4, name: "Lô nuôi luỹ tiến", page: "DauTuLuyTienPage" }
  ];
  constructor(private mLotteryDBCenter: LotteryDBCenter, private navCtrl: NavController, private mMenuController: MenuController) {

  }
  onClickOpenMenu() {
    this.mMenuController.open("lottery");
  }
  onClickType(type: DauTuType) {
    this.navCtrl.push(type.page, {
      type: type
    });
  }
}
