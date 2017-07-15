import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';


import { LotteryDBCenter, LotoNumber } from "../../../providers/lottery/lottery";
import { Utils } from "../../../providers/app-utils";
import { ResponseCode } from "../../../providers/app-constant";

import { DatePicker } from '@ionic-native/date-picker';

import Chart from "chart.js";

class LotoCategory {
  category: number;
  lotos: Array<LotoNumber> = [];
}

@IonicPage()
@Component({
  selector: 'page-statistic-loto-frequently',
  templateUrl: 'statistic-loto-frequently.html',
})
export class StatisticLotoFrequentlyPage {
  FILTER_TIME: number = 0;
  FILTER_QUICK: number = 1;
  categories: Array<LotoCategory> = [];
  lotos_max: Array<LotoNumber> = [];
  lotos_min: Array<LotoNumber> = [];
  lotos: Array<LotoNumber> = [];

  mChart: any;
  mDateStart: Date = new Date();
  mDateEnd: Date = new Date();
  inputs = {
    start: "2017-01-01",
    end: "2017-01-01",
    category: {
      id: 1,
      name: "Truyền thống"
    },
    count: 10,
    weeks: 1,
    filter: this.FILTER_QUICK
  };
  filters: Array<number> = [5, 10, 15, 20, 30, 40, 50, 60];
  weeks: Array<number> = [1, 2, 3, 4, 8, 12, 16];
  constructor(public mLoadingController: LoadingController, public mAlertController: AlertController, public mDatePicker: DatePicker, public mLotteryDBCenter: LotteryDBCenter, public navCtrl: NavController, public navParams: NavParams) {
    this.mLotteryDBCenter.getCategories();
    if (this.mLotteryDBCenter.categories.length > 0) {
      this.inputs.category = this.mLotteryDBCenter.categories[0];
    }
    this.mDateStart.setTime(Utils.getTimeBefore(this.mDateEnd, this.inputs.count));
    this.inputs.start = Utils.getViewDate(this.mDateStart);
    this.inputs.end = Utils.getViewDate(this.mDateEnd);
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
        let lotoNumber = new LotoNumber();
        lotoNumber.setValue(index);
        lotocategory.lotos.push(lotoNumber);
      }
      this.categories.push(lotocategory);
    }
    for (let i = 0; i < 100; i++) {
      let lotoNumber = new LotoNumber();
      lotoNumber.setValue(i);
      this.lotos.push(lotoNumber);
    }
    while (this.lotos_max.length < 10) {
      this.lotos_max.push(new LotoNumber());
      this.lotos_min.push(new LotoNumber());
    }
  }
  onClickFilter() {
    if (this.inputs.filter == this.FILTER_QUICK) this.inputs.filter = this.FILTER_TIME;
    else if (this.inputs.filter == this.FILTER_TIME) this.inputs.filter = this.FILTER_QUICK;
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
  onClickPickWeeks() {
    let alert = this.mAlertController.create();
    alert.setTitle("Chọn khoảng thời gian");
    let index = 0;
    for (let week of this.weeks) {
      alert.addInput({
        type: 'radio',
        label: week + " tuần trước",
        value: week + '',
        checked: this.inputs.weeks == week
      });
      index++;
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let week: number = parseInt(data);
          if (week != this.inputs.weeks) {
            this.inputs.weeks = week;
            this.mDateStart.setTime(Utils.getTimeBefore(this.mDateEnd, this.inputs.weeks * 7));
            this.onInputChanged();
          }
        }
      }
    });
    alert.present();

  }

  onClickPickStartDay() {
    this.mDatePicker.show({
      date: this.mDateStart,
      mode: 'date',
      maxDate: this.mDateEnd
    }).then(
      date => {
        if (date) {
          this.inputs.filter = this.FILTER_TIME;
          this.mDateStart = date;
          this.onInputChanged();
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }
  onClickPickEndDay() {
    this.mDatePicker.show({
      date: this.mDateEnd,
      mode: 'date',
      minDate: this.mDateStart
    }).then(
      date => {
        if (date) {
          this.inputs.filter = this.FILTER_TIME;
          this.mDateEnd = date;
          this.onInputChanged();
        }
      },
      err => console.log('Error occurred while getting date: ', err));
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
  onInputChanged() {
    this.inputs.start = Utils.getViewDate(this.mDateStart);
    this.inputs.end = Utils.getViewDate(this.mDateEnd);
    this.showLoading();
    this.requestDatas();
  }
  requestDatas() {

    if (this.inputs.filter == this.FILTER_QUICK) {
      this.mLotteryDBCenter.getLotteryHttpService().requestAnalyticsLotoFrequentlyCount(this.inputs.category.id, this.inputs.count).then(
        data => {
          this.onResponseData(data);
        },
        error => {
          this.onRequestFailed(error);
        }
      );
    } else if (this.inputs.filter == this.FILTER_TIME) {
      this.mLotteryDBCenter.getLotteryHttpService().requestAnalyticsLotoFrequentlyTime(this.inputs.category.id, Utils.getRequestDate(this.mDateStart), Utils.getRequestDate(this.mDateEnd)).then(
        data => {
          this.onResponseData(data);
        },
        error => {
          this.onRequestFailed(error);
        }
      );
    }
  }
  onResponseData(data) {

    if (data.status == ResponseCode.SUCCESS) {
      this.resetLotos();
      for (let lotoData of data.content) {
        let loto: number = parseInt(lotoData.l);
        let lotoNumber = this.getLotoNumber(loto);
        if (lotoNumber) {
          lotoNumber.count = lotoData.n;
        }
        if (loto >= 0 && loto < this.lotos.length) {
          this.lotos[loto].setValue(loto);
          this.lotos[loto].count = lotoData.n;
        }
      }
      this.resortingDatas();
      this.redrawCharts();
    }
    this.closeLoading();
  }
  resetLotos() {
    for (let category of this.categories) {
      for (let loto of category.lotos) {
        loto.count = 0;
      }
    }
  }
  resortingDatas() {
    this.sortByCountIncrease(this.lotos);
    let index: number = 0;
    while (index < 10 && index < this.lotos.length) {
      this.lotos_min[index].cloneFrom(this.lotos[index]);
      index++;
    }

    index = 0;
    while (index < 10 && (this.lotos.length - index) > 0) {
      this.lotos_max[index].cloneFrom(this.lotos[this.lotos.length - index - 1]);
      index++;
    }

    this.sortByValueIncrease(this.lotos_max);
    this.sortByValueIncrease(this.lotos_min);
  }
  sortByValueIncrease(arr: Array<LotoNumber>) {
    let temp: LotoNumber = new LotoNumber();
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
  sortByCountIncrease(arr: Array<LotoNumber>) {
    let temp: LotoNumber = new LotoNumber();
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
  getLotoNumber(loto: number) {
    let cateID = Math.floor(loto / 10);
    let lotoIndex = loto % 10;
    if (cateID >= 0 && cateID < this.categories.length) {
      if (lotoIndex >= 0 && lotoIndex < this.categories[cateID].lotos.length) {
        return this.categories[cateID].lotos[lotoIndex];
      }
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
              label: "Số lượng loto xuất hiện",
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

}
