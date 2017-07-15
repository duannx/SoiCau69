import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, MenuController, Platform, LoadingController, Alert, AlertController } from 'ionic-angular';

import { LotteryDBCenter } from '../../../providers/lottery/lottery';
import { LotteryType, LotteryCategory } from '../../../providers/lottery/lottery-type';
import { LotteryConstants } from '../../../providers/lottery/lottery-constant';
import { Utils } from '../../../providers/app-utils';
import { ResponseCode } from '../../../providers/app-constant';
import { StatusBar } from '@ionic-native/status-bar';
import { DatePicker } from '@ionic-native/date-picker';

import { LotteryHttpService } from '../../../providers/lottery/lottery-http-service';

class XS {
  value: number;
  xoso: string;
  state: number;
  constructor() {
    this.createDefault();
  }
  createDefault() {
    this.value = -1;
    this.state = -1;
    this.xoso = "";
  }
  setResult(data) {
    this.value = data.code;
    this.xoso = "" + this.value;
    this.state = -1;
  }
  setXoso(data) {
    this.xoso = "" + data;
  }
}

class Loto {
  code: number;
  loto: string;
  frequency: number;
  constructor() {
    this.createDefault();
  }
  createDefault() {
    this.code = -1;
    this.loto = '--';
    this.frequency = -1;
  }
  setValue(frequency: number, code: number) {
    this.code = code;
    this.loto = code + "";
    this.frequency = frequency;
  }
}

// -------------------------------------------- XSMT & XSMN

class XSMTMNResult {
  mDate: Date;
  mDateStr: string;
  db: XS;
  g1: XS;
  g2: XS;
  g3: Array<XS> = [];
  g4: Array<XS> = [];
  g5: XS;
  g6: Array<XS> = [];
  g7: XS;
  g8: XS;
  constructor() {
    this.createDefaults();
  }
  createDefaults() {
    this.clearData();
    this.mDate = new Date();
    this.db = new XS();
    this.db.xoso = "------";
    this.g1 = new XS();
    this.g1.xoso = "-----";
    this.g2 = new XS();
    this.g2.xoso = "-----";
    this.g5 = new XS();
    this.g5.xoso = "----";
    this.g7 = new XS();
    this.g7.xoso = "---";
    this.g8 = new XS();
    this.g8.xoso = "--";
    {
      for (let i = 0; i < 2; i++) {
        let xs = new XS();
        xs.xoso = "-----";
        this.g3.push(xs);
      }
      for (let i = 0; i < 7; i++) {
        let xs = new XS();
        xs.xoso = "-----";
        this.g4.push(xs);
      }
      for (let i = 0; i < 3; i++) {
        let xs = new XS();
        xs.xoso = "----";
        this.g6.push(xs);
      }
    }
    this.onDataChange();
  }
  onDataChange() {
    this.mDateStr = Utils.getViewDate(this.mDate);
  }
  clearData() {
    this.db = new XS();
    this.g1 = new XS();
    this.g2 = new XS();
    this.g3 = [];
    this.g4 = [];
    this.g5 = new XS();
    this.g6 = [];
    this.g7 = new XS();
    this.g8 = new XS();
  }
  clearToDb() {
    this.db = new XS();
  }
  clearToG1() {
    this.g1 = new XS();
    this.g2 = new XS();
    this.g3 = [];
    this.g4 = [];
    this.g5 = new XS();
    this.g6 = [];
    this.g7 = new XS();
    this.g8 = new XS();
  }
  clearToG2() {
    this.g2 = new XS();
    this.g3 = [];
    this.g4 = [];
    this.g5 = new XS();
    this.g6 = [];
    this.g7 = new XS();
    this.g8 = new XS();
  }
  clearToG3() {
    this.g3 = [];
    this.g4 = [];
    this.g5 = new XS();
    this.g6 = [];
    this.g7 = new XS();
    this.g8 = new XS();
  }
  clearToG4() {
    this.g4 = [];
    this.g5 = new XS();
    this.g6 = [];
    this.g7 = new XS();
    this.g8 = new XS();
  }
  clearToG5() {
    this.g5 = new XS();
    this.g6 = [];
    this.g7 = new XS();
    this.g8 = new XS();
  }
  clearToG6() {
    this.g6 = [];
    this.g7 = new XS();
    this.g8 = new XS();
  }
  clearToG7() {
    this.g7 = new XS();
    this.g8 = new XS();
  }
  clearToG8() {
    this.g8 = new XS();
  }
}

