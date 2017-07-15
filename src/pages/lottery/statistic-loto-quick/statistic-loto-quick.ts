import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Modal, LoadingController, AlertController, Loading } from 'ionic-angular';

import { LotteryDBCenter, LotoNumber } from "../../../providers/lottery/lottery";
import { ResponseCode } from "../../../providers/app-constant";
import { Utils } from "../../../providers/app-utils";

import { DatePicker } from '@ionic-native/date-picker';
import Chart from "chart.js";

@IonicPage()
@Component({
  selector: 'page-statistic-loto-quick',
  templateUrl: 'statistic-loto-quick.html',
})
export class StatisticLotoQuickPage {
  FILTER_TIME: number = 0;
  FILTER_QUICK: number = 1;
  lotos: Array<LotoNumber> = [];
  lotos_top: Array<LotoNumber> = [];
  datas = {
    start: "2017-05-01",
    end: "2017-05-01",
    lotos: "00 01 02 03 04 05 06 07 08 09",
    category: {
      id: 1,
      name: "Truyền thống"
    },
    weeks: 1,
    filter: this.FILTER_QUICK
  };
  times: Array<number> = [1, 2, 3, 4, 8, 12, 16];
  startDate: Date = new Date();
  endDate: Date = new Date();
  mChart: any;
  constructor(private mDatePicker: DatePicker, public mAlertController: AlertController, public mLoadingController: LoadingController, public mLotteryDBCenter: LotteryDBCenter, public mModalController: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    this.startDate.setTime(Utils.getTimeBefore(this.endDate, this.datas.weeks * 7));
    for (let i = 0; i < 10; i++) {
      let loto = new LotoNumber();
      loto.setValue(i);
      this.lotos.push(loto);
    }
    this.mLotteryDBCenter.getCategories();
    if (this.mLotteryDBCenter.categories.length > 0) {
      this.datas.category = this.mLotteryDBCenter.categories[0];
    }

  }
  mViewEnter: boolean = false;
  ionViewDidEnter() {
    this.drawChart();
    this.mViewEnter = true;
    this.onInputChanged();

  }
  onClickFilter() {
    if (this.datas.filter == this.FILTER_QUICK) this.datas.filter = this.FILTER_TIME;
    else if (this.datas.filter == this.FILTER_TIME) this.datas.filter = this.FILTER_QUICK;

  }
  onClickStartDate() {
    this.mDatePicker.show({
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
    this.mDatePicker.show({
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

  onClickPickWeeks() {

    let alert = this.mAlertController.create();
    alert.setTitle("Chọn thời gian thống kê");
    for (let i = 0; i < this.times.length; i++) {

      alert.addInput({
        type: 'radio',
        label: "" + this.times[i] + " tuần trước",
        value: "" + this.times[i],
        checked: this.times[i] == this.datas.weeks
      });

    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let value: number = parseInt(data);
          if (value != this.datas.weeks) {
            this.datas.weeks = value;
            this.startDate.setTime(Utils.getTimeBefore(this.endDate, this.datas.weeks * 7));
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
        checked: category.id == this.datas.category.id
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
              this.datas.category = category;
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
    let lts: string = "";
    this.datas.lotos = "";
    for (let i = 0; i < this.lotos.length; i++) {
      this.datas.lotos += this.lotos[i].loto + ((i < this.lotos.length - 1) ? " " : "");
      lts += this.lotos[i].loto + ((i < this.lotos.length - 1) ? "," : "");
    }

    if (this.lotos.length == 0) {
      let alert = this.mAlertController.create({
        title: "Opps !",
        subTitle: "Vui lòng chọn bộ số",
        buttons: ["OK"]
      });
      alert.present();
      return;
    }

    this.datas.start = Utils.getViewDate(this.startDate);
    this.datas.end = Utils.getViewDate(this.endDate);

    let loading: Loading = this.mLoadingController.create({
      duration: 2000,
      content: "Please wait..."
    });
    loading.present();
    this.mLotteryDBCenter.getLotteryHttpService().requestAnalyticsLotoQuick(this.datas.category.id, Utils.getRequestDate(this.startDate), Utils.getRequestDate(this.endDate), lts).then(
      data => {
        this.onResponseLotos(data);
        loading.dismiss();
      },
      error => {
        loading.dismiss();
      }
    );
  }
  onResponseLotos(data) {
    if (data.status == ResponseCode.SUCCESS) {
      for (let loto of this.lotos) {
        loto.setDefaultTime();
        loto.count = 0;
      }
      this.lotos_top = [];
      for (let lotoNumberData of data.content) {
        let lotoValue = parseInt(lotoNumberData.l);

        let lotoNumber = this.getLotoNumber(lotoValue);
        if (lotoNumber) {
          lotoNumber.onResponse(lotoNumberData);
        }
        if (this.lotos_top.length < 10) {
          let lotoN = new LotoNumber();
          lotoN.onResponse(lotoNumberData);
          this.lotos_top.push(lotoN);
        }
      }
      this.resortingDatas();
      this.redrawChart();
    }
  }
  getLotoNumber(lotovalue: number) {
    for (let loto of this.lotos) {
      if (loto.value == lotovalue) return loto;
    }
    return null;
  }
  onClickBack() {
    this.navCtrl.pop();
  }

  drawChart() {
    let chartCanvas = document.getElementById("mChartCanvas");

    if (chartCanvas == undefined) return;

    this.mChart = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"],
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
            display: true,
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
    if (!this.mViewEnter) return;
    this.mChart.data.labels = [];
    this.mChart.data.datasets[0].data = [];
    for (let lotoNumber of this.lotos_top) {
      if (this.mChart.data.labels.length < 10) {
        this.mChart.data.labels.push(lotoNumber.loto);
        this.mChart.data.datasets[0].data.push(lotoNumber.count);
      }
    }
    this.mChart.update();
  }
  onClickLotos() {
    let modal: Modal = this.mModalController.create("ModalLotoNumberPage", {
      lotos: this.lotos
    });
    modal.present();
    modal.onDidDismiss((data, role) => {
      if (!data.cancel) {
        this.lotos = [];
        for (let lotoData of data.lotos) {
          let loto = new LotoNumber();
          loto.setValue(lotoData.value);
          this.lotos.push(loto);
        }
        this.onInputChanged();
      }
    });
  }

  resortingDatas() {

    let temp: LotoNumber = new LotoNumber();
    for (let i = 0; i < this.lotos.length - 1; i++) {
      for (let j = i + 1; j < this.lotos.length; j++) {
        if (this.lotos[j].value < this.lotos[i].value) {
          temp.cloneFrom(this.lotos[i]);
          this.lotos[i].cloneFrom(this.lotos[j]);
          this.lotos[j].cloneFrom(temp);
        }
      }
    }
    temp = new LotoNumber();
    for (let i = 0; i < this.lotos_top.length - 1; i++) {
      for (let j = i + 1; j < this.lotos_top.length; j++) {
        if (this.lotos_top[j].value < this.lotos_top[i].value) {
          temp.cloneFrom(this.lotos_top[i]);
          this.lotos_top[i].cloneFrom(this.lotos_top[j]);
          this.lotos_top[j].cloneFrom(temp);
        }
      }
    }
  }
}
