import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, ToastController } from 'ionic-angular';


import { LotteryDBCenter, LotoNumber, LotoDay, Loto } from "../../../providers/lottery/lottery";
import { Utils } from "../../../providers/app-utils";
import { ResponseCode } from "../../../providers/app-constant";

import { DatePicker } from '@ionic-native/date-picker';

import Chart from "chart.js";


class LotoVip extends LotoNumber {
  percent: number = 0;
  setPercent(val) {
    this.percent = val;
  }
  cloneFrom(loto: LotoVip) {
    this.loto = loto.loto;
    this.count = loto.count;
    this.last_time = loto.last_time;
    this.value = loto.value;
    this.percent = loto.percent;
  }
}

@IonicPage()
@Component({
  selector: 'page-statistic-loto-vip',
  templateUrl: 'statistic-loto-vip.html',
})
export class StatisticLotoVipPage {
  OPTION_VALUE_INCREASE: number = 0;
  OPTION_VALUE_DECREASE: number = 1;
  OPTION_COUNT_INCREASE: number = 2;
  OPTION_COUNT_DECREASE: number = 3;

  lotos_max: Array<LotoVip> = [];
  lotos: Array<LotoVip> = [];

  mChart: any;

  inputs = {
    category: {
      id: 1,
      name: "Truyền thống"
    },
    count: 10,
    months: 1
  };

  filters: Array<number> = [5, 10, 15, 20, 30, 40, 50, 60];

  months: Array<number> = [1, 2, 6, 12];

  mMaxFrequent: number = 0;

  mSortOption = this.OPTION_VALUE_INCREASE;

  mLotoDays: Array<LotoDay> = [];
  mFilterLoto: Array<LotoNumber> = [];
  constructor(
    private mToastController: ToastController,
    public mLoadingController: LoadingController,
    public mAlertController: AlertController,
    public mDatePicker: DatePicker,
    public mLotteryDBCenter: LotteryDBCenter,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.mLotteryDBCenter.getCategories();
    if (this.mLotteryDBCenter.categories.length > 0) {
      this.inputs.category = this.mLotteryDBCenter.categories[0];
    }
  }

  ionViewDidEnter() {
    this.createDatas();
    this.drawCharts();
    this.onInputChanged();
  }

  createDatas() {
    for (let i = 0; i < 100; i++) {
      {
        let loto = new LotoVip();
        loto.setValue(i);
        this.lotos.push(loto);
      }
      {
        let lotoNumber = new LotoNumber();
        lotoNumber.setValue(i);;
        this.mFilterLoto.push(lotoNumber);
      }
    }
    while (this.lotos_max.length < 10) {
      this.lotos_max.push(new LotoVip());
    }
  }

