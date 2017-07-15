import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { LotteryDBCenter } from '../../../providers/lottery/lottery';
@IonicPage()
@Component({
  selector: 'page-statistic-loto-online',
  templateUrl: 'statistic-loto-online.html',
})
export class StatisticLotoOnlinePage {
  typeStatistic = '1';//1=Top rich; 2= Top rate;
  limit = 20;
  topRichDatas = []
  topWinRateDatas = [];
  segmentTop = 0;
  segmentHeight = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, private mMenuController: MenuController, public mAlertController: AlertController,
    public mLotteryDBCenter: LotteryDBCenter, public loadingCtrl: LoadingController) {

  }

  ionViewDidEnter() {
    let segmentHeader = document.getElementById("segment-header");
    this.segmentTop = segmentHeader.offsetTop;
    this.segmentHeight = segmentHeader.offsetHeight;
    this.setTouchMoveEvent();
    this.onInputChanged();
  }

  onInputChanged() {
    let loading = this.loadingCtrl.create({
      duration: 5000,
      content: "Đang tải dữ liệu"
    })
    loading.present();
    //Refresh data
    this.refreshData();

    this.mLotteryDBCenter.getLotteryHttpService().requestTopRichUser(this.limit).then(data => {
      this.onResponseTopRichUser(data);
      loading.dismiss();
    }, error => {
      loading.dismiss();
    })
    this.mLotteryDBCenter.getLotteryHttpService().requestTopWinRateUser(this.limit, 1).then(data => {
      this.onResponseTopWinRateUser(data);
    }, error => {
    })

  }

  onResponseTopRichUser(data) {
    if (data.content.length > 0)
      this.topRichDatas = data.content;
  }
  onResponseTopWinRateUser(data) {
    if (data.content.length > 0)
      this.topWinRateDatas = data.content.map(elm => {
        return {
          name: elm.name,
          rate: Math.round(+elm.trung * 100 / +elm.tong)
        }
      })
  }

  refreshData() {
    this.topRichDatas = [];
  }

  setTouchMoveEvent() {
    setTimeout(() => {
      //Khi scroll đến vị trí, header segment và table sẽ fixtop
      let mainHeaderHeight = 56;
      let segmentHeader = document.getElementById("segment-header");
      let tableHeaders = document.getElementsByClassName("table-header");
      let tableContent = document.getElementById('table-content');
      let tableHeaderElement = [];
      for (let i = 0; i < tableHeaders.length; i++) {
        tableHeaderElement.push(<HTMLElement>tableHeaders[i]);
      }
      let mainContent = <HTMLDivElement>document.getElementById("main-content");
      changeClass(this.segmentTop);
      mainContent.addEventListener('scroll', (event) => {
        changeClass(this.segmentTop);
      })
      function changeClass(segmentTop) { 
        if (mainContent.scrollTop >= -mainHeaderHeight + segmentTop) {
          segmentHeader.classList.add("fixed-top");
          tableHeaderElement.forEach(element => {
            element.classList.add("fixed-top");
          });
          tableContent.style.paddingTop = tableHeaders[0].clientHeight + segmentHeader.offsetHeight + 'px';
        } else {
          segmentHeader.classList.remove("fixed-top");
          tableHeaderElement.forEach(element => {
            element.classList.remove("fixed-top");
          });
          tableContent.style.paddingTop = '0px';
        }
      }
    }, 200);
  }


  onClickOpenMenu() {
    this.mMenuController.open("lottery");
  }

  getViewDate(dateString: string) {
    let date = new Date(dateString);
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return (d < 10 ? "0" : "") + d + "/" + (m < 10 ? "0" : "") + m + "<br>" + date.getFullYear();
  }

  getSystemDate(dateString: string) {
    let date = new Date(dateString);
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return date.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  }

  getSystemDate2(date: Date) {
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return date.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  }

}
