import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Loading, LoadingController, Alert, AlertController, ToastController } from 'ionic-angular';
import { LotteryDBCenter, LotoNumber } from "../../../providers/lottery/lottery";
import { ResponseCode } from "../../../providers/app-constant";
import { Utils } from "../../../providers/app-utils";

import { DatePicker } from '@ionic-native/date-picker';
import Chart from "chart.js";

export class LotoPosition {
  i1: number = 0;
  i2: number = 0;
  constructor(i1?: any, i2?: any) {
    this.i1 = i1 || 0;
    this.i2 = i2 || 0;
  }
  toString() {
    return this.i1 + " - " + this.i2;
  }
  toShortString() {
    return this.i1 + "-" + this.i2;
  }
}
export class LotoNumberSoicau extends LotoNumber {
  positions: Array<LotoPosition> = [];
  onSoicauData(data) {
    this.positions = [];
    for (let posData of data) {
      let ltPos = new LotoPosition();
      ltPos.i1 = posData.i1;
      ltPos.i2 = posData.i2;
      this.positions.push(ltPos);
    }
  }
  cloneFromSoicau(other: LotoNumberSoicau) {
    this.cloneFrom(other);
    this.positions = other.positions;
  }
}
export class LotoNumbers {
  sort_type: number = 0;
  type: number = 0;
  lotos: Array<LotoNumberSoicau> = [];

  clearSort() {
    this.sort_type = -1;
    this.nextSort();
  }
  nextSort() {
    let tmp: LotoNumberSoicau = new LotoNumberSoicau();
    this.sort_type++;
    if (Math.floor(this.sort_type % 3) == 0) {
      //* sort by loto
      for (let i = 0; i < this.lotos.length - 1; i++) {
        for (let j = i + 1; j < this.lotos.length; j++) {
          if (this.lotos[i].value > this.lotos[j].value) {
            tmp.cloneFromSoicau(this.lotos[i]);
            this.lotos[i].cloneFromSoicau(this.lotos[j]);
            this.lotos[j].cloneFromSoicau(tmp);
          }
        }
      }
    }
    if (Math.floor(this.sort_type % 3) == 1) {
      //* sort decrease frequently
      for (let i = 0; i < this.lotos.length - 1; i++) {
        for (let j = i + 1; j < this.lotos.length; j++) {
          if (this.lotos[i].positions.length < this.lotos[j].positions.length) {
            tmp.cloneFromSoicau(this.lotos[i]);
            this.lotos[i].cloneFromSoicau(this.lotos[j]);
            this.lotos[j].cloneFromSoicau(tmp);
          }
        }
      }
    }
    if (Math.floor(this.sort_type % 3) == 2) {
      //* sort increase frequently
      for (let i = 0; i < this.lotos.length - 1; i++) {
        for (let j = i + 1; j < this.lotos.length; j++) {
          if (this.lotos[i].positions.length > this.lotos[j].positions.length) {
            tmp.cloneFromSoicau(this.lotos[i]);
            this.lotos[i].cloneFromSoicau(this.lotos[j]);
            this.lotos[j].cloneFromSoicau(tmp);
          }
        }
      }
    }
  }
}
@IonicPage()
@Component({
  selector: 'page-soicau-loto',
  templateUrl: 'soicau-loto.html',
})
export class SoicauLotoPage {
  mEndDate: Date = new Date();
  mMaxDate: Date = new Date();
  inputs = {
    end: "2017-01-01",
    days: 3,
    category: {
      id: 1,
      name: "Truyền thống"
    }
  };
  // lotos: Array<LotoNumberSoicau> = [];
  /**mảng phụ dùng để sort */
  lotos_temp: Array<LotoNumberSoicau> = [];
  /**10 số có cầu dài nhất */
  lotos_max: Array<LotoNumberSoicau> = [];
  /**10 số có cầu ngắn nhất */
  lotos_min: Array<LotoNumberSoicau> = [];
  lotos_categories: Array<LotoNumbers> = [];
  cau_loai = 0;
  cau_hai_nhay = 0;
  title = "Cầu loto";

  mLotoMax: number = 0;

