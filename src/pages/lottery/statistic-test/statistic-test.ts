import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, ToastController } from 'ionic-angular';


import { LotteryDBCenter, LotoNumber } from "../../../providers/lottery/lottery";
import { Utils } from "../../../providers/app-utils";
import { ResponseCode } from "../../../providers/app-constant";

import { DatePicker } from '@ionic-native/date-picker';

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
  selector: 'page-statistic-test',
  templateUrl: 'statistic-test.html',
})
export class StatisticTestPage {
  OPTION_VALUE_INCREASE: number = 0;
  OPTION_VALUE_DECREASE: number = 1;
  OPTION_COUNT_INCREASE: number = 2;
  OPTION_COUNT_DECREASE: number = 3;

  lotos: Array<Loto> = [];
  lotos_filter: Array<Loto> = [];
  lotoResult: Array<Loto> = [];

  mChart: any;

  inputs = {
    mDateStr: "2017-01-01",
    mDate: new Date(),
    category: {
      id: 1,
      name: "Truyền thống"
    },
    lotos: "",
    count: 10,
    months: 1
  };

  filters: Array<number> = [5, 10, 15, 20, 30, 40, 50, 60, 90, 120, 180, 360];

  months: Array<number> = [1, 2, 6, 12];

  mMaxFrequent: number = 0;

  mSortOption = this.OPTION_VALUE_INCREASE;

