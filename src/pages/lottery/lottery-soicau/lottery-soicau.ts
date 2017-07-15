import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { LotteryDBCenter } from '../../../providers/lottery/lottery';

class SoicauType {
  name: string;
  page: string;
  input: any;
}


@IonicPage()
@Component({
  selector: 'page-lottery-soicau',
  templateUrl: 'lottery-soicau.html',
})
export class LotterySoicauPage {
  _types: Array<SoicauType> = [
    { name: "Cầu Loto", page: "SoicauLotoPage", input: {} },
    { name: "Cầu loại Loto", page: "SoicauLotoPage", input: { cau_loai: 1, cau_hai_nhay: 0, title: "Cầu loại Loto" } },
    { name: "Cầu ăn 2 nháy", page: "SoicauLotoPage", input: { cau_loai: 0, cau_hai_nhay: 1, title: "Cầu Loto hai nháy" } },
    { name: "Cầu giải đặc biệt", page: "SoicauLotoPage", input: {} },
    { name: "Cầu Loto theo thứ", page: "SoicauLotoPage", input: {} },
    { name: "Cầu Loto bạch thủ", page: "SoicauLotoPage", input: {} },
    { name: "Cầu giải đặc biệt thứ", page: "SoicauLotoPage", input: {} },
    { name: "Cầu Loto tam giác", page: "SoicauLotoPage", input: {} },
    { name: "Cầu Loto loto bạch thủ thứ", page: "SoicauLotoPage", input: {} },
    { name: "Cầu Loto loại loto bạch thủ", page: "SoicauLotoPage", input: {} }
  ];
  constructor(private mLotteryDBCenter: LotteryDBCenter, private navCtrl: NavController, private mMenuController: MenuController) {

  }
  onClickOpenMenu() {
    this.mMenuController.open("lottery");
  }
  onClickType(type: SoicauType) {
    this.navCtrl.push(type.page, { input: type.input }); 
  }
}
