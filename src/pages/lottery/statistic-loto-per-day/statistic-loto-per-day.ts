import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { Loto, LotoDay, LotteryDBCenter } from '../../../providers/lottery/lottery';
@IonicPage()
@Component({
  selector: 'page-statistic-loto-per-day',
  templateUrl: 'statistic-loto-per-day.html',
})
export class StatisticLotoPerDayPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public mAlertController: AlertController,
    public mLotteryDBCenter: LotteryDBCenter, public loadingCtrl: LoadingController) {
    this.mLotteryDBCenter.getCategories();
    if (this.mLotteryDBCenter.categories.length > 0) {
      this.category = this.mLotteryDBCenter.categories[0];
    }
  }
  type = {
    id: 1,
    name: "Xổ số miền Bắc"
  }
  category = {
    id: 1,
    name: "Truyền thống"
  }
  timeStart = new Date();
  timeEnd = new Date();
  times: Array<number> = [1, 2, 3, 4, 8, 12, 16, 20];
  timePeriod = 4;
  typeFilter = "head";

  lotosResult: Array<LotoDay> = [new LotoDay(), new LotoDay()];
  lotosFilter = [
    {
      date: "2017-01-01",
      sum: { count: [0, 1, 2, 3, 2, 3, 1, 4, 4, 2], max: 4 },
      head: { count: [2, 3, 4, 1, 2, 1, 6, 7, 3, 2], max: 7 },
      back: { count: [1, 0, 8, 2, 1, 3, 3, 4, 1, 6], max: 6 }
    },
    {
      date: "2017-01-02",
      sum: { count: [2, 3, 4, 1, 2, 1, 6, 7, 3, 2], max: 7 },
      head: { count: [0, 1, 2, 3, 2, 3, 1, 4, 4, 2], max: 4 },
      back: { count: [1, 0, 8, 2, 1, 3, 3, 4, 1, 6], max: 6 }
    },
    {
      date: "2017-01-03",
      sum: { count: [1, 0, 8, 2, 1, 3, 3, 4, 1, 6], max: 6 },
      head: { count: [2, 3, 4, 1, 2, 1, 6, 7, 3, 2], max: 7 },
      back: { count: [0, 1, 2, 3, 2, 3, 1, 4, 4, 2], max: 4 }
    }
  ]
  segmentTop = 0;
  ionViewDidEnter() {
    let segmentHeader = document.getElementById("segment-header");
    this.segmentTop = segmentHeader.offsetTop;
    this.setTouchMoveEvent();
    this.onInputChanged();
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
           tableContent.style.paddingTop = "0px";
        }
      }
    }, 200);
  }

  onInputChanged() {
    let loading = this.loadingCtrl.create({
      duration: 5000,
      content: "Đang tải dữ liệu"
    })
    loading.present();
    //Refresh data
    this.lotosResult = [];
    this.lotosFilter = [];
    if (this.timePeriod < 0) this.timePeriod = 1;
    if (this.timePeriod > 60) this.timePeriod = 60;
    this.timeStart = new Date(this.timeEnd);
    this.timeStart.setDate(this.timeEnd.getDate() - this.timePeriod * 7);

    //Lấy dữ liệu loto theo các ngày đã chọn    
    this.mLotteryDBCenter.getLotteryHttpService().requestCategoryResultLoto(this.type.id, this.category.id, this.getSystemDate2(this.timeStart),
      this.getSystemDate2(this.timeEnd), -1, this.timePeriod * 7).then(data => {
        this.onResponseCategoryResultLoto(data);
        loading.dismiss()
      }
      , error => {
        loading.dismiss();
      })
  }

  onResponseCategoryResultLoto(data) {
    data.content.forEach(lotoDay => {
      let curLotoDay = new LotoDay();
      curLotoDay.onResponseCategoryResultLoto(lotoDay);
      this.lotosResult.push(curLotoDay);
    });
    //Filter dữ liệu
    this.lotosResult.forEach(lotoDay => {
      let curElm: any = {};
      let sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let head = [...sum];
      let back = [...sum];

      curElm.date = lotoDay.time;
      lotoDay.lotos.forEach(loto => {
        let decimal = Math.floor(parseInt(loto.loto) / 10);
        let unit = parseInt(loto.loto) % 10;
        sum[(decimal + unit) % 10]++;
        head[decimal % 10]++;
        back[unit % 10]++;
      });
      curElm["sum"] = { "count": sum, "max": Math.max(...sum) };
      curElm["head"] = { "count": head, "max": Math.max(...head) };
      curElm["back"] = { "count": back, "max": Math.max(...back) };
      this.lotosFilter.push(curElm);
    });
    this.lotosFilter.reverse();
  }

  onClickPickCategory() {
    let alert = this.mAlertController.create();
    alert.setTitle("Chọn tỉnh");
    let index = 0;
    for (let category of this.mLotteryDBCenter.categories) {
      alert.addInput({
        type: 'radio',
        label: category.name,
        value: category.id + '',
        checked: category.id == this.category.id
      });
      index++;
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let id: number = parseInt(data);
          for (let category of this.mLotteryDBCenter.categories) {
            if (category.id == id) {
              this.category = category;
              this.onInputChanged();
              break;
            }
          }
        }
      }
    });
    alert.present();
  }

  onClickPickWeeks() {

    let alert = this.mAlertController.create();
    alert.setTitle("Chọn thời gian thống kê");
    for (let i = 0; i < this.times.length; i++) {

      alert.addInput({
        type: 'radio',
        label: "" + this.times[i] + " tuần trước",
        value: "" + this.times[i],
        checked: this.times[i] == this.timePeriod
      });

    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let value: number = parseInt(data);
          if (value != this.timePeriod) {
            this.timePeriod = value;
            this.onInputChanged();
          }
        }
      }
    });
    alert.present();

  }

  onClickBack() {
    this.navCtrl.pop();
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
