import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { LotteryDBCenter, LotoNumber } from "../../../providers/lottery/lottery";
import { Utils } from "../../../providers/app-utils";
import { ResponseCode } from "../../../providers/app-constant";
import { DatePicker } from '@ionic-native/date-picker';
import Chart from "chart.js";

class LotoSum extends LotoNumber {
  sum: number = 0;
  mDate: Date = new Date();
  setValue(val: number) {
    this.value = val;
    this.loto = (val < 10 ? "0" : "") + val;
    let n1: number = Math.floor(val / 10);
    let n2: number = val % 10;
    this.sum = (n1 + n2) % 10;
  }
  reset() {
    this.count = 0;
    this.last_time = "2017-01-01";
  }
  cloneFrom(lotoSum: LotoSum) {
    this.loto = lotoSum.loto;
    this.count = lotoSum.count;
    this.last_time = lotoSum.last_time;
    this.value = lotoSum.value;
    this.sum = lotoSum.sum;
    if (this.mDate && lotoSum.mDate) {
      this.mDate.setTime(lotoSum.mDate.getTime());
    }
  }
  createDate() {
    this.mDate = new Date(this.last_time);
  }
}


@IonicPage()
@Component({
  selector: 'page-statistic-loto-sum',
  templateUrl: 'statistic-loto-sum.html',
})
export class StatisticLotoSumPage {
  FILTER_QUICK: number = 0;
  FILTER_TIME: number = 1;


  inputs = {
    start: "01/04/2017",
    end: "01/05/2017",
    category: {
      id: 0,
      name: "Truyền thống"
    },
    sum: 0,
    weeks: 1,
    filter: this.FILTER_QUICK
  };
  startDate: Date = new Date();
  endDate: Date = new Date();
  sums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  weeks: Array<number> = [1, 2, 3, 4, 8, 12, 16];
  /**Mảng 99 số loto */
  lotos: Array<LotoSum> = [];
  /**Mảng 10 số loto đã lọc them sum */
  fLotos: Array<LotoSum> = [];
  /**Mảng 10 số loto đã sắp xếp*/
  sLotos: Array<LotoSum> = [];
  mChart1: any;
  constructor(
    private mAlertController: AlertController,
    private datePicker: DatePicker,
    public navCtrl: NavController,
    public navParams: NavParams,
    public mLotteryDBCenter: LotteryDBCenter,
    private mLoadingController: LoadingController) {

    for (let i = 0; i < 100; i++) {
      let lotoSum = new LotoSum();
      lotoSum.setValue(i);
      this.lotos.push(lotoSum);
    }
    for (let i = 0; i < 10; i++) {
      this.sLotos.push(new LotoSum());
    }
    this.onSumChanged();
    this.mLotteryDBCenter.getCategories();
    if (this.mLotteryDBCenter.categories.length > 0) {
      this.inputs.category = this.mLotteryDBCenter.categories[0];
    }
    this.startDate.setTime(Utils.getTimeBefore(this.endDate, this.inputs.weeks * 7));
    this.inputs.start = Utils.getViewDate(this.startDate);
    this.inputs.end = Utils.getViewDate(this.endDate);

  }
  mViewEnter: boolean = false;
  mNumberRequestDone: number = 0;
  ionViewDidEnter() {
    this.mViewEnter = true;
    this.onInputChanged();
    this.drawChart();
  }

