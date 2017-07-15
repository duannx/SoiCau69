import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';

import { LotteryDBCenter } from "../../../providers/lottery/lottery";
import { Utils } from "../../../providers/app-utils";
import { ResponseCode } from "../../../providers/app-constant";

import { DatePicker } from '@ionic-native/date-picker';


class LoGan {
  loto: string;
  value: number;
  gan: number;
  maxgan: number;
  time: string;
  constructor() {
    this.loto = "00";
    this.value = 0;
    this.gan = 0;
    this.maxgan = 0;
    this.time = "";
  }
  setValue(value: number) {
    this.value = value;
    this.loto = (value < 10 ? "0" : "") + value;
  }
  reset() {
    this.maxgan = 0;
    this.gan = 0;
  }
}
class LoGans {
  category: number = 0;
  lotos: Array<LoGan> = [];
}


@IonicPage()
@Component({
  selector: 'page-statistic-loto-gan',
  templateUrl: 'statistic-loto-gan.html',
})
export class StatisticLotoGanPage {
  logans: Array<LoGan> = [];
  categories: Array<LoGans> = [];
  mDateStart: Date = new Date();
  mDateEnd: Date = new Date();
  inputs = {
    start: "2017-01-01",
    end: "2017-01-01",
    category: {
      id: 1,
      name: "Truyền thống"
    },
    gan: 10
  };
  constructor(public mDatePicker: DatePicker, public mLotteryDBCenter: LotteryDBCenter, public mAlertController: AlertController, public navCtrl: NavController, public navParams: NavParams, public mLoadingController: LoadingController) {
    this.mLotteryDBCenter.getCategories();
    if (this.mLotteryDBCenter.categories.length > 0) {
      this.inputs.category = this.mLotteryDBCenter.categories[0];
    }
    this.mDateStart.setTime(Utils.getTimeBefore(this.mDateEnd, 30));
    this.inputs.start = Utils.getViewDate(this.mDateStart);
    this.inputs.end = Utils.getViewDate(this.mDateEnd);
  }

  onClickBack() {
    this.navCtrl.pop();
  }


  ionViewDidEnter() {
    this.createDatas();
  }
  createDatas() {

    for (let i = 0; i < 10; i++) {
      let logans = new LoGans();
      logans.category = i;
      for (let j = 0; j < 10; j++) {
        let index = i * 10 + j;
        let logan = new LoGan();
        logan.setValue(index);
        logans.lotos.push(logan);
      }
      this.categories.push(logans);
    }
    this.onInputChanged();
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

  onClickPickStartDay() {
    this.mDatePicker.show({
      date: this.mDateStart,
      mode: 'date',
      maxDate: this.mDateEnd
    }).then(
      date => {
        if (date) {
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
          this.mDateEnd = date;
          this.onInputChanged();
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }

  onClickGan() {

    let alert = this.mAlertController.create();
    alert.setTitle("Chọn biên độ");
    for (let i = 1; i <= 40; i++) {

      alert.addInput({
        type: 'radio',
        label: "" + i,
        value: "" + i,
        checked: i == this.inputs.gan
      });

    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let value: number = parseInt(data);
          if (value != this.inputs.gan) {
            this.inputs.gan = value;
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
    for (let logans of this.categories) {
      for (let logan of logans.lotos) {
        logan.reset();
      }
    }

    this.showLoading();
    this.requestMaxGan();
  }
  requestMaxGan() {
    this.mLotteryDBCenter.getLotteryHttpService().requestLotteryLomaxgan(this.inputs.category.id, Utils.getRequestDate(this.mDateStart), Utils.getRequestDate(this.mDateEnd)).then(
      data => {
        this.onResponseMaxGan(data);
      },
      error => {
        this.closeLoading();
      }
    );
  }
  onResponseMaxGan(data) {
    for (let loganData of data.content) {
      let code = parseInt(loganData.code);
      let logan = this.getLogan(code);
      if (logan) {
        logan.maxgan = loganData.amount;
      }
    }
    this.requestGan();
  }
  getLogan(loto: number): LoGan {
    let categoryID = Math.floor(loto / 10);
    let loganIndex = Math.floor(loto % 10);
    if (categoryID >= 0 && categoryID < this.categories.length) {
      if (loganIndex >= 0 && loganIndex < this.categories[categoryID].lotos.length) {
        return this.categories[categoryID].lotos[loganIndex];
      }
    }
    return null;

  }

  requestGan() {
    this.mLotteryDBCenter.getLotteryHttpService().requestLotteryLogan(this.inputs.category.id, Utils.getRequestDate(this.mDateStart), Utils.getRequestDate(this.mDateEnd), this.inputs.gan).then(
      data => {
        this.onResponseGan(data);
        this.closeLoading();
      },
      error => {
        this.closeLoading();
      }
    );
  }
  onResponseGan(data) {
    this.logans = [];
    if (data.status == ResponseCode.SUCCESS) {
      for (let loganData of data.content) {
        let code = parseInt(loganData.code);
        let logan = this.getLogan(code);
        if (logan) {
          logan.gan = loganData.amout;
          logan.time = loganData.time;
        }

        let lg = new LoGan();
        lg.setValue(code);
        lg.gan = loganData.amount;
        lg.time = loganData.time;
        lg.maxgan = logan.maxgan;
        this.logans.push(lg);
      }
    }
  }


  mLoading: Loading;
  showLoading() {
    if (this.mLoading == null || this.mLoading == undefined) {
      this.mLoading = this.mLoadingController.create({
        content: "Vui lòng đợi",
        spinner: "ios",
        duration: 3000
      });

      this.mLoading.onDidDismiss(() => {
        this.mLoading = null;
      });
    }
    if (this.mLoading) this.mLoading.present();
  }
  closeLoading() {
    if (this.mLoading) {
      this.mLoading.dismiss();
    } else {
      this.mLoading = null;
    }
  }
}