  mChart: any;
  constructor(
    private mToastController: ToastController,
    public mDatePicker: DatePicker,
    public mAlertController: AlertController,
    public mLoadingController: LoadingController,
    public mLotteryDBCenter: LotteryDBCenter,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams) {
    let input = navParams.get('input'); 
    if (input) {
      this.cau_loai = input.cau_loai || 0;
      this.cau_hai_nhay = input.cau_hai_nhay || 0;
      this.title = input.title || "Cầu loto";
    } 

    this.mLotteryDBCenter.getCategories();
    if (this.mLotteryDBCenter.categories.length > 0) {
      this.inputs.category = this.mLotteryDBCenter.categories[0];
    }

    this.mMaxDate.setTime(Utils.getTimeBefore(this.mEndDate, 1));
    this.inputs.end = Utils.getViewDate(this.mEndDate);

    for (let i = 0; i < 10; i++) {
      let lotoNumbers = new LotoNumbers();
      lotoNumbers.type = i;
      this.lotos_categories.push(lotoNumbers);

      {
        let lotoTemp = new LotoNumberSoicau();
        lotoTemp.setValue(i);
        this.lotos_max.push(lotoTemp);
      }
      {
        let lotoTemp = new LotoNumberSoicau();
        lotoTemp.setValue(i);
        this.lotos_min.push(lotoTemp);
      }
    }
    for (let i = 0; i < 100; i++) {
      {
        let lotoNumber = new LotoNumberSoicau();
        lotoNumber.setValue(i);
        this.lotos_categories[Math.floor(i / 10)].lotos.push(lotoNumber);
      }
      {
        let lotoTemp = new LotoNumberSoicau();
        lotoTemp.setValue(i);
        this.lotos_temp.push(lotoTemp);
      }
    }
  }
  mViewEnter: boolean = false;

  ionViewDidEnter() {
    this.mViewEnter = true;
    this.drawCharts();
    this.onInputChanged();
  }
  onClickBack() {
    this.navCtrl.pop();
  }

  onClickLoto(loto: LotoNumberSoicau) {
    if (loto.positions.length == 0) return;
    let message: string = "";
    for (let pos of loto.positions) {
      message += pos.i1 + "-" + pos.i2 + "<br>"
    }
    let alert: Alert = this.mAlertController.create({
      title: "Các vị trí tạo cầu",
      message: message,

      buttons: [
        {
          text: 'Đóng'
        },
        {
          text: 'Xem chi tiết',
          handler: () => {
            let modal = this.modalCtrl.create("SoicauDetailPage", { 'loto': loto, 'inputs': this.inputs, date: this.mEndDate });
            modal.present();
            modal.onDidDismiss((data, role) => {
            });
          }
        }
      ]
    });
    alert.present();

  }