  onClickBack() { 
    this.navCtrl.pop();
  }
  onClickView() { 
  }
  onClickFilter() {
    if (this.inputs.filter == this.FILTER_QUICK) this.inputs.filter = this.FILTER_TIME;
    else if (this.inputs.filter == this.FILTER_TIME) this.inputs.filter = this.FILTER_QUICK;
  }
  onClickPickSum() {
    let alert = this.mAlertController.create();
    alert.setTitle("Chọn tổng");
    for (let i = 0; i < 10; i++) {
      alert.addInput({
        type: 'radio',
        label: "Tổng " + i,
        value: "" + i,
        checked: i == this.inputs.sum
      });
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let value: number = parseInt(data);
          if (value != this.inputs.sum) {
            this.inputs.sum = value;
            this.onSumChanged();
            this.onInputChanged();
          }
        }
      }
    });
    alert.present();
  }
  resetValues() {
    this.mSortCount = this.NORMAL;
    this.mSortLoto = this.NORMAL;
    this.mSortTime = this.NORMAL;
    for (let loto of this.lotos) {
      loto.reset();
    }
    for (let loto of this.sLotos) {
      loto.reset();
    }
  }
  onSumChanged() {
    this.fLotos = [];
    for (let loto of this.lotos) {
      if (loto.sum == this.inputs.sum) {
        this.fLotos.push(loto);
      }
    }
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
            this.startDate.setTime(Utils.getTimeBefore(this.endDate, this.inputs.weeks * 7));
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

  mRequesting: boolean = false;
  onInputChanged() {
    if (!this.mViewEnter) return;

    this.inputs.start = Utils.getViewDate(this.startDate);
    this.inputs.end = Utils.getViewDate(this.endDate);
    let loading = this.mLoadingController.create({
      duration: 3000,
      content: "Please wait..."
    });
    loading.present();
    this.mRequesting = true;
    this.mLotteryDBCenter.getLotteryHttpService().requestAnalyticsLotoSum(this.inputs.category.id, Utils.getRequestDate(this.startDate), Utils.getRequestDate(this.endDate), this.inputs.sum).then
      (
      data => {
        loading.dismiss();
        this.mRequesting = false;
        this.onResponse(data);
      },
      error => {
        loading.dismiss();
        this.mRequesting = false;
      });
  }
  getLotoSum(loto: number): LotoSum {
    if (loto >= 0 && loto < this.lotos.length) {
      return this.lotos[loto];
    }
    return null;
  }
  onResponse(data) {
    this.resetValues();
    if (data.status == ResponseCode.SUCCESS) {
      for (let lotoNumberData of data.content) {
        let loto = parseInt(lotoNumberData.l);
        let lotoSum = this.getLotoSum(loto);
        if (lotoSum) {
          lotoSum.onResponse(lotoNumberData);
        }
      }
      for (let i = 0; i < this.fLotos.length; i++) {
        if (i < this.sLotos.length) {
          this.sLotos[i].cloneFrom(this.fLotos[i]);
          this.sLotos[i].createDate();
        }
      }
      this.redrawChart();
      this.mNumberRequestDone++;
    }
  }

  onClickStartDate() {
    this.datePicker.show({
      date: this.startDate,
      mode: 'date',
      maxDate: this.endDate
    }).then(
      date => {
        if (date) {
          this.startDate = date;
          this.onInputChanged();
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }
  onClickEndDate() {
    this.datePicker.show({
      date: this.endDate,
      mode: 'date',
      minDate: this.startDate
    }).then(
      date => {
        if (date) {
          this.endDate = date;
          this.onInputChanged();
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }

  drawChart() {
    let chartCanvas = document.getElementById("mChart1");
    if (chartCanvas == undefined) return;
    this.mChart1 = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: ["00", "19", "28", "37", "46", "55", "64", "73", "82", "91"],
        datasets: [
          {
            label: "Số lần xuất hiện",
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
  redrawChart() {
    this.mChart1.data.labels = [];
    this.mChart1.data.datasets[0].data = [];
    for (let lotoNumber of this.fLotos) {
      this.mChart1.data.labels.push(lotoNumber.loto);
      this.mChart1.data.datasets[0].data.push(lotoNumber.count);
    }
    this.mChart1.update();
  }

  /**For sorting */
  SORT_LOTO: number = 0;
  SORT_COUNT: number = 1;
  SORT_TIME: number = 2;

  NORMAL: number = 0;
  UP: number = 1;
  DOWN: number = 2;


  mSortTime: number = 0;
  mSortCount: number = 0;
  mSortLoto: number = 0;
  onClickSortLoto(sortType: number) {
    if (sortType == this.SORT_LOTO) {
      this.mSortCount = this.NORMAL;
      this.mSortTime = this.NORMAL;
      if (this.mSortLoto == this.NORMAL || this.mSortLoto == this.UP) {
        this.mSortLoto = this.DOWN;
      } else {
        this.mSortLoto = this.NORMAL;
      }
      this.sortLotosByValue();
    } else if (sortType == this.SORT_COUNT) {
      if (this.mSortCount == this.NORMAL) this.mSortCount = this.DOWN;
      else if (this.mSortCount == this.DOWN) this.mSortCount = this.UP;
      else if (this.mSortCount == this.UP) this.mSortCount = this.NORMAL;
      this.mSortLoto = this.UP;
      this.mSortTime = this.NORMAL;
      this.sortLotosByCount();
    } else if (sortType == this.SORT_TIME) {
      this.mSortLoto = this.UP;
      this.mSortCount = this.NORMAL;
      if (this.mSortTime == this.NORMAL) this.mSortTime = this.DOWN;
      else if (this.mSortTime == this.DOWN) this.mSortTime = this.UP;
      else if (this.mSortTime == this.UP) this.mSortTime = this.NORMAL;
      this.sortLotosByTime();
    }
  }
  sortLotosByValue() {
    let temp = new LotoSum();
    if (this.mSortLoto == this.NORMAL || this.mSortLoto == this.UP) {
      for (let i = 0; i < this.sLotos.length; i++) {
        for (let j = i + 1; j < this.sLotos.length; j++) {
          if (this.sLotos[i].value > this.sLotos[j].value) {
            temp.cloneFrom(this.sLotos[i]);
            this.sLotos[i].cloneFrom(this.sLotos[j]);
            this.sLotos[j].cloneFrom(temp);
          }
        }
      }
    }
    if (this.mSortLoto == this.DOWN) {
      for (let i = 0; i < this.sLotos.length; i++) {
        for (let j = i + 1; j < this.sLotos.length; j++) {
          if (this.sLotos[i].value < this.sLotos[j].value) {
            temp.cloneFrom(this.sLotos[i]);
            this.sLotos[i].cloneFrom(this.sLotos[j]);
            this.sLotos[j].cloneFrom(temp);
          }
        }
      }
    }
  }
  sortLotosByCount() {
    if (this.mSortCount == this.NORMAL) {
      this.mSortLoto = this.NORMAL;
      this.sortLotosByValue();
    } else if (this.mSortCount == this.UP) {
      let temp = new LotoSum();
      for (let i = 0; i < this.sLotos.length; i++) {
        for (let j = i + 1; j < this.sLotos.length; j++) {
          if (this.sLotos[i].count > this.sLotos[j].count) {
            temp.cloneFrom(this.sLotos[i]);
            this.sLotos[i].cloneFrom(this.sLotos[j]);
            this.sLotos[j].cloneFrom(temp);
          }
        }
      }
    } else if (this.mSortCount == this.DOWN) {
      let temp = new LotoSum();
      for (let i = 0; i < this.sLotos.length; i++) {
        for (let j = i + 1; j < this.sLotos.length; j++) {
          if (this.sLotos[i].count < this.sLotos[j].count) {
            temp.cloneFrom(this.sLotos[i]);
            this.sLotos[i].cloneFrom(this.sLotos[j]);
            this.sLotos[j].cloneFrom(temp);
          }
        }
      }
    }
  }
  sortLotosByTime() {
    if (this.mSortTime == this.NORMAL) {
      this.mSortLoto = this.NORMAL;
      this.sortLotosByValue();
    } else if (this.mSortTime == this.UP) {
      let temp = new LotoSum();
      for (let i = 0; i < this.sLotos.length; i++) {
        for (let j = i + 1; j < this.sLotos.length; j++) {
          if (this.sLotos[i].mDate.getTime() > this.sLotos[j].mDate.getTime()) {
            temp.cloneFrom(this.sLotos[i]);
            this.sLotos[i].cloneFrom(this.sLotos[j]);
            this.sLotos[j].cloneFrom(temp);
          }
        }
      }
    } else if (this.mSortTime == this.DOWN) {
      let temp = new LotoSum();
      for (let i = 0; i < this.sLotos.length; i++) {
        for (let j = i + 1; j < this.sLotos.length; j++) {
          if (this.sLotos[i].mDate.getTime() < this.sLotos[j].mDate.getTime()) {
            temp.cloneFrom(this.sLotos[i]);
            this.sLotos[i].cloneFrom(this.sLotos[j]);
            this.sLotos[j].cloneFrom(temp);
          }
        }
      }
    }
  }
}
