import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';

import { LotteryDBCenter, LotoNumber } from "../../../providers/lottery/lottery";
import { ResponseCode } from "../../../providers/app-constant";

import Chart from "chart.js";

export class Day {
  id: number;
  name: string;
}
@IonicPage()
@Component({
  selector: 'page-statistic-loto-day',
  templateUrl: 'statistic-loto-day.html',
})
export class StatisticLotoDayPage {
  FILTER_TIME: number = 0;
  FILTER_QUICK: number = 1;
  inputs = {
    day: {
      id: 2,
      name: "Thứ 2"
    },
    category: {
      id: 1,
      name: "Truyền thống"
    },
    weeks: 4,
    filter: this.FILTER_QUICK
  };
  days: Array<Day> = [
    { id: 2, name: "Thứ 2" },
    { id: 3, name: "Thứ 3" },
    { id: 4, name: "Thứ 4" },
    { id: 5, name: "Thứ 5" },
    { id: 6, name: "Thứ 6" },
    { id: 7, name: "Thứ 7" },
    { id: 8, name: "Chủ nhật" }
  ];
  weeks: Array<number> = [4, 8, 12, 24, 36, 48, 60, 66, 72, 80];
  mDate: Date = new Date();
  lotos_max: Array<LotoNumber> = [];
  lotos_min: Array<LotoNumber> = [];
  lotos: Array<LotoNumber> = [];
  lotos_tmps: Array<LotoNumber> = [];
  mChart1: any;
  mChart2: any;
  constructor(
    public mAlertController: AlertController,
    public mLotteryDBCenter: LotteryDBCenter,
    public navCtrl: NavController,
    public navParams: NavParams,
    public mLoadingController: LoadingController) {
    this.mLotteryDBCenter.getCategories();
    if (this.mLotteryDBCenter.categories.length > 0) this.inputs.category = this.mLotteryDBCenter.categories[0];
    this.inputs.day = this.days[0];
    this.inputs.weeks = this.weeks[0];

  }
  mViewEnter: boolean = false;
  ionViewDidEnter() {
    this.mViewEnter = true;
    this.createDatas();
    this.drawCharts();
    this.onInputChanged();
  }
  createDatas() {
    for (let i = 0; i < 100; i++) {
      let lotoNumber = new LotoNumber();
      lotoNumber.setValue(i);
      this.lotos.push(lotoNumber);
    }
    for (let i = 0; i < 100; i++) {
      let lotoNumber = new LotoNumber();
      lotoNumber.setValue(i);
      this.lotos_tmps.push(lotoNumber);
    }
    while (this.lotos_max.length < 10) {
      this.lotos_max.push(new LotoNumber());
      this.lotos_min.push(new LotoNumber());
    }
  }
  onClickBack() {
    this.navCtrl.pop();
  }
  onClickFilter() {
    if (this.inputs.filter == this.FILTER_QUICK) this.inputs.filter = this.FILTER_TIME;
    else if (this.inputs.filter == this.FILTER_TIME) this.inputs.filter = this.FILTER_QUICK;
  }
  onClickPickWeeks() {

    let alert = this.mAlertController.create();
    alert.setTitle("Chọn thời gian thống kê");
    for (let i = 0; i < this.weeks.length; i++) {

      alert.addInput({
        type: 'radio',
        label: "" + this.weeks[i] + " tuần trước",
        value: "" + this.weeks[i],
        checked: this.weeks[i] == this.inputs.weeks
      });

    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let value: number = parseInt(data);
          if (value != this.inputs.weeks) {
            this.inputs.weeks = value;
            this.onInputChanged();
          }
        }
      }
    });
    alert.present();

  }

  onClickPickDay() {

    let alert = this.mAlertController.create();
    alert.setTitle("Chọn thời gian thống kê");
    for (let i = 0; i < this.days.length; i++) {

      alert.addInput({
        type: 'radio',
        label: "" + this.days[i].name,
        value: "" + this.days[i].id,
        checked: this.days[i].id == this.inputs.day.id
      });

    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let id: number = parseInt(data);
          if (id != this.inputs.day.id) {
            for (let day of this.days) {
              if (day.id == id) {
                this.inputs.day = day;
              }
            }
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

  onInputChanged() {
    if (!this.mViewEnter) return;
    let loading: Loading = this.mLoadingController.create({
      duration: 2000,
      content: "Please wait..."
    });
    loading.present();
    this.mLotteryDBCenter.getLotteryHttpService().requestAnalyticsLotoByDay(this.inputs.category.id, this.inputs.day.id, this.inputs.weeks).then(
      data => {
        this.onResponseLotos(data);
        loading.dismiss();
      },
      error => {
        loading.dismiss();
      }
    );
  }
  resetDatas() {
    for (let loto of this.lotos) {
      loto.count = 0;
    }
    for (let loto of this.lotos_tmps) {
      loto.count = 0;
    }
    for (let loto of this.lotos_max) {
      loto.count = 0;
      loto.setValue(0);
    }
    for (let loto of this.lotos_max) {
      loto.count = 0;
      loto.setValue(0);
    }

  }
  onResponseLotos(data) {
    if (data.status == ResponseCode.SUCCESS) {
      this.resetDatas();
      for (let lotoData of data.content) {
        let val: number = parseInt(lotoData.l);
        if (val < 0) val = 0;
        if (val >= this.lotos.length) val = this.lotos.length - 1;
        this.lotos[val].count = lotoData.n;
        this.lotos_tmps[val].count = lotoData.n;
      }
      this.resortingDatas();
      this.redrawCharts();
    }
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
  resortingDatas() {
    this.sortByCountIncrease(this.lotos_tmps);
    let index: number = 0;
    while (index < 10 && index < this.lotos_tmps.length) {
      this.lotos_min[index].cloneFrom(this.lotos_tmps[index]);
      index++;
    }

    index = 0;
    while (index < 10 && (this.lotos_tmps.length - index) > 0) {
      this.lotos_max[index].cloneFrom(this.lotos_tmps[this.lotos_tmps.length - index - 1]);
      index++;
    }

    this.sortByValueIncrease(this.lotos_max);
    this.sortByValueIncrease(this.lotos_min);
  }
  drawCharts() {
    let chartCanvas1 = document.getElementById("mChartCanvas1");
    let chartCanvas2 = document.getElementById("mChartCanvas2");

    if (chartCanvas1) {
      this.mChart1 = new Chart(chartCanvas1, {
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
    if (chartCanvas2) {
      this.mChart2 = new Chart(chartCanvas2, {
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
          }
        }
      });
    }
  }
  redrawCharts() {
    if (!this.mViewEnter) return;
    this.redrawChartLabels();
    setTimeout(() => this.redrawChartValues(), 500);
  }
  redrawChartLabels() {
    if (this.mChart1) {
      this.mChart1.data.labels = [];
      for (let lotoNumber of this.lotos_max) {
        this.mChart1.data.labels.push(lotoNumber.loto);
      }
      this.mChart1.update();
    }
    if (this.mChart2) {
      this.mChart2.data.labels = [];
      for (let lotoNumber of this.lotos_min) {
        this.mChart2.data.labels.push(lotoNumber.loto);
      }
      this.mChart2.update();
    }
  }
  redrawChartValues() {
    if (this.mChart1) {
      this.mChart1.data.datasets[0].data = [];
      for (let lotoNumber of this.lotos_max) {
        this.mChart1.data.datasets[0].data.push(lotoNumber.count);
      }
      this.mChart1.update();
    }
    if (this.mChart2) {
      this.mChart2.data.datasets[0].data = [];
      for (let lotoNumber of this.lotos_min) {
        this.mChart2.data.datasets[0].data.push(lotoNumber.count);
      }
      this.mChart2.update();
    }
  }
}