  onClickBack() {
    this.navCtrl.pop();
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
        checked: category.id == this.inputs.category.id
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
              this.inputs.category = category;
              this.onInputChanged();
              break;
            }
          }
        }
      }
    });
    alert.present();
  }

  onClickPickMonths() {
    let alert = this.mAlertController.create();
    alert.setTitle("Chọn khoảng thời gian");
    let index = 0;
    for (let month of this.months) {
      alert.addInput({
        type: 'radio',
        label: month + " tháng trước",
        value: month + '',
        checked: this.inputs.months == month
      });
      index++;
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let month: number = parseInt(data);
          if (month != this.inputs.months) {
            this.inputs.months = month;
            this.onInputChanged();
          }
        }
      }
    });
    alert.present();
  }

  onClickSortOptions() {
    this.mSortOption = (this.mSortOption + 1) % 4;
    this.onSortChanged();
  }

  onSortChanged() {
    if (this.mSortOption == this.OPTION_VALUE_INCREASE) {
      this.sortByValueIncrease(this.lotos);
      //  this.showToast("Sắp xếp Loto tăng dần", 2000);
    } else if (this.mSortOption == this.OPTION_VALUE_DECREASE) {
      this.sortByValueDecrease(this.lotos);
      //    this.showToast("Sắp xếp Loto giảm dần", 2000);
    } else if (this.mSortOption == this.OPTION_COUNT_INCREASE) {
      this.sortByCountIncrease(this.lotos);
      //    this.showToast("Sắp xếp số lần xuất hiện tăng dần", 2000);
    } else if (this.mSortOption == this.OPTION_COUNT_DECREASE) {
      this.sortByCountDecrease(this.lotos);
      //    this.showToast("Sắp xếp số lần xuất hiện giảm dần", 2000);
    }
  }

  onInputChanged() {
    this.showLoading();
    this.requestDatas();
  }

  requestDatas() {
    this.mLotteryDBCenter.getLotteryHttpService().requestLotoRecentlyByMonths(this.inputs.months).then(
      data => {
        this.onResponseData(data);
      },
      error => {
        this.onRequestFailed(error);
      }
    );
  }

  onResponseData(data) {

    if (data.status == ResponseCode.SUCCESS) {
      this.mLotteryDBCenter.mLotoProvider.onResponseMonth(data);
      this.mLotoDays = [];
      let mDate = new Date();
      let lotoMonth = this.mLotteryDBCenter.mLotoProvider.getLotoMonth(mDate.getMonth(), 2017);
      if (lotoMonth) {
        for (let lotoDay of lotoMonth.days) {
          this.mLotoDays.push(lotoDay);
        }
      }
      this.resetLotos();
      this.mMaxFrequent = 1;
      this.resortingDatas();
      this.redrawCharts();
    }
    this.closeLoading();
  }


  resetLotos() {
    for (let loto of this.lotos) {
      loto.count = 0;

    }
    for (let loto of this.lotos_max) {
      loto.count = 0;

    }
    this.mSortOption = this.OPTION_VALUE_INCREASE;
  }

  resortingDatas() {
    for (let loto of this.lotos) {
      loto.setPercent(loto.count / this.mMaxFrequent);
    }
    this.sortByCountIncrease(this.lotos);
    let index: number = 0;
    while (index < 10 && (this.lotos.length - index) > 0) {
      this.lotos_max[index].cloneFrom(this.lotos[this.lotos.length - index - 1]);
      index++;
    }
    this.sortByValueIncrease(this.lotos_max);
    this.sortByValueIncrease(this.lotos);
  }

  sortByValueIncrease(arr: Array<LotoVip>) {
    let temp: LotoVip = new LotoVip();
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j].value < arr[i].value) {
          temp.cloneFrom(arr[i]);
          arr[i].cloneFrom(arr[j]);
          arr[j].cloneFrom(temp);
        }
      }
    }
  }

  sortByValueDecrease(arr: Array<LotoVip>) {
    let temp: LotoVip = new LotoVip();
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j].value > arr[i].value) {
          temp.cloneFrom(arr[i]);
          arr[i].cloneFrom(arr[j]);
          arr[j].cloneFrom(temp);
        }
      }
    }
  }

  sortByCountIncrease(arr: Array<LotoVip>) {
    let temp: LotoVip = new LotoVip();
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j].count < arr[i].count) {
          temp.cloneFrom(arr[i]);
          arr[i].cloneFrom(arr[j]);
          arr[j].cloneFrom(temp);
        }
      }
    }
  }

  sortByCountDecrease(arr: Array<LotoVip>) {
    let temp: LotoVip = new LotoVip();
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j].count > arr[i].count) {
          temp.cloneFrom(arr[i]);
          arr[i].cloneFrom(arr[j]);
          arr[j].cloneFrom(temp);
        }
      }
    }
  }

  getLoto(loto: number) {
    if (loto >= 0 && loto < this.lotos.length) {
      return this.lotos[loto];
    }
    return null;
  }

  onRequestFailed(error) {
    this.closeLoading();
  }

  mLoading: Loading;
  showLoading() {
    if (this.mLoading == null || this.mLoading == undefined) {
      this.mLoading = this.mLoadingController.create({
        content: "Vui lòng đợi",
        spinner: "ios",
        duration: 2000
      });
      this.mLoading.onDidDismiss(() => {
        this.mLoading = null;
      });
    }
    this.mLoading.present();
  }

  closeLoading() {
    if (this.mLoading) {
      this.mLoading.dismiss();
    }
  }

  drawCharts() {
    let chartCanvas = document.getElementById("mChartCanvas");

    if (chartCanvas) {
      this.mChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
          labels: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"],
          datasets: [
            {
              label: "Số lần loto xuất hiện",
              backgroundColor: "#44b6ae",
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
          ]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          },
          responsive: false,
          legend: {
            display: true,
            position: 'bottom'
          },
          title: {
            padding: 20
          }
        }
      });
    }

  }

  redrawCharts() {
    if (this.mChart) {
      this.mChart.data.labels = [];
      this.mChart.data.datasets[0].data = [];
      for (let lotoNumber of this.lotos_max) {
        this.mChart.data.labels.push(lotoNumber.loto);
        this.mChart.data.datasets[0].data.push(lotoNumber.count);
      }
      this.mChart.update();
    }
  }

  getBackgroundColor(loto) {
    return "rgba(255,0,0," + loto.percent + ")";
  }
  onClickLoto(loto: LotoVip) {
    this.showToast("Loto " + loto.loto + " về " + loto.count + " lần", 2000);
  }
  showToast(message: string, duration: number) {
    let toast = this.mToastController.create({
      message: message, duration: duration, position: "top"
    });
    toast.present();
  }


  onClickLotoRank(loto: LotoVip) { 
  }


  onScroll(event) {
   // let mScrollElement = document.getElementById("mScroll");
   // console.log("event scroll " + mScrollElement.scrollLeft + " | " + mScrollElement.scrollTop);

  }
  onClickFullScreen() {

  }
  onClickLotoInDay(loto: Loto) {
    if (loto.ranks.length == 0) {

    }
  }
}