class LotoMTMN {
  loto: Array<Loto> = [];
  dau0: Array<Loto> = [];
  dau1: Array<Loto> = [];
  dau2: Array<Loto> = [];
  dau3: Array<Loto> = [];
  dau4: Array<Loto> = [];
  dau5: Array<Loto> = [];
  dau6: Array<Loto> = [];
  dau7: Array<Loto> = [];
  dau8: Array<Loto> = [];
  dau9: Array<Loto> = [];
  duoi0: Array<Loto> = [];
  duoi1: Array<Loto> = [];
  duoi2: Array<Loto> = [];
  duoi3: Array<Loto> = [];
  duoi4: Array<Loto> = [];
  duoi5: Array<Loto> = [];
  duoi6: Array<Loto> = [];
  duoi7: Array<Loto> = [];
  duoi8: Array<Loto> = [];
  duoi9: Array<Loto> = [];
  constructor() {
    this.createDefault();
  }
  createDefault() {
    this.clearData();
    this.loto = [];
    let loto = new Loto();
    this.dau0.push(loto);
    this.dau1.push(loto);
    this.dau2.push(loto);
    this.dau3.push(loto);
    this.dau4.push(loto);
    this.dau5.push(loto);
    this.dau6.push(loto);
    this.dau7.push(loto);
    this.dau8.push(loto);
    this.dau9.push(loto);
    this.duoi0.push(loto);
    this.duoi1.push(loto);
    this.duoi2.push(loto);
    this.duoi3.push(loto);
    this.duoi4.push(loto);
    this.duoi5.push(loto);
    this.duoi6.push(loto);
    this.duoi7.push(loto);
    this.duoi8.push(loto);
    this.duoi9.push(loto);
  }
  clearData() {
    this.loto = [];
    this.dau0 = [];
    this.dau1 = [];
    this.dau2 = [];
    this.dau3 = [];
    this.dau4 = [];
    this.dau5 = [];
    this.dau6 = [];
    this.dau7 = [];
    this.dau8 = [];
    this.dau9 = [];
    this.duoi0 = [];
    this.duoi1 = [];
    this.duoi2 = [];
    this.duoi3 = [];
    this.duoi4 = [];
    this.duoi5 = [];
    this.duoi6 = [];
    this.duoi7 = [];
    this.duoi8 = [];
    this.duoi9 = [];
  }
  setValue(loto: Loto) {
    this.loto.push(loto);
  }
  setLoto(loto: Loto) {
    if (loto.code < 10) {
      this.dau0.push(loto);
    }
    else if (loto.code < 20) {
      this.dau1.push(loto);
    }
    else if (loto.code < 30) {
      this.dau2.push(loto);
    }
    else if (loto.code < 40) {
      this.dau3.push(loto);
    }
    else if (loto.code < 50) {
      this.dau4.push(loto);
    }
    else if (loto.code < 60) {
      this.dau5.push(loto);
    }
    else if (loto.code < 70) {
      this.dau6.push(loto);
    }
    else if (loto.code < 80) {
      this.dau7.push(loto);
    }
    else if (loto.code < 90) {
      this.dau8.push(loto);
    }
    else if (loto.code < 100) {
      this.dau9.push(loto);
    }

    if (parseInt(loto.loto.substring(1, 2)) == 0) {
      this.duoi0.push(loto);
    }
    else if (parseInt(loto.loto.substring(1, 2)) == 1) {
      this.duoi1.push(loto);
    }
    else if (parseInt(loto.loto.substring(1, 2)) == 2) {
      this.duoi2.push(loto);
    }
    else if (parseInt(loto.loto.substring(1, 2)) == 3) {
      this.duoi3.push(loto);
    }
    else if (parseInt(loto.loto.substring(1, 2)) == 4) {
      this.duoi4.push(loto);
    }
    else if (parseInt(loto.loto.substring(1, 2)) == 5) {
      this.duoi5.push(loto);
    }
    else if (parseInt(loto.loto.substring(1, 2)) == 6) {
      this.duoi6.push(loto);
    }
    else if (parseInt(loto.loto.substring(1, 2)) == 7) {
      this.duoi7.push(loto);
    }
    else if (parseInt(loto.loto.substring(1, 2)) == 8) {
      this.duoi8.push(loto);
    }
    else if (parseInt(loto.loto.substring(1, 2)) == 9) {
      this.duoi9.push(loto);
    }
  }
}

