import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, ToastController } from 'ionic-angular';


import { LotteryDBCenter, LotoNumber } from "../../../providers/lottery/lottery";
import { Utils } from "../../../providers/app-utils";
import { ResponseCode } from "../../../providers/app-constant";

import { DatePicker } from '@ionic-native/date-picker';

import Chart from "chart.js";


class Loto extends LotoNumber {
  percent: number = 0;
  special: boolean = false;
  setPercent(val) {
    this.percent = val;
  }
  setSpecial(special: boolean) {
    this.special = special;
  }
  cloneFrom(loto: Loto) {
    this.loto = loto.loto;
    this.count = loto.count;
    this.last_time = loto.last_time;
    this.value = loto.value;
    this.percent = loto.percent;
    this.special = loto.special;
  }
  /**
   * > 0 : lớn hơn số cần so sánh
   * < 0 : bé hơn số cần so sánh
   * = 0 : bằng số cần so sánh
   * @param other số cần so sánh.
   */
  compareCountIncrease(other: Loto): number {
    if (this.count != other.count) return (this.count - other.count);
    else return (this.value - other.value);
  }
  compareCountDecrease(other: Loto): number {
    if (this.count != other.count) return (this.count - other.count);
    else return (other.value - this.value);
  }
}

class LotoCategory {
  category: number;
  lotos: Array<Loto> = [];
}

@IonicPage()
@Component({
  selector: 'page-statistic-loto',
  templateUrl: 'statistic-loto.html',
})
export class StatisticLotoPage {
  OPTION_VALUE_INCREASE: number = 0;
  OPTION_VALUE_DECREASE: number = 1;
  OPTION_COUNT_INCREASE: number = 2;
  OPTION_COUNT_DECREASE: number = 3;

  lotos_max: Array<Loto> = [];
  lotos: Array<Loto> = [];
  lotoResult: Array<Loto> = [];

  mChart: any;

  inputs = {
    mDateStr: "2017-01-01",
    mDate: new Date(),
    category: {
      id: 1,
      name: "Truyền thống"
    },

    count: 10,
    months: 1
  };

  filters: Array<number> = [5, 10, 15, 20, 30, 40, 50, 60, 90, 120, 180, 360];

  months: Array<number> = [1, 2, 6, 12];

  mMaxFrequent: number = 0;

  mSortOption = this.OPTION_VALUE_INCREASE;

  categories: Array<LotoCategory> = [];
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

