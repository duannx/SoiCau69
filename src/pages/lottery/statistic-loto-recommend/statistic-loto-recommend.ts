import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, ToastController, ModalController, Platform, Content } from 'ionic-angular';


import { LotteryDBCenter, LotoNumber, LotoDay, Loto } from "../../../providers/lottery/lottery";
import { Utils } from "../../../providers/app-utils";
import { AppController } from "../../../providers/app-controller";
import { ResponseCode } from "../../../providers/app-constant";

import { DatePicker } from '@ionic-native/date-picker';
import { Keyboard } from '@ionic-native/keyboard';

class LotoRecommend extends LotoNumber {
  weight: number = 0;

  setWeight(newWeight: number) {
    this.weight = newWeight;
  }
  cloneFrom(loto: LotoRecommend) {
    this.loto = loto.loto;
    this.count = loto.count;
    this.last_time = loto.last_time;
    this.value = loto.value;
    this.weight = loto.weight;
  }
}

@IonicPage()
@Component({
  selector: 'page-statistic-loto-recommend',
  templateUrl: 'statistic-loto-recommend.html',
})
export class StatisticLotoRecommendPage {
  @ViewChild(Content) mContent: Content;
  inputs = {
    mDate: new Date(),
    mDateStr: "2017-01-01",
    lotos: "",
    lotosnguoc: ""
  };
  mResultLotos: Array<LotoRecommend> = [];
  mLotosSystem: Array<LotoRecommend> = [];
  mLotosSystemMin: Array<LotoRecommend> = [];
  mLotosUser: Array<LotoRecommend> = [];
  mLotosNguoc: Array<LotoRecommend> = [];

  constructor(
    private mModalController: ModalController,
    private mToastController: ToastController,
    public mLoadingController: LoadingController,
    public mAlertController: AlertController,
    public mDatePicker: DatePicker,
    public mLotteryDBCenter: LotteryDBCenter,
    public navCtrl: NavController,
    public navParams: NavParams,
    public mPlatform: Platform,
    public mKeyBoard: Keyboard) {
    // this.inputs.mDate.setTime(Utils.getTimeBefore(this.inputs.mDate, 1));
    this.inputs.mDateStr = Utils.getViewDate(this.inputs.mDate);
    this.mPlatform.ready().then(() => {
      this.onPlatformReady();
    });
  }
  onPlatformReady() {
    this.mKeyBoard.disableScroll(true);
    this.mKeyBoard.onKeyboardShow().subscribe(() => {
      this.onKeyBoardShow();
    });
    this.mKeyBoard.onKeyboardHide().subscribe(() => {
      this.onKeyBoardHide();
    });
  }
  ionViewDidEnter() {
    this.createDatas();
    this.onInputChanged();
    this.mLotteryDBCenter.getLotteryHttpService().requestLotoNguocList().then(
      data => {
        this.onResponseLotoNguoc(data);
      },
      error => { }
    );
  }
  onClickInput() {
   // this.onKeyBoardShow();
  }
  onKeyBoardShow() {


    let element = document.getElementById("a1-content");
    if (element) {
      element.style.paddingBottom = "40vh"; 
      setTimeout(() => {
        element.scrollTop = element.scrollHeight;
      }, 400);
    }

  }
  onKeyBoardHide() { 
    let element = document.getElementById("a1-content");
    if (element) {
      element.style.paddingBottom = "0";
    }
  }
  onResponseLotoNguoc(data) {
    if (data.status == ResponseCode.SUCCESS) {
      this.mLotosNguoc = [];
      let codes: string = data.content;
      this.inputs.lotosnguoc = data.content;
      if (codes.length > 0) {
        let lotos = codes.split(",");
        for (let loto of lotos) {
          let lotoRecommend = new LotoRecommend();
          lotoRecommend.setValue(parseInt(loto));
          this.mLotosNguoc.push(lotoRecommend);
        }
      }
    } else {
      AppController.getInstance().doShowToast(data.message, 2000);
    }
  }
  createDatas() {

  }

  requestDatas() {

    let lotos = this.inputs.lotos.split(",");
    let codes: string = "";
    for (let i = 0; i < lotos.length; i++) {
      let loto = lotos[i];
      if (codes.indexOf(loto) == -1) {
        codes += loto;
        codes += ",";
      }
    }
    if (codes.length > 2 && !Utils.isNumber(codes.charAt(codes.length - 1))) {
      codes = codes.substring(0, codes.length - 1);
    }
 
    this.inputs.lotos = codes;

    this.mLotteryDBCenter.getLotteryHttpService().requestLotoWeight(Utils.getRequestDate(this.inputs.mDate), this.inputs.lotos).then(
      data => {
        this.onResponseData(data);
      },
      error => {
        this.onRequestFailed(error);
      }
    );
  }
  onRequestFailed(error) {
    this.closeLoading();
  }