@IonicPage()
@Component({
  selector: 'page-home-xsmt-xsmn-bycategory',
  templateUrl: 'home-xsmt-xsmn-bycategory.html',
})
export class HomeXsmtXsmnBycategory {
  mCate_id: number = 0;
  mTitle: string = '...';
  contentForm = {}

  datas = {
    mDate: new Date(),
    mDateStr: "",
    mTypeStr: "KQXS",
    mSelectedLotteryID: 0
  };

  categories: Array<LotteryCategory> = [];

  // for live time
  intervalMT: any;
  intervalMN: any;

  // mtmn
  mXSMTMNResult: XSMTMNResult = new XSMTMNResult();
  mLotoMTMN: LotoMTMN = new LotoMTMN();

  // mien trung mien nam
  cities: Array<number> = [];

  AVAILABLEDAY: Array<number> = [];
  mFirstimeRequesting: boolean = true;
  STATE_NONE: number = -1;
  STATE_LOADING: number = 0;
  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private mNavParams: NavParams,
    private mLotteryDBCenter: LotteryDBCenter,
    private mStatusBar: StatusBar,
    private mMenuController: MenuController,
    private mLotteryConstants: LotteryConstants,
    private mLoadingController: LoadingController,
    private mDatePicker: DatePicker,
    private mLotteryHttpService: LotteryHttpService,
    private mAlertController: AlertController) {
    this.datas.mSelectedLotteryID = mNavParams.get('id');
    this.mCate_id = mNavParams.get('cate_id');
    this.mTitle = "Xổ số " + mNavParams.get('name');
  }

  ionViewDidEnter() {
    this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);
    this.getAvailableDay();

    this.findAvailableDay("P", this.datas.mDate);
    this.onDataChange();
    this.getCategories();
  }
  ionViewDidLeave() {
    clearInterval(this.intervalMT);
    clearInterval(this.intervalMN);
  }
  onClickBack() {
    this.navCtrl.pop();
  }

  onClickPreviousDay() {
    this.datas.mDate.setTime(this.datas.mDate.getTime() - this.mLotteryConstants.DAY_IN_MILLISECONDS);
    this.findAvailableDay("P", this.datas.mDate);
    this.onDataChange();
  }

  onClickNextDay() {
    this.datas.mDate.setTime(this.datas.mDate.getTime() + this.mLotteryConstants.DAY_IN_MILLISECONDS);
    if (this.datas.mDate.getTime() >= Date.now()) {
      this.datas.mDate.setTime(Date.now());
      this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);

      this.showAlertInvalidDay();
      this.findAvailableDay("P", this.datas.mDate);
    } else {
      this.findAvailableDay("A", this.datas.mDate);
      this.onDataChange();
    }
  }
  onClickPickDay() {
    this.mDatePicker.show({
      date: this.datas.mDate,
      mode: 'date',
      maxDate: new Date()
    }).then(
      date => {
        if (date) {
          this.datas.mDate = date;
          this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);
          if (this.datas.mDate.getTime() >= Date.now()) {
            this.showAlertInvalidDay();
          }
          this.findAvailableDay("P", this.datas.mDate);
          this.onDataChange();
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }

  onDataChange() {
    this.showLoading();
    this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);
    // this.getCategories();

    this.currentLengthMTMN = 0;
    this.requestResultLotteryAndLotoMTMN(this.datas.mSelectedLotteryID, Utils.getRequestDate(this.datas.mDate));

    if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMT) {
      if (this.isTimeToLiveMT()) {
        clearInterval(this.intervalMT);

        this.mXSMTMNResult.createDefaults();
        this.mLotoMTMN.createDefault();
        this.mXSMTMNResult.clearToG8();
        {
          let xs = new XS();
          xs.state = this.STATE_LOADING;
          this.mXSMTMNResult.g8 = xs;
        }
        this.intervalMT = setInterval(() => {
          this.requestResultLotteryAndLotoMTMN(this.datas.mSelectedLotteryID, Utils.getRequestDate(this.datas.mDate));
        }, 4000);
      }
      else {
        clearInterval(this.intervalMT);
      }
    }
    else if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMN) {
      if (this.isTimeToLiveMN()) {
        clearInterval(this.intervalMN);

        this.mXSMTMNResult.createDefaults();
        this.mLotoMTMN.createDefault();
        this.mXSMTMNResult.clearToG8();
        {
          let xs = new XS();
          xs.state = this.STATE_LOADING;
          this.mXSMTMNResult.g8 = xs;
        }
        this.intervalMN = setInterval(() => {
          this.requestResultLotteryAndLotoMTMN(this.datas.mSelectedLotteryID, Utils.getRequestDate(this.datas.mDate));
        }, 4000);
      }
      else {
        clearInterval(this.intervalMN);
      }
    }
  }

  //----------------------------------------------- XSMT & XSMN
  isLiveEndMT() {
    if (this.mXSMTMNResult.db.value > -1 || !this.isTimeToLiveMT()) {
      return true;
    }
    return false;
  }

  isTimeToLiveMT() {
    let currentTime = new Date();
    if (this.datas.mDateStr == Utils.getViewDate(currentTime)
      && currentTime.getHours() == 17
      && currentTime.getMinutes() >= 11
      && currentTime.getMinutes() <= 45) {
      return true;
    }
    return false;
  }

  isLiveEndMN() {
    if (this.mXSMTMNResult.db.value > -1 || !this.isTimeToLiveMN()) {
      return true;
    }
    return false;
  }

  isTimeToLiveMN() {
    let currentTime = new Date();
    if (this.datas.mDateStr == Utils.getViewDate(currentTime)
      && currentTime.getHours() == 16
      && currentTime.getMinutes() >= 11
      && currentTime.getMinutes() <= 45) {
      return true;
    }
    return false;
  }

  clearCities() {
    this.cities = [];
  }

  currentLengthMTMN: number = 0;
  requestResultLotteryAndLotoMTMN(selectedLotteryID: number, time: string) {
    this.mLotteryHttpService.requestCategoryResultLotteryAndLoto(selectedLotteryID, this.mCate_id, time, time, -1, 1).then(
      (data) => {
        if (data['status'] == ResponseCode.SUCCESS) {
          if (data['content'].length > 0) {
            let xsmtmn = data['content'][0].lottery;

            if (xsmtmn.length > this.currentLengthMTMN) {
              this.currentLengthMTMN = xsmtmn.length;
              this.onRequestResultLotteryAndLotoMTMN(data);
              this.onRequestLotoMTMN(data);
            }
          }
          else if ((!this.isTimeToLiveMT() && this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMT)
            || (!this.isTimeToLiveMN() && this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMN)) {
            this.mXSMTMNResult.createDefaults();
            this.mLotoMTMN.createDefault();
          }
        }

        this.closeLoading();
        this.mFirstimeRequesting = false;

        if (this.isLiveEndMT()) {
          clearInterval(this.intervalMT);
        }
        if (this.isLiveEndMN()) {
          clearInterval(this.intervalMN);
        }
      }, (error) => {
        console.log(error);
        this.closeLoading();
        this.mFirstimeRequesting = false;
        this.mXSMTMNResult.createDefaults();
        this.mLotoMTMN.createDefault();
      });

  }

  onRequestResultLotteryAndLotoMTMN(data) {
    let resultLottery = data['content'][0].lottery;

    if ((!this.isTimeToLiveMT() && this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMT)
      || (!this.isTimeToLiveMN() && this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMN)) {


      this.mXSMTMNResult.createDefaults();
      this.mLotoMTMN.createDefault();
    }

    if (resultLottery.length >= 18) {
      this.mXSMTMNResult.clearData();
    }
    else if (resultLottery.length < 2) {
      this.mXSMTMNResult.clearToG7();
    }
    else if (resultLottery.length < 5) {
      this.mXSMTMNResult.clearToG6();
    }
    else if (resultLottery.length < 6) {
      this.mXSMTMNResult.clearToG5();
    }
    else if (resultLottery.length < 13) {
      this.mXSMTMNResult.clearToG4();
    }
    else if (resultLottery.length < 15) {
      this.mXSMTMNResult.clearToG3();
    }
    else if (resultLottery.length < 16) {
      this.mXSMTMNResult.clearToG2();
    }
    else if (resultLottery.length < 17) {
      this.mXSMTMNResult.clearToG1();
    }
    else {
      this.mXSMTMNResult.clearData();
    }

    resultLottery.forEach(lottery => {
      if (lottery.rank == 0) {
        this.mXSMTMNResult.db.setResult(lottery);
      }
      else if (lottery.rank == 1) {
        this.mXSMTMNResult.g1.setResult(lottery);
      }
      else if (lottery.rank == 2) {
        this.mXSMTMNResult.g2.setResult(lottery);
      }
      else if (lottery.rank == 5) {
        this.mXSMTMNResult.g5.setResult(lottery);
      }
      else if (lottery.rank == 7) {
        this.mXSMTMNResult.g7.setResult(lottery);
      }
      else if (lottery.rank == 8) {
        this.mXSMTMNResult.g8.setResult(lottery);
      }
      else {
        let tempXS = new XS();
        tempXS.setResult(lottery);

        if (lottery.rank == 3) {
          this.mXSMTMNResult.g3.push(tempXS);
        }
        else if (lottery.rank == 4) {
          this.mXSMTMNResult.g4.push(tempXS);
        }
        else if (lottery.rank == 6) {
          this.mXSMTMNResult.g6.push(tempXS);
        }
      }
    });

    // still living
    if ((!this.isLiveEndMT() && this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMT)
      || (!this.isLiveEndMN() && this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMN)) {
      if (this.mXSMTMNResult.g7.value == -1) {
        this.mXSMTMNResult.g7 = new XS();
        this.mXSMTMNResult.g7.state = this.STATE_LOADING;
      }
      else if (this.mXSMTMNResult.g6.length < 3) {
        let xs = new XS();
        xs.state = this.STATE_LOADING;
        this.mXSMTMNResult.g6.push(xs);
        for (let i = this.mXSMTMNResult.g6.length; i < 3; i++) {
          let xs = new XS();
          xs.xoso = "----";
          this.mXSMTMNResult.g6.push(xs);
        }
      }
      else if (this.mXSMTMNResult.g5.value == -1) {
        this.mXSMTMNResult.g5 = new XS();
        this.mXSMTMNResult.g5.state = this.STATE_LOADING;
      }
      else if (this.mXSMTMNResult.g4.length < 7) {
        let xs = new XS();
        xs.state = this.STATE_LOADING;
        this.mXSMTMNResult.g4.push(xs);
        for (let i = this.mXSMTMNResult.g4.length; i < 7; i++) {
          let xs = new XS();
          xs.xoso = "-----";
          this.mXSMTMNResult.g4.push(xs);
        }
      }
      else if (this.mXSMTMNResult.g3.length < 2) {
        let xs = new XS();
        xs.state = this.STATE_LOADING;
        this.mXSMTMNResult.g3.push(xs);
        for (let i = this.mXSMTMNResult.g3.length; i < 2; i++) {
          let xs = new XS();
          xs.xoso = "-----";
          this.mXSMTMNResult.g3.push(xs);
        }
      }
      else if (this.mXSMTMNResult.g2.value == -1) {
        this.mXSMTMNResult.g2 = new XS();
        this.mXSMTMNResult.g2.state = this.STATE_LOADING;
      }
      else if (this.mXSMTMNResult.g1.value == -1) {
        this.mXSMTMNResult.g1 = new XS();
        this.mXSMTMNResult.g1.state = this.STATE_LOADING;
      }
      else {
        this.mXSMTMNResult.db = new XS();
        this.mXSMTMNResult.db.state = this.STATE_LOADING;
      }
    }
    else {
      if (this.mXSMTMNResult.g8.value == -1) {
        this.mXSMTMNResult.g8 = new XS();
        this.mXSMTMNResult.g8.setXoso("--");
      }
      if (this.mXSMTMNResult.g7.value == -1) {
        this.mXSMTMNResult.g7 = new XS();
        this.mXSMTMNResult.g7.setXoso("---");
      }
      if (this.mXSMTMNResult.g5.value == -1) {
        this.mXSMTMNResult.g5 = new XS();
        this.mXSMTMNResult.g5.setXoso("----");
      }
      if (this.mXSMTMNResult.g2.value == -1) {
        this.mXSMTMNResult.g2 = new XS();
        this.mXSMTMNResult.g2.setXoso("-----");
      }
      if (this.mXSMTMNResult.g1.value == -1) {
        this.mXSMTMNResult.g1 = new XS();
        this.mXSMTMNResult.g1.setXoso("-----");
      }
      if (this.mXSMTMNResult.db.value == -1) {
        this.mXSMTMNResult.db = new XS();
        this.mXSMTMNResult.db.setXoso("------");
      }
      if (this.mXSMTMNResult.g6.length < 3) {
        let xs = new XS();
        xs.setXoso("----");
        for (let i = this.mXSMTMNResult.g6.length; i < 3; i++) {
          this.mXSMTMNResult.g6.push(xs)
        };
      }
      if (this.mXSMTMNResult.g4.length < 7) {
        let xs = new XS();
        xs.setXoso("-----");
        for (let i = this.mXSMTMNResult.g4.length; i < 7; i++) {
          this.mXSMTMNResult.g4.push(xs)
        };
      }
      if (this.mXSMTMNResult.g3.length < 2) {
        let xs = new XS();
        xs.setXoso("-----");
        for (let i = this.mXSMTMNResult.g3.length; i < 2; i++) {
          this.mXSMTMNResult.g3.push(xs)
        };
      }
    }
  }

  onRequestLotoMTMN(data) {
    let arrangedLoto: Array<number> = [];
    data['content'][0].loto.forEach(element => {
      if (element.cate_id == this.mCate_id) {
        arrangedLoto.push(element.code)
      }
      else {
        console.log("something wrong??");
      }
    });

    // sap xep loto
    for (let i = 0; i < arrangedLoto.length - 1; i++) {
      for (let j = i + 1; j < arrangedLoto.length; j++) {
        if (arrangedLoto[i] > arrangedLoto[j]) {
          let tempValue = arrangedLoto[i];
          arrangedLoto[i] = arrangedLoto[j];
          arrangedLoto[j] = tempValue;
        }
      }
    }

    this.mLotoMTMN.clearData();
    // check loto ve > 1 lan
    let lotoBeforeShow = new Map<number, number>();
    arrangedLoto.forEach(element => {
      let loto = new Loto();
      loto.setValue(1, element);
      this.mLotoMTMN.setValue(loto);

      if (!lotoBeforeShow.has(element)) {
        lotoBeforeShow.set(element, 1);
      }
      else {
        lotoBeforeShow.set(element, lotoBeforeShow.get(element) + 1);
      }
    });

    lotoBeforeShow.forEach((frequency, code) => {
      let loto = new Loto();
      loto.setValue(frequency, code);
      this.mLotoMTMN.setLoto(loto);
    });
  }

  getAvailableDay() {
    let cities = [];

    if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMT) {
      cities = this.mLotteryConstants.CITIESMT;
    }
    else if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMN) {
      cities = this.mLotteryConstants.CITIESMN;
    }

    for (let i = 0; i < cities.length; i++) {
      if (this.mCate_id == cities[i].id) {
        this.AVAILABLEDAY = cities[i].available_day;
        this.mTitle = "Xổ số " + cities[i].title;
        break;
      }
    }
  }

  findAvailableDay(when: string, date: Date) {
    let dayTime: number = date.getDay();
    // "P": Previous "A": After
    if (when == "P") {
      // find the available previous day for 'xo so mien trung hoac xo so mien nam'
      out:
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < this.AVAILABLEDAY.length; j++) {
          if (dayTime == this.AVAILABLEDAY[j]) {
            break out;
          }
        }
        date.setTime(Utils.getTimeBefore(date, 1));
        dayTime = date.getDay();
      }
    }
    else if (when == "A") {
      out:
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < this.AVAILABLEDAY.length; j++) {

          if (dayTime == this.AVAILABLEDAY[j]) {
            if (this.datas.mDate.getTime() >= Date.now()) {
              this.datas.mDate.setTime(Date.now());
              this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);

              this.showAlertInvalidDay()
              this.findAvailableDay("P", this.datas.mDate);
            }
            break out;
          }
        }
        date.setTime(Utils.getTimeAfter(date, 1));
        dayTime = date.getDay();
      }
    }

    this.datas.mDate = new Date(Utils.getRequestDate(date));
    this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);
  }

  OnClickViewByCategory(cate_id: number) {
    this.mCate_id = cate_id;
    this.datas.mDate = new Date();
    this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);

    this.getAvailableDay();
    this.findAvailableDay("P", this.datas.mDate);
    this.onDataChange();
  }

  getCategories() {
    this.mLotteryDBCenter.lotteries.forEach(element => {
      if (element.id == this.datas.mSelectedLotteryID) {
        this.categories = element.categories;
      }
    });
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

  showAlertInvalidDay() {
    let alert = this.mAlertController.create({
      title: "Không hợp lệ",
      message: "Các ngày sau ngày " + this.datas.mDateStr + " chưa quay thưởng",
      buttons: ["OK"]
    });
    alert.present();
  }
}
