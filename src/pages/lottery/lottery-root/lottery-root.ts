import { Inject, forwardRef, Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { AppLoop } from '../../../providers/app-loop';
import { LotoVipNumber, LotteryDBCenter } from '../../../providers/lottery/lottery';
import { AppController } from '../../../providers/app-controller';
import Chart from "chart.js";
import { LotteryHomePage } from '../lottery-home/lottery-home';

@IonicPage()
@Component({
  selector: 'page-lottery-root',
  templateUrl: 'lottery-root.html'
})
export class LotteryRootPage {
  lotosVipHide = [];
  lotosVip: Array<LotoVipNumber> = [new LotoVipNumber(), new LotoVipNumber(), new LotoVipNumber(), new LotoVipNumber()];
  lotosVipHistory = [];
  lotVipUpdated = false;

  startDay = new Date();
  upcomingDate = new Date
  constructor(private navCtrl: NavController, public navParams: NavParams, private mMenuController: MenuController, public alertCtrl: AlertController,
    public mLotteryDBCenter: LotteryDBCenter, public loadingCtrl: LoadingController) {
    this.upcomingDate.setDate(this.upcomingDate.getDate() + 1);
    this.startDay.setDate(this.startDay.getDate() - 10);
  }

  ionViewDidEnter() {
    this.mMenuController.enable(true, "lottery");
    if (this.mLotteryDBCenter.mLotoVipNumbers.length > 0) {
      this.lotosVip = this.mLotteryDBCenter.mLotoVipNumbers;
      this.lotVipUpdated = true;
    }
    this.getLotoVip();

  }
  onClickOpenMenu() {
    this.mMenuController.open("lottery");
  }
  getLotoVip() {
    let loading = this.loadingCtrl.create({
      content: "Xin đợi",
      duration: 5000,
      dismissOnPageChange: true
    })
    loading.present();
    let startDate = new Date();
    let endDate = new Date();
    startDate.setDate(startDate.getDate() - 11);
    endDate.setDate(endDate.getDate() - 1);
    this.mLotteryDBCenter.getLotteryHttpService().requestLotoRecommendQuery(1, this.getSystemDate2(startDate), this.getSystemDate2(endDate)).then(data => {
      this.onResponseGetLotoVip(data);
      loading.dismiss();
    }, error => {
      loading.dismiss();
    });
  }

  onResponseGetLotoVip(data) {
    if (data.content.length > 0) {
      data.content.reverse();
      this.lotosVipHistory = [];
      let currentTime = new Date('2017-01-01').getTime();
      let lastDate = "2017-01-01";
      for (let i = 0; i < data.content.length; i++) {
        let element = data.content[i];
        if (element.content.length > 0) {
          let lotoVip = [];
          element.content.forEach(elm => {
            lotoVip.push(new LotoVipNumber(elm.c, elm.r));
          });
          if (new Date(element.time).getTime() >= currentTime) {
            this.lotosVipHide = lotoVip;
            lastDate = element.time;
          };
          this.lotosVipHistory.push({ lotos: lotoVip, time: element.time });

        }
      }
      let index = this.lotosVipHistory.findIndex(elm => {
        return elm.time == lastDate;
      })
      if (index > -1) {
        this.lotosVipHistory.splice(index, 1);
      }
      if (!this.lotVipUpdated && this.lotosVipHide.length > 0) this.lotosVip = this.lotosVipHide;
    }
  }

  gotoLotteryHome(date) {
    if (!AppController.getInstance().hasNavController()) return;
    AppController.getInstance().getNavController().setRoot(LotteryHomePage, {
      input: {
        date: date,
        category: 1,
        type: 1
      }
    });
    this.mLotteryDBCenter.setMenuActive('LotteryHomePage');
  }

  getSystemDate2(date: Date) {
    let m: number = date.getMonth() + 1;
    let d: number = date.getDate();
    return date.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  }

  getViewDate(date: string) {
    let mDate = new Date(date);
    let m: number = mDate.getMonth() + 1;
    let d: number = mDate.getDate();
    return (d < 10 ? "0" : "") + d + "/" + (m < 10 ? "0" : "") + m + "/" + mDate.getFullYear();
  }

}