  onResponseData(data) {
    this.mLotosUser = [];
    if (data.status == ResponseCode.SUCCESS) {
      for (let lotoData of data.top_value) {
        let code = parseInt(lotoData.code);
        if (code >= 0 && code <= 99) {
          let lotoRecommend = new LotoRecommend();
          lotoRecommend.setValue(code);
          lotoRecommend.setWeight(lotoData.weight);
          this.mLotosUser.push(lotoRecommend);

          for (let loto of this.mResultLotos) {
            if (loto.value == code) lotoRecommend.count = loto.count;
          }
        }
      }
    } else {
      let message = data.message;
      this.showToast(message, 2000);
    }

    for (let loto of this.mLotosSystemMin) { 
    }
    for (let loto of this.mLotosSystem) { 
    }
    this.closeLoading();
  }

  mLoading: Loading;
  showLoading() {
    if (this.mLoading == null || this.mLoading == undefined) {
      this.mLoading = this.mLoadingController.create({
        content: "Vui lòng đợi",
        spinner: "ios",
        duration: 10000
      });
      this.mLoading.onDidDismiss(() => {
        this.mLoading = null;
      });
      this.mLoading.present();
    }
  }
  closeLoading() {
    if (this.mLoading) {
      this.mLoading.dismiss();
    } else {
      this.mLoading = null;
    }
  }

  showToast(message: string, duration: number) {
    let toast = this.mToastController.create({
      message: message, duration: duration, position: "top"
    });
    toast.present();
  }


