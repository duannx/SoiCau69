import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { LotteryDBCenter } from "../../../providers/lottery/lottery";
import { Utils } from "../../../providers/app-utils";

import { DatePicker } from '@ionic-native/date-picker';

class GuessNumber {
  loto: string;
  value: number;
  count: number;
  percent: number;
  scale: number = 0;
  constructor() {
    this.loto = "00";
    this.count = 0;
    this.value = 0;
    this.percent = 0;
    this.scale = 0;
  }
  setValue(value: number) {
    this.value = value;
    this.loto = (value < 10 ? "0" : "") + value;
  }

  cloneFrom(lotoNumber: GuessNumber) {
    this.loto = lotoNumber.loto;
    this.count = lotoNumber.count;
    this.percent = lotoNumber.percent;
    this.value = lotoNumber.value;
    this.scale = 0;
  }
}



@IonicPage()
@Component({
  selector: 'page-lottery-topguess',
  templateUrl: 'lottery-topguess.html',
})
export class LotteryTopGuessPage {
  lotos: Array<GuessNumber> = [];
  lotos_sorted: Array<GuessNumber> = [];
  mDate: Date = new Date();
  inputs = {
    start: "2017-01-01",
    category: {
      id: 1,
      name: "Truyền thống"
    },
    type: {
      name: "Đề",
      id: 0
    }
  };
  types = [
    { name: "Đề", id: 0 },
    { name: "Lô bạch thủ", id: 1 },
    { name: "Lô xiên", id: 2 },
    { name: "Lô xiên 3", id: 3 },
    { name: "Lô xiên 4", id: 4 }

  ];
  constructor(public mDatePicker: DatePicker, public mLotteryDBCenter: LotteryDBCenter, public mAlertController: AlertController, public navCtrl: NavController, public navParams: NavParams, public mLoadingController: LoadingController) {
    this.mLotteryDBCenter.getCategories();
    if (this.mLotteryDBCenter.categories.length > 0) {
      this.inputs.category = this.mLotteryDBCenter.categories[0];
    }
    this.inputs.start = Utils.getViewDate(this.mDate);
    this.inputs.type = this.types[0];
  }

  onClickBack() {
    this.navCtrl.pop();
  }
  sortByValueIncrease(arr: Array<GuessNumber>) {
    let temp: GuessNumber = new GuessNumber();
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
  sortByCountIncrease(arr: Array<GuessNumber>) {
    let temp: GuessNumber = new GuessNumber();
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
  sortByCountDecrease(arr: Array<GuessNumber>) {
    let temp: GuessNumber = new GuessNumber();
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

  ionViewDidEnter() {
    this.createDatas();
  }
  createDatas() {
    for (let i = 0; i < 100; i++) {
      let guessNumber = new GuessNumber();
      guessNumber.setValue(i);
      guessNumber.count = Utils.randInt(0, 100);
      this.lotos.push(guessNumber);
    }

    for (let loto of this.lotos) {
      let guessNumber = new GuessNumber();
      guessNumber.cloneFrom(loto);
      this.lotos_sorted.push(guessNumber);
    }


    this.onInputChanged();
  }
  resortingDatas() {
    this.sortByCountDecrease(this.lotos_sorted);
    let total: number = 0;
    let max: number = 0;
    for (let loto of this.lotos_sorted) {
      // total += loto.count;
      if (loto.count > total) {
        total = loto.count;
      }
    }
    for (let loto of this.lotos_sorted) {
      loto.scale = loto.count / total;
      loto.percent = Math.floor(100 * loto.scale);
    }
  }
  getTransform(guessNumber: GuessNumber) {
    return "scaleX(" + guessNumber.scale + ")";
  }
  getTransition(guessNumber: GuessNumber) {
    return guessNumber.scale + "s";
  }
  onClickMe() {
    for (let guessNumber of this.lotos) {
      guessNumber.count = Utils.randInt(0, 1000);
    }

    for (let i = 0; i < this.lotos.length; i++) {
      this.lotos_sorted[i].cloneFrom(this.lotos[i]);
    }
    this.resortingDatas();
  }
  resets() {
    for (let guessNumber of this.lotos_sorted) {
      guessNumber.scale = 0;
      guessNumber.count = 0;
    }


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

  onClickPickDay() {
    this.mDatePicker.show({
      date: this.mDate,
      mode: 'date',
      maxDate: new Date()
    }).then(
      date => {
        if (date) {
          this.mDate = date;
          this.onInputChanged();
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }

  onClickPlayType() {

    let alert = this.mAlertController.create();
    alert.setTitle("Chọn loại chơi");
    let index = 0;
    for (let type of this.types) {
      alert.addInput({
        type: 'radio',
        label: type.name,
        value: type.id + '',
        checked: type.id == this.inputs.type.id
      });
      index++;
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let id: number = parseInt(data);
          for (let type of this.types) {
            if (type.id == id) {
              this.inputs.type = type;
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
    this.resets();
    let loading = this.mLoadingController.create({
      duration: 1000,
      content: "Please wait..."
    });
    loading.present();
    loading.onDidDismiss(() => {
      this.onClickMe();
    });
  }
}