    this.inputs.mDate.setTime(Utils.getTimeBefore(this.inputs.mDate, 1));
    this.inputs.mDateStr = Utils.getViewDate(this.inputs.mDate);
  }

  ionViewDidEnter() {
    this.createDatas();
    this.drawCharts();
    this.onInputChanged();
  }

  createDatas() {
    for (let i = 0; i < 10; i++) {
      let lotocategory = new LotoCategory();
      lotocategory.category = i;
      for (let j = 0; j < 10; j++) {
        let index = i * 10 + j;
        let loto = new Loto();
        loto.setValue(index);
        lotocategory.lotos.push(loto);
      }
      this.categories.push(lotocategory);
    }


    for (let i = 0; i < 100; i++) {
      let loto = new Loto();
      loto.setValue(i);
      this.lotos.push(loto);
    }
    while (this.lotos_max.length < 10) {
      this.lotos_max.push(new Loto());
    }
  }

  onClickBack() {
    this.navCtrl.pop();
  }
  onClickCount() {

    let alert = this.mAlertController.create();
    alert.setTitle("Số lần quay thưởng gần nhất");
    for (let i = 0; i < this.filters.length; i++) {

      alert.addInput({
        type: 'radio',
        label: this.filters[i] + " lần",
        value: "" + this.filters[i],
        checked: this.filters[i] == this.inputs.count
      });

    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let value: number = parseInt(data);
          if (value != this.inputs.count) {
            this.inputs.count = value;
            this.onInputChanged();
          }
        }
      }
    });
    alert.present();
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

  onClickPickEndDay() {
    this.mDatePicker.show({
      date: this.inputs.mDate,
      mode: 'date',
      maxDate: new Date()
    }).then(
      date => {
        if (date) {
          this.inputs.mDate = date;
          this.onInputChanged();
        }
      },
      err => console.log('Error occurred while getting date: ', err));
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
    this.inputs.mDateStr = Utils.getViewDate(this.inputs.mDate);
    this.showLoading();
    this.requestDatas();
  }

  requestDatas() {

    this.mLotteryDBCenter.getLotteryHttpService().requestAnalyticsLotoFrequentlyByCountAndTime(this.inputs.category.id, this.inputs.count, Utils.getRequestDate(this.inputs.mDate)).then(
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
      this.resetLotos();
      this.sortByValueIncrease(this.lotos);
      this.mMaxFrequent = 1;
      for (let lotoData of data.content) {
        let loto: number = parseInt(lotoData.l);
        if (loto >= 0 && loto < this.lotos.length) {
          this.lotos[loto].setValue(loto);
          this.lotos[loto].count = lotoData.n;
          if (this.lotos[loto].count > this.mMaxFrequent) {
            this.mMaxFrequent = this.lotos[loto].count;
          }
        }

        let lotoInCategory = this.getLotoInCategory(loto);
        if (lotoInCategory) {
          lotoInCategory.count = lotoData.n;
        }
      }
      this.resortingDatas();
      this.redrawCharts();
      this.requestLotoResult();
    } else {
      this.closeLoading();
    }

  }
  requestLotoResult() {
    this.mLotteryDBCenter.getLotteryHttpService().requestResultLoto(this.inputs.category.id, Utils.getRequestDate(this.inputs.mDate)).then(
      data => {
        this.onResponseLotoResult(data);
      },
      error => {
        this.closeLoading();
      }
    );
  }

  onResponseLotoResult(data) {
    this.lotoResult = [];
    if (data.status == ResponseCode.SUCCESS) {
      let lottery = data.content[0];
      if (lottery) {
        let lotos = lottery.loto;
        if (lotos) {
          for (let loto of lotos) {
            let code = parseInt(loto.code);
            let found: boolean = false;
            for (let lotoResult of this.lotoResult) {
              if (code == lotoResult.value) {
                lotoResult.count++;
                found = true;
              }
            }
            if (!found) {
              let lt = new Loto();
              lt.setValue(code);
              lt.count = 1;
              this.lotoResult.push(lt);
            }

            for (let lt of this.lotos) {
              if (lt.value == code) {
                lt.setSpecial(true);
              }
            }
          }
          this.sortByValueIncrease(this.lotoResult);
        }
      }
    }
    this.closeLoading();
  }
  resetLotos() {
    for (let category of this.categories) {
      for (let loto of category.lotos) {
        loto.count = 0;
        loto.special = false;
      }
    }

    for (let loto of this.lotos) {
      loto.count = 0;
      loto.special = false;
    }

    for (let loto of this.lotos_max) {
      loto.count = 0;
      loto.special = false;
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

  sortByValueIncrease(arr: Array<Loto>) {
    let temp: Loto = new Loto();
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

  sortByValueDecrease(arr: Array<Loto>) {
    let temp: Loto = new Loto();
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

  sortByCountIncrease(arr: Array<Loto>) {
    let temp: Loto = new Loto();
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i].compareCountIncrease(arr[j]) > 0) {
          temp.cloneFrom(arr[i]);
          arr[i].cloneFrom(arr[j]);
          arr[j].cloneFrom(temp);
        }
      }
    }
  }

  sortByCountDecrease(arr: Array<Loto>) {
    let temp: Loto = new Loto();
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i].compareCountDecrease(arr[j]) < 0) {
          temp.cloneFrom(arr[i]);
          arr[i].cloneFrom(arr[j]);
          arr[j].cloneFrom(temp);
        }
      }
    }
  }
  getLotoInCategory(loto: number): Loto {
    let cateID = Math.floor(loto / 10);
    let lotoIndex = loto % 10;
    if (cateID >= 0 && cateID < this.categories.length) {
      if (lotoIndex >= 0 && lotoIndex < this.categories[cateID].lotos.length) {
        return this.categories[cateID].lotos[lotoIndex];
      }
    }
    return null;
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
    if (loto.special) return "rgba(255,255,0,.9)";
    return "rgba(255,0,0," + loto.percent + ")";
  }
  onClickLoto(loto: Loto) {
    this.showToast("Loto " + loto.loto + " về " + loto.count + " lần", 2000);
  }
  showToast(message: string, duration: number) {
    let toast = this.mToastController.create({
      message: message, duration: duration, position: "top"
    });
    toast.present();
  }
}