  // Touch Events 
  onClickPickDate() {
    this.mDatePicker.show({
      date: this.inputs.mDate,
      mode: 'date',
      maxDate: new Date()
    }).then(
      date => {
        if (date) {
          this.inputs.mDate = date;
          this.mResultLotos = [];
          this.mLotosSystem = [];
          this.mLotosUser = [];
          this.mLotosSystemMin = [];
          this.onInputChanged();
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }

  onClickHelp() {
    let alert = this.mAlertController.create({
      title: "Dự đoán kết quả Loto",
      message: "Người dùng nhập vào những bộ số mà hôm nay kết nhất, hệ thống sẽ đưa ra đánh giá các bộ đó dựa trên các tiêu chí thống kê để đưa ra khả năng về của mỗi con số.",
      buttons: ['Đã hiểu']
    });
    alert.present();
  }
  onClickView() {
    if (this.inputs.lotos.length < 2) {
      this.showToast("Dãy số bạn nhập không đúng", 1000);
      return;
    }
    this.onInputChanged();
  }
  onClickPickLotos() {
    let modal = this.mModalController.create("ModalLotoPage");
    modal.present({
      animate: false
    });
  }
  onClickClearLotos() {
    this.inputs.lotos = "";
  }
  onClickBack() {
    this.navCtrl.pop();
  }

  step: number = 0;
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
  onInputChanged() {
    this.inputs.mDateStr = Utils.getViewDate(this.inputs.mDate);
    this.showLoading();
    if (this.mLotosSystem.length == 0) {
      this.requestLotoSystemRecommend();
    } else {
      this.requestDatas();
    }
  }

  onFilterChanged() {

  }
  // ================== More functions ===========
  requestLotoSystemRecommend() {
    this.mLotteryDBCenter.getLotteryHttpService().requestLotoTopWeight(Utils.getRequestDate(this.inputs.mDate)).then(
      data => {
        this.onResponseSystemTopData(data);
        this.requestLotos();
      },
      response => {

      }
    );
  }

  onResponseSystemTopData(data) {
    this.mLotosSystem = [];
    this.mLotosSystemMin = [];
    if (data.status == ResponseCode.SUCCESS) {
      for (let lotoData of data.top_value) {
        let code = parseInt(lotoData.code);
        let lotoRecommend = new LotoRecommend();
        lotoRecommend.setValue(code);
        lotoRecommend.setWeight(lotoData.weight);
        this.mLotosSystem.push(lotoRecommend);
      }
      for (let lotoData of data.bottom_value) {
        let code = parseInt(lotoData.code);
        let lotoRecommend = new LotoRecommend();
        lotoRecommend.setValue(code);
        lotoRecommend.setWeight(lotoData.weight);
        this.mLotosSystemMin.push(lotoRecommend);
      }
    }

    if (this.inputs.lotos.length > 0) {
      this.requestDatas();
    } else {
      this.closeLoading();
    }
  }
  requestLotos() {
    this.mLotteryDBCenter.getLotteryHttpService().requestResultLotoXSMB(Utils.getRequestDate(this.inputs.mDate)).then(
      data => {
        this.onResponseLotos(data);
      },
      error => {
      }
    );
  }

  sortByValueIncrease(arr: Array<LotoRecommend>) {
    let temp: LotoRecommend = new LotoRecommend();
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

  onResponseLotos(data) {
    this.mResultLotos = [];
    if (data.status == ResponseCode.SUCCESS) {
      let lottery = data.content[0];
      if (lottery) {
        let lotos = lottery.loto;
        if (lotos) {
          for (let loto of lotos) {
            let code = parseInt(loto.code);
            let found: boolean = false;
            for (let lotoResult of this.mResultLotos) {
              if (code == lotoResult.value) {
                lotoResult.count++;
                found = true;
              }
            }
            if (!found) {
              let lotoRecommend = new LotoRecommend();
              lotoRecommend.setValue(code);
              lotoRecommend.count = 1;
              this.mResultLotos.push(lotoRecommend);
            }
          }
        }
      }
    }

    this.sortByValueIncrease(this.mResultLotos);

    for (let result of this.mResultLotos) {
      for (let loto of this.mLotosSystem) {
        if (loto.value == result.value) {
          loto.count = result.count;
        }
      }
      for (let loto of this.mLotosSystemMin) {
        if (loto.value == result.value) loto.count = result.count;
      }

    }

  }



  onLotosNguocChanged(event) {
    let count = 0;
    let temp: string = "";
    for (let i = 0; i < this.inputs.lotosnguoc.length; i++) {
      let ch = this.inputs.lotosnguoc.charAt(i);
      if (Utils.isNumber(ch)) {
        temp += ch;
        count++;
        if (count == 2 && (i < this.inputs.lotosnguoc.length - 1)) {
          temp += ",";
          count = 0;
        }
      }
    }

    if (temp.length > 2 && !Utils.isNumber(temp.charAt(temp.length - 1))) {
      temp = temp.substring(0, temp.length - 1);
    }
    this.inputs.lotosnguoc = temp;
  }
  onClickClearLotosNguoc() {
    this.inputs.lotosnguoc = "";
  }
  private contains(arr: Array<number>, value: number) {
    for (let val of arr) if (val == value) return true;
    return false;
  }
  private getLotoNguoc(value: number): number {
    let v1 = Math.floor(value / 10);
    let v2 = Math.floor(value % 10);
    return v2 * 10 + v1;
  }
  onClickUpdateLotosNguoc() {




    if (this.inputs.lotosnguoc.length == 0) {
      AppController.getInstance().doShowToast("Dãy số không hợp lệ !", 2000);
      return;
    }

    let codes = this.inputs.lotosnguoc.split(",");
    let arrLotos: Array<number> = [];
    for (let code of codes) {
      let codeValue = parseInt(code);
      let c2 = this.getLotoNguoc(codeValue);

      if (!this.contains(arrLotos, codeValue)) {
        arrLotos.push(codeValue);
      }
      if (!this.contains(arrLotos, c2)) {
        arrLotos.push(c2);
      }
    }

    let list = "";
    for (let i = 0; i < arrLotos.length; i++) {
      if (arrLotos[i] < 10) list += "0";
      list += arrLotos[i];
      if (i < arrLotos.length - 1) {
        list += ",";
      }
    }

    AppController.getInstance().doShowLoading(4000);
    this.mLotteryDBCenter.getLotteryHttpService().requestLotoNguocUpdate(list).then(
      data => {
        this.onResponeUpdateLotoNguoc(data);
        AppController.getInstance().doCloseLoading();
      },
      error => {
        AppController.getInstance().doCloseLoading();
      }
    );
  }
  onResponeUpdateLotoNguoc(data) { 
    if (data.status == ResponseCode.SUCCESS) {
      this.mLotosNguoc = [];
      this.inputs.lotosnguoc = data.content;
      let lotos = this.inputs.lotosnguoc.split(",");
      for (let loto of lotos) {
        let lotoRecommend = new LotoRecommend();
        lotoRecommend.setValue(parseInt(loto));
        this.mLotosNguoc.push(lotoRecommend);
      }
    }
  }
}