  onClickPickCategory() {
    let alert: Alert = this.mAlertController.create();
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
  onClickPickDay() {
    this.mDatePicker.show({
      date: this.mEndDate,
      mode: 'date',
      maxDate: new Date()
    }).then(
      date => {
        if (date) {
          this.mEndDate = date;
          this.onInputChanged();
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }
  onClickPickNumberDay() {
    let alert: Alert = this.mAlertController.create({
      title: "Số ngày cầu chạy",
      message: "Số ngày cầu chạy tối thiểu là 1, tối đa cho phép là 99",
      inputs: [
        {
          name: 'day',
          type: 'tel',
          placeholder: "Số ngày",
          value: this.inputs.days + ""
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'OK',
          handler: data => {
            let day: number = parseInt(data.day);
            if (day > 99) day = 99;
            if (day < 1) day = 1;
            this.inputs.days = day;
            this.onInputChanged();
          }
        }
      ]
    });
    alert.present();
  }

  onInputChanged() {
    if (!this.mViewEnter) return;
    this.inputs.end = Utils.getViewDate(this.mEndDate);
    let loading: Loading = this.mLoadingController.create({
      duration: 2000,
      content: "Please wait..."
    });
    loading.present();
    this.mLotteryDBCenter.getLotteryHttpService().requestSoiCauLoto(this.inputs.category.id, Utils.getRequestDate(this.mEndDate), this.inputs.days, this.cau_loai, this.cau_hai_nhay).then(
      data => { this.onResponseData(data); loading.dismiss(); },
      error => { this.onRequestFailed(); loading.dismiss(); }
    );
  }
  onResponseData(data) { 
    this.resetDatas();
    if (data.status == ResponseCode.SUCCESS) {
      this.mLotoMax = parseInt(data.ckdn);
      for (let lotoData of data.content) {
        let index: number = parseInt(lotoData.l);
        if (index >= 0 && index < this.lotos_temp.length) {
          this.lotos_temp[index].setValue(index);
          this.lotos_temp[index].onSoicauData(lotoData.v);
          this.lotos_categories[Math.floor(index / 10)].lotos[Math.floor(index % 10)].onSoicauData(lotoData.v);
        }
      }
      this.resortingDatas();
      this.redrawCharts();
      if (data.content.length == 0) {
        this.notifyNoLoto();
      }
    } else {
      this.notifyNoData();
    } 
  }
  resetDatas() {
    this.mLotoMax = 0;
    for (let category of this.lotos_categories) {
      category.sort_type = 0;
      for (let loto of category.lotos) {
        loto.positions = [];
        loto.count = 0;
      }
    }
    for (let loto of this.lotos_temp) {
      loto.positions = [];
      loto.count = 0;
    }
  }
  notifyNoLoto() {
    let alert = this.mAlertController.create({
      title: "Opps",
      message: "Không có cầu Loto nào trong khoảng ngày đã chọn!",
      buttons: ["OK"]
    });
    alert.present();

  }
  notifyNoData() {

    let alert = this.mAlertController.create({
      title: "Opps",
      message: "Không có dữ liệu!",
      buttons: ["OK"]
    });
    alert.present();
    this.mLotoMax = 0;
    for (let category of this.lotos_categories) {
      for (let loto of category.lotos) {
        loto.count = 0;
        loto.positions = [];
      }
    }
    for (let loto of this.lotos_max) {
      loto.count = 0;
      loto.positions = [];
    }
    for (let loto of this.lotos_min) {
      loto.count = 0;
      loto.positions = [];
    }
    this.redrawChartValues();
  }
  onRequestFailed() {
  }

  onClickCategory(lotteryNumber: LotoNumbers) {
    // lotteryNumber.nextSort();



  }

  resortingDatas() {
    let tmp: LotoNumberSoicau = new LotoNumberSoicau();
    for (let i = 0; i < this.lotos_temp.length - 1; i++) {
      for (let j = i + 1; j < this.lotos_temp.length; j++) {
        if (this.lotos_temp[i].positions.length > this.lotos_temp[j].positions.length) {
          tmp.cloneFromSoicau(this.lotos_temp[i]);
          this.lotos_temp[i].cloneFromSoicau(this.lotos_temp[j]);
          this.lotos_temp[j].cloneFromSoicau(tmp);
        }
      }
    }


    if (this.lotos_temp.length > 0) {
      for (let i = 0; i < this.lotos_max.length; i++) {
        this.lotos_max[i].cloneFromSoicau(this.lotos_temp[this.lotos_temp.length - 1 - i]);
      }
      for (let i = 0; i < this.lotos_min.length; i++) {
        if (i < this.lotos_temp.length)
          this.lotos_min[i].cloneFromSoicau(this.lotos_temp[i]);
      }
    }

    for (let i = 0; i < this.lotos_max.length - 1; i++) {
      for (let j = i + 1; j < this.lotos_max.length; j++) {
        if (this.lotos_max[i].value > this.lotos_max[j].value) {
          tmp.cloneFromSoicau(this.lotos_max[i]);
          this.lotos_max[i].cloneFromSoicau(this.lotos_max[j]);
          this.lotos_max[j].cloneFromSoicau(tmp);
        }
      }
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
              label: "Số vị trí tạo cầu",
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
    if (!this.mViewEnter) return;
    if (!this.mChart) return;
    this.redrawChartLabels();
    setTimeout(() => this.redrawChartValues(), 500);
  }
  redrawChartLabels() {
    {
      this.mChart.data.labels = [];
      for (let lotoNumber of this.lotos_max) {
        this.mChart.data.labels.push(lotoNumber.loto);
      }
      this.mChart.update();
    }
  }
  redrawChartValues() {
    {
      this.mChart.data.datasets[0].data = [];
      for (let lotoNumber of this.lotos_max) {
        this.mChart.data.datasets[0].data.push(lotoNumber.positions.length);
      }
      this.mChart.update();
    }
  }

}