  mReloadData: boolean = true;
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
    this.onInputChanged();
    this.onViewEnter();
  }

  createDatas() {

    for (let i = 0; i < 100; i++) {
      let loto = new Loto();
      loto.setValue(i);
      this.lotos.push(loto);
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

  // Events 
  onLotosChanged(event) {
    let count = 0;
    let temp: string = "";
    for (let i = 0; i < this.inputs.lotos.length; i++) {
      let ch = this.inputs.lotos.charAt(i);
      if (Utils.isNumber(ch)) {
        temp += ch;
        count++;
        if (count == 2 && (i < this.inputs.lotos.length - 1)) {
          temp += ",";
          count = 0;
        }
      }
    }

    if (temp.length > 2 && !Utils.isNumber(temp.charAt(temp.length - 1))) {
      temp = temp.substring(0, temp.length - 1);
    }
    this.inputs.lotos = temp;
  }
  onClickClearLotos() {
    this.inputs.lotos = "";
  }
  onClickQuickLotos() {
    let alert = this.mAlertController.create();
    alert.setTitle("Chọn nhanh các bộ số");
    alert.addInput({ type: 'radio', label: 'Tất cả', value: '0' });
    alert.addInput({ type: 'radio', label: 'Số chẵn', value: '1' });
    alert.addInput({ type: 'radio', label: 'Số lẻ', value: '2' });
    alert.addInput({ type: 'radio', label: '20 số về nhiều nhất', value: '3' });
    alert.addInput({ type: 'radio', label: '20 số về ít nhất', value: '4' });
    alert.addInput({ type: 'radio', label: '20 số về ở giữa', value: '5' });

    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        this.onQuickSelectData(data);
      }
    });

    alert.present();
  }
  onQuickSelectData(data) {
    if (data == undefined || data == null) return;
    let code = parseInt(data);

    if (code == 0) {
      this.lotos_filter = [];
      this.inputs.lotos = "";
      for (let loto of this.lotos) {
        let lt = new Loto();
        lt.cloneFrom(loto);
        this.lotos_filter.push(lt);
        this.inputs.lotos += loto.loto + ",";
      }
    }
    if (code == 1) {
      this.lotos_filter = [];
      this.inputs.lotos = "";
      for (let loto of this.lotos) {
        if (loto.value % 2 == 0) {
          let lt = new Loto();
          lt.cloneFrom(loto);
          this.lotos_filter.push(lt);
          this.inputs.lotos += loto.loto + ",";
        }
      }
    }
    if (code == 2) {
      this.lotos_filter = [];
      this.inputs.lotos = "";
      for (let loto of this.lotos) {
        if (loto.value % 2 == 1) {
          let lt = new Loto();
          lt.cloneFrom(loto);
          this.lotos_filter.push(lt);
          this.inputs.lotos += lt.loto + ",";
        }
      }
    }
    if (code == 3) {
      this.inputs.lotos = "";
      this.sortByCountIncrease(this.lotos);
      this.lotos_filter = [];
      for (let i = 80; i < this.lotos.length; i++) {
        let lt = new Loto();
        lt.cloneFrom(this.lotos[i]);
        this.lotos_filter.push(lt);
        this.inputs.lotos += lt.loto + ",";
      }
    }

    if (code == 4) {
      this.sortByCountIncrease(this.lotos);
      this.lotos_filter = [];
      this.inputs.lotos = "";
      for (let loto of this.lotos) {
        if (this.lotos_filter.length < 20) {
          let lt = new Loto();
          lt.cloneFrom(loto);
          this.lotos_filter.push(lt);
          this.inputs.lotos += lt.loto + ",";
        } else {
          break;
        }
      }
    }

    if (code == 5) {
      this.inputs.lotos = "";
      this.sortByCountIncrease(this.lotos);
      this.lotos_filter = [];
      for (let i = 40; i < 60; i++) {
        if (i < this.lotos.length) {
          let lt = new Loto();
          lt.cloneFrom(this.lotos[i]);
          this.lotos_filter.push(lt);
          this.inputs.lotos += lt.loto + ",";
        }
      }
    }

  }
  onViewEnter() {
    this.showLoading();
    this.requestDatas();
  }

  onClickViewResult() {
    if (this.inputs.lotos.length == 0) {
      this.showToast("Bạn chưa nhập các bộ số", 2000);
      return;
    }

    if (this.mReloadData) {
      this.mReloadData = false;
      this.showLoading();
      this.requestDatas();
    } else {
      this.doFilterLotos();
    }

  }
  doFilterLotos() {
    this.lotos_filter = [];
    let codes = this.inputs.lotos.split(",");

    for (let code of codes) {
      let lotoValue = parseInt(code);
      if (lotoValue >= 0 && lotoValue < 100) {
        let found = false;
        for (let loto of this.lotos_filter) {
          if (loto.value == lotoValue) {
            found = true;
          }
        }
        if (!found) {
          let lt = new Loto();
          lt.setValue(lotoValue);

          let lotoFromLotos = this.getLotoByValue(lotoValue);
          if (lotoFromLotos) {
            lt.cloneFrom(lotoFromLotos);
          }
          this.lotos_filter.push(lt);
        }
      }
    }
    this.mSortOption = this.OPTION_COUNT_INCREASE;
    this.onSortChanged();
  }

  getLotoByValue(lotoValue: number) {
    for (let loto of this.lotos) {
      if (loto.value == lotoValue) return loto;
    }
    return null;
  }

  onSortChanged() {
    if (this.mSortOption == this.OPTION_VALUE_INCREASE) {
      this.sortByValueIncrease(this.lotos_filter);
      //  this.showToast("Sắp xếp Loto tăng dần", 2000);
    } else if (this.mSortOption == this.OPTION_VALUE_DECREASE) {
      this.sortByValueDecrease(this.lotos_filter);
      //    this.showToast("Sắp xếp Loto giảm dần", 2000);
    } else if (this.mSortOption == this.OPTION_COUNT_INCREASE) {
      this.sortByCountIncrease(this.lotos_filter);
      //    this.showToast("Sắp xếp số lần xuất hiện tăng dần", 2000);
    } else if (this.mSortOption == this.OPTION_COUNT_DECREASE) {
      this.sortByCountDecrease(this.lotos_filter);
      //    this.showToast("Sắp xếp số lần xuất hiện giảm dần", 2000);
    }
  }

  onInputChanged() {
    this.inputs.mDateStr = Utils.getViewDate(this.inputs.mDate);
    this.mReloadData = true;
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
        let lotoValue: number = parseInt(lotoData.l);
        let loto = this.getLotoByValue(lotoValue);
        if (loto) {
          loto.count = lotoData.n;
          if (loto.count > this.mMaxFrequent) {
            this.mMaxFrequent = loto.count;
          }
        }
      }
      this.resortingDatas();
      this.doFilterLotos();
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

            for (let lt of this.lotos_filter) {
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
    for (let loto of this.lotos) {
      loto.count = 0;
      loto.special = false;
    }
    this.mSortOption = this.OPTION_VALUE_INCREASE;
  }

  resortingDatas() {
    for (let loto of this.lotos) {
      loto.setPercent(loto.count / this.mMaxFrequent);
    }
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
