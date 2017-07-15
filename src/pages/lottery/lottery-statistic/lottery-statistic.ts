import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

class StatisticType {
  name: string;
  page: string;
}

@IonicPage()
@Component({
  selector: 'page-lottery-statistic',
  templateUrl: 'lottery-statistic.html',
})
export class LotteryStatisticPage {
  _types: Array<StatisticType> = [
    { name: "Thống kê nhanh", page: "StatisticLotoQuickPage" },
    { name: "Thống kê theo tổng", page: "StatisticLotoSumPage" },
    { name: "Thống kê Loto đầu đuôi", page: "StatisticLotoPerDayPage" },
    { name: "Thống kê Lô gan", page: "StatisticLotoGanPage" },
    { name: "Thống kê Lô rơi", page: "StatisticConsecutiveLotoPage" },
    { name: "Thống kê theo tần suất", page: "StatisticLotoFrequentlyPage" },
    { name: "Thống kê tổng hợp Loto", page: "StatisticLotoPage" },
    { name: "Thống kê theo ngày trong tuần", page: "StatisticLotoDayPage" },
    { name: "Thống kê giải đặc biệt ngày mai", page: "StatisticNextDayPage" },
    { name: "Thống kê Bảng đặc biệt năm", page: "SpecialPrizeTablePage" },
    { name: "Thống kê chu kì giải đặc biệt", page: "SpecialPrizeCyclePage" },
    { name: "Thống kê Loto yêu thích", page: "StatisticTestPage" },
    { name: "Dự đoán kết quả Loto", page: "StatisticLotoRecommendPage" },

  ];
  constructor(public navCtrl: NavController, public navParams: NavParams, private mMenuController: MenuController) {
  }
  onClickOpenMenu() {
    this.mMenuController.open("lottery");
  }
  onClickType(type: StatisticType) {
    this.navCtrl.push(type.page);
  }
  ionViewDidEnter() {
  }
}
