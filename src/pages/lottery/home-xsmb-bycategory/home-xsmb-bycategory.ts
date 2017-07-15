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
}

class XSResult {
  mDate: Date;
  mDateStr: string;
  db: XS;
  g1: XS;
  g2: Array<XS> = [];
  g3: Array<XS> = [];
  g4: Array<XS> = [];
  g5: Array<XS> = [];
  g6: Array<XS> = [];
  g7: Array<XS> = [];
  constructor() {
    this.createDefaults();
  }
  createDefaults() {
    this.clearData();
    this.mDate = new Date();
    this.db = new XS();
    this.db.xoso = "-----";
    this.g1 = new XS();
    this.g1.xoso = "-----";
    {
      for (let i = 0; i < 2; i++) {
        let xs = new XS();
        xs.xoso = "-----";
        this.g2.push(xs);
      }
      for (let i = 0; i < 6; i++) {
        let xs = new XS();
        xs.xoso = "-----";
        this.g3.push(xs);
      }
      for (let i = 0; i < 4; i++) {
        let xs = new XS();
        xs.xoso = "----";
        this.g4.push(xs);
      }
      for (let i = 0; i < 6; i++) {
        let xs = new XS();
        xs.xoso = "----";
        this.g5.push(xs);
      }
      for (let i = 0; i < 3; i++) {
        let xs = new XS();
        xs.xoso = "---";
        this.g6.push(xs);
      }
      for (let i = 0; i < 4; i++) {
        let xs = new XS();
        xs.xoso = "--";
        this.g7.push(xs);
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
    this.g2 = [];
    this.g3 = [];
    this.g4 = [];
    this.g5 = [];
    this.g6 = [];
    this.g7 = [];
  }
  clearDb() {
    this.db = new XS();
  }
  clearToG1() {
    this.g1 = new XS();
  }
  clearToG2() {
    this.g1 = new XS();
    this.g2 = [];
  }
  clearToG3() {
    this.g1 = new XS();
    this.g2 = [];
    this.g3 = [];
  }
  clearToG4() {
    this.g1 = new XS();
    this.g2 = [];
    this.g3 = [];
    this.g4 = [];
  }
  clearToG5() {
    this.g1 = new XS();
    this.g2 = [];
    this.g3 = [];
    this.g4 = [];
    this.g5 = [];
  }
  clearToG6() {
    this.g1 = new XS();
    this.g2 = [];
    this.g3 = [];
    this.g4 = [];
    this.g5 = [];
    this.g6 = [];
  }
  clearToG7() {
    this.g1 = new XS();
    this.g2 = [];
    this.g3 = [];
    this.g4 = [];
    this.g5 = [];
    this.g6 = [];
    this.g7 = [];
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

class LotoMB {
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

class DienToan123 {
  mDate: Date;
  mDateStr: string;
  bs1: XS;
  bs2: XS;
  bs3: XS;

  constructor() {
    this.createDefault();
  }

  createDefault() {
    this.bs1 = new XS();
    this.bs1.xoso = '-';
    this.bs2 = new XS();
    this.bs2.xoso = '--';
    this.bs3 = new XS();
    this.bs3.xoso = '---';
  }

  clearData() {
    this.bs1 = new XS();
    this.bs2 = new XS();
    this.bs3 = new XS();
  }
}

class DienToan636 {
  mDate: Date;
  mDateStr: string;
  mDay: number;
  bs1: XS;
  bs2: XS;
  bs3: XS;
  bs4: XS;
  bs5: XS;
  bs6: XS;

  constructor() {
    this.createDefault();
  }
  createDefault() {
    this.bs1 = new XS();
    this.bs1.xoso = '--';
    this.bs2 = new XS();
    this.bs2.xoso = '--';
    this.bs3 = new XS();
    this.bs3.xoso = '--';
    this.bs4 = new XS();
    this.bs4.xoso = '--';
    this.bs5 = new XS();
    this.bs5.xoso = '--';
    this.bs6 = new XS();
    this.bs6.xoso = '--';
  }
  getDate(date: string) {
    let tempDate = new Date(date);
    this.mDate = tempDate;
    this.mDateStr = Utils.getViewDate(tempDate); // fix me
    this.mDay = tempDate.getDay();
  }
}

class ThanTai {
  mDate: Date;
  mDateStr: string;
  lottery: XS;

  constructor() {
    this.createDefault();
  }

  createDefault() {
    this.lottery = new XS();
    this.lottery.xoso = '----';
  }

  clearData() {
    this.lottery = new XS();
  }
}

@IonicPage()
@Component({
  selector: 'page-home-xsmb-bycategory',
  templateUrl: 'home-xsmb-bycategory.html',
})
export class HomeXsmbBycategory {
  mCate_id: number = 0;
  mTitle: string = '...';
  contentForm = {}

  datas = {
    mDate: new Date(),
    mDateStr: "",
    mTypeStr: "XSMB",
    mSelectedLotteryID: 0
  };

  categories: Array<LotteryCategory> = [];
  // mb
  mXSResult: XSResult = new XSResult();
  mLotoMB: LotoMB = new LotoMB();
  mDienToan123: DienToan123 = new DienToan123();
  mDienToan636: DienToan636 = new DienToan636();
  mThanTai: ThanTai = new ThanTai();

  AVAILABLE636: Array<number> = [3, 6]; // thu 4 va thu 7 hang tuan

  // for live time
  interval: any;
  intervalDT123: any;
  intervalDT636: any;
  intervalTT: any;

  // mien bac
  dauloto: Array<string> = [];
  duoiloto: Array<string> = [];
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
    this.datas.mSelectedLotteryID = this.mLotteryConstants.XSMB;
    this.mCate_id = mNavParams.get('cate_id');
    this.mTitle = "Xổ số " + mNavParams.get('name');
  }

  ionViewDidEnter() {
    this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);
    if (this.mCate_id == this.mLotteryConstants.XSDT636) {
      this.findAvailableDay636("P", this.datas.mDate);
    }
    this.onDataChange();
  }
  ionViewDidLeave() {
    clearInterval(this.interval);
    clearInterval(this.intervalDT123);
    clearInterval(this.intervalDT636);
    clearInterval(this.intervalTT);
  }
  onClickBack() {
    this.navCtrl.pop();
  }

  findAvailableDay636(when: string, date: Date) {
    let dayTime: number = date.getDay();
    // "P": Previous "A": After
    if (when == "P") {
      // find the available previous day for 'xo so dien toan 636'
      for (let i = 0; i < 7; i++) {
        if (dayTime == this.AVAILABLE636[0]
          || dayTime == this.AVAILABLE636[1]) {
          break;
        }
        else {
          date.setTime(Utils.getTimeBefore(date, 1));
          dayTime = date.getDay();
        }
      }
    }
    else if (when == "A") {
      for (let i = 0; i < 7; i++) {
        if (dayTime == this.AVAILABLE636[0]
          || dayTime == this.AVAILABLE636[1]) {
          if (this.datas.mDate.getTime() >= Date.now()) {
            this.datas.mDate.setTime(Date.now());
            this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);

            this.showAlertInvalidDay();
            this.findAvailableDay636("P", this.datas.mDate);
          }
          break;
        }
        else {
          date.setTime(Utils.getTimeAfter(date, 1));
          dayTime = date.getDay();
        }
      }
    }
    this.datas.mDate = new Date(Utils.getRequestDate(date));
  }

  onClickPreviousDay() {
    this.datas.mDate.setTime(this.datas.mDate.getTime() - this.mLotteryConstants.DAY_IN_MILLISECONDS);
    if (this.mCate_id == this.mLotteryConstants.XSDT636) {
      this.findAvailableDay636("P", this.datas.mDate);
    }
    this.onDataChange();
  }

  onClickNextDay() {
    this.datas.mDate.setTime(this.datas.mDate.getTime() + this.mLotteryConstants.DAY_IN_MILLISECONDS);
    if (this.datas.mDate.getTime() >= Date.now()) {
      this.datas.mDate.setTime(Date.now());
      this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);

      this.showAlertInvalidDay();
      this.findAvailableDay636("P", this.datas.mDate);
    } else {
      if (this.mCate_id == this.mLotteryConstants.XSDT636) {
        this.findAvailableDay636("A", this.datas.mDate);
      }
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
          if (this.mCate_id == this.mLotteryConstants.XSDT636) {
            this.findAvailableDay636("P", this.datas.mDate);
          }
          this.onDataChange();
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }

  onDataChange() {
    this.showLoading();
    this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);
    this.getCategories();

    this.currentLengthRL = 0;
    this.currentLengthDT123 = 0;
    this.currentLengthDT636 = 0;

    if (this.mCate_id == this.mLotteryConstants.RESULTXSMB) {
      this.requestResultLotteryAndLotoMB(Utils.getRequestDate(this.datas.mDate));

      if (this.isTimeToLive()) {
        clearInterval(this.interval);
        this.mXSResult.createDefaults();
        this.mLotoMB.createDefault();
        this.mXSResult.clearToG1();
        {
          let xs = new XS();
          xs.state = this.STATE_LOADING;
          this.mXSResult.g1 = xs;
        }
        this.interval = setInterval(() => {
          this.requestResultLotteryAndLotoMB(Utils.getRequestDate(this.datas.mDate));
        }, 4000);
      }
      else {
        clearInterval(this.interval);
      }
    }
    else if (this.mCate_id == this.mLotteryConstants.XSDT123) {
      this.requestResultLotteryDienToan123(Utils.getRequestDate(this.datas.mDate));

      if (this.isDienToan123LiveTime()) {
        this.mDienToan123.createDefault();
        clearInterval(this.intervalDT123);
        {
          this.mDienToan123.bs1.state = this.STATE_LOADING;
        }
        this.intervalDT123 = setInterval(() => {
          this.requestResultLotteryDienToan123(Utils.getRequestDate(this.datas.mDate));
        }, 4000);
      }
      else {
        clearInterval(this.intervalDT123);
      }
    }
    else if (this.mCate_id == this.mLotteryConstants.XSDT636) {
      this.mDienToan636.mDay = this.datas.mDate.getDay();
      this.requestResultLotteryDienToan636(Utils.getRequestDate(this.datas.mDate));  
      if (this.isDienToan636LiveTime()) {

        if (this.datas.mDate.getDay() == this.AVAILABLE636[0]
          || this.datas.mDate.getDay() == this.AVAILABLE636[1]) {
          this.needCheckDay = false;
          this.mDienToan636.createDefault();
          clearInterval(this.intervalDT636);
          {
            this.mDienToan636.bs1.state = this.STATE_LOADING;
          }
          this.intervalDT636 = setInterval(() => {
            this.requestResultLotteryDienToan636(Utils.getRequestDate(this.datas.mDate));
          }, 4000);
        }
      }
      else {
        clearInterval(this.intervalDT636);
      }
    }
    else if (this.mCate_id == this.mLotteryConstants.TT) {
      this.requestResultLotteryThanTai(Utils.getRequestDate(this.datas.mDate));

      if (this.isThanTaiLiveTime()) {
        this.mThanTai.createDefault();
        clearInterval(this.intervalTT);
        {
          this.mThanTai.lottery.state = this.STATE_LOADING;
        }
        this.intervalTT = setInterval(() => {
          this.requestResultLotteryThanTai(Utils.getRequestDate(this.datas.mDate));
        }, 4000);
      }
      else {
        clearInterval(this.intervalTT);
      }
    }
  }

  currentLengthRL: number = 0;
  requestResultLotteryAndLotoMB(time: string) {
    // ket qua mien bac
    this.mLotteryHttpService.requestCategoryResultLotteryAndLotoByCateId(this.mLotteryConstants.RESULTXSMB, time, time, -1, 1).then(
      (data) => {
        if (data['status'] == ResponseCode.SUCCESS) {
          if (data['content'].length > 0) {
            let xsmb = data['content'][0].lottery;

            if (xsmb.length > this.currentLengthRL) {
              this.currentLengthRL = xsmb.length;
              this.onRequestResultLotteryAndLotoMB(data);
              this.onRequestLotoMB(data);
            }
          }
          else if (!this.isTimeToLive()) {
            this.mXSResult.createDefaults();
            this.mLotoMB.createDefault();
          }
        }

        this.closeLoading();
        this.mFirstimeRequesting = false;
        if (this.isLiveEnd()) {
          clearInterval(this.interval);
        }
      }, (error) => {
        console.log(error);
        this.closeLoading();
        this.mXSResult.createDefaults();
        this.mLotoMB.createDefault();
        this.mFirstimeRequesting = false;
      });

  }

  currentLengthDT123: number = 0;
  requestResultLotteryDienToan123(time: string) {
    this.mLotteryHttpService.requestCategoryResultLotteryByCateId(this.mLotteryConstants.XSDT123, time, time, 1, 1).then(
      (data) => {
        if (data['status'] == ResponseCode.SUCCESS) {
          if (data['content'].length > 0) {
            let dientoan123 = data['content'][0].lottery;

            this.mDienToan123.mDate = data['content'][0].time;
            this.mDienToan123.mDateStr = Utils.getViewDate(new Date(this.mDienToan123.mDate + ''));

            if (dientoan123.length > this.currentLengthDT123) {
              this.currentLengthDT123 = dientoan123.length;
              this.onRequestDienToan123(data);
            }
          }
          else if (!this.isDienToan123LiveTime()) {
            this.mDienToan123.createDefault();
          }
        }

        this.closeLoading();
        this.mFirstimeRequesting = false;
        if (this.isDienToan123End()) {
          clearInterval(this.intervalDT123);
        }
      }, (error) => {
        console.log(error);
        this.closeLoading();
        this.mDienToan123.createDefault();
        this.mFirstimeRequesting = false;
      });
  }

  currentLengthDT636: number = 0;
  needCheckDay: boolean = true;
  requestResultLotteryDienToan636(time: string) {

    this.mLotteryHttpService.requestCategoryResultLotteryByCateId(this.mLotteryConstants.XSDT636, time, time, 1, 1).then(
      (data) => {
        if (data['status'] == ResponseCode.SUCCESS) {
          if (data['content'].length > 0) {
            let dientoan636 = data['content'][0].lottery;

            if (dientoan636.length > this.currentLengthDT636) {
              this.currentLengthDT636 = dientoan636.length;
              this.onRequestDienToan636(data);
            }
          }
          else if (!this.isDienToan636LiveTime()) {
            this.mDienToan636.createDefault();
          }
        }

        this.closeLoading();
        this.mFirstimeRequesting = false;
        if (this.isDienToan636End()) {
          clearInterval(this.intervalDT636);
        }
      }, (error) => {
        console.log(error);
        this.closeLoading();
        this.mDienToan636.createDefault();
        this.mFirstimeRequesting = false;
      });
  }

  requestResultLotteryThanTai(time: string) {
    this.mLotteryHttpService.requestCategoryResultLotteryByCateId(this.mLotteryConstants.TT, time, time, 1, 1).then(
      (data) => {
        if (data['status'] == ResponseCode.SUCCESS) {
          if (data['content'].length > 0) {
            let thantai = data['content'][0].lottery;

            if (thantai.length != 0) {
              this.onRequestThanTai(data);
            }
          }
          else if (!this.isThanTaiLiveTime()) {
            this.mThanTai.createDefault();
          }
        }

        this.closeLoading();
        this.mFirstimeRequesting = false;
        if (this.isThanTaiEnd()) {
          clearInterval(this.intervalTT);
        }
      },
      (error) => {
        console.log(error);
        this.closeLoading();
        this.mThanTai.createDefault();
        this.mFirstimeRequesting = false;
      });
  }

  onRequestResultLotteryAndLotoMB(data) {
    let resultLottery = data['content'][0].lottery;

    if (resultLottery.length >= 27) {
      this.mXSResult.clearData();
    }
    else if (resultLottery.length < 3) {
      this.mXSResult.clearToG2();
    }
    else if (resultLottery.length < 9) {
      this.mXSResult.clearToG3();
    }
    else if (resultLottery.length < 13) {
      this.mXSResult.clearToG4();
    }
    else if (resultLottery.length < 19) {
      this.mXSResult.clearToG5();
    }
    else if (resultLottery.length < 22) {
      this.mXSResult.clearToG6();
    }
    else if (resultLottery.length < 26) {
      this.mXSResult.clearToG7();
    }
    else {
      this.mXSResult.clearData();
    }

    resultLottery.forEach(lottery => {
      if (lottery.rank == 0) {
        this.mXSResult.db.setResult(lottery);
      }
      else if (lottery.rank == 1) {
        this.mXSResult.g1.setResult(lottery);
      }
      else {
        let tempXS = new XS();
        tempXS.setResult(lottery);

        if (lottery.rank == 2) {
          this.mXSResult.g2.push(tempXS);
        }
        else if (lottery.rank == 3) {
          this.mXSResult.g3.push(tempXS);
        }
        else if (lottery.rank == 4) {
          this.mXSResult.g4.push(tempXS);
        }
        else if (lottery.rank == 5) {
          this.mXSResult.g5.push(tempXS);
        }
        else if (lottery.rank == 6) {
          this.mXSResult.g6.push(tempXS);
        }
        else if (lottery.rank == 7) {
          this.mXSResult.g7.push(tempXS);
        }
      }
    });


    if (this.isTimeToLive()) {
      if (this.mXSResult.g2.length < 2) {
        let xs = new XS();
        xs.state = this.STATE_LOADING;
        this.mXSResult.g2.push(xs);
        for (let i = this.mXSResult.g2.length; i < 2; i++) {
          let xs = new XS();
          xs.xoso = "-----";
          this.mXSResult.g2.push(xs);
        }
      }
      else if (this.mXSResult.g3.length < 6) {
        let xs = new XS();
        xs.state = this.STATE_LOADING;
        this.mXSResult.g3.push(xs);
        for (let i = this.mXSResult.g3.length; i < 6; i++) {
          let xs = new XS();
          xs.xoso = "-----";
          this.mXSResult.g3.push(xs);
        }
      }
      else if (this.mXSResult.g4.length < 4) {
        let xs = new XS();
        xs.state = this.STATE_LOADING;
        this.mXSResult.g4.push(xs);
        for (let i = this.mXSResult.g4.length; i < 4; i++) {
          let xs = new XS();
          xs.xoso = "----";
          this.mXSResult.g4.push(xs);
        }
      }
      else if (this.mXSResult.g5.length < 6) {
        let xs = new XS();
        xs.state = this.STATE_LOADING;
        this.mXSResult.g5.push(xs);
        for (let i = this.mXSResult.g5.length; i < 6; i++) {
          let xs = new XS();
          xs.xoso = "----";
          this.mXSResult.g5.push(xs);
        }
      }
      else if (this.mXSResult.g6.length < 3) {
        let xs = new XS();
        xs.state = this.STATE_LOADING;
        this.mXSResult.g6.push(xs);
        for (let i = this.mXSResult.g6.length; i < 3; i++) {
          let xs = new XS();
          xs.xoso = "---";
          this.mXSResult.g6.push(xs);
        }
      }
      else if (this.mXSResult.g7.length < 4) {
        let xs = new XS();
        xs.state = this.STATE_LOADING;
        this.mXSResult.g7.push(xs);
        for (let i = this.mXSResult.g7.length; i < 4; i++) {
          let xs = new XS();
          xs.xoso = "--";
          this.mXSResult.g7.push(xs);
        }
      }
      else {
        let xs = new XS();
        xs.state = this.STATE_LOADING;
        this.mXSResult.db = xs;
      }
    }
    else {
      if (this.mXSResult.db.value == -1) {
        let xs = new XS();
        xs.xoso = "-----";
        this.mXSResult.db = xs;
      }
      if (this.mXSResult.g1.value == -1) {
        let xs = new XS();
        xs.xoso = "-----";
        this.mXSResult.g1 = xs;
      }
      if (this.mXSResult.g2.length < 2) {
        for (let i = this.mXSResult.g2.length; i < 2; i++) {
          let xs = new XS();
          xs.xoso = "-----";
          this.mXSResult.g2.push(xs);
        }
      }
      if (this.mXSResult.g3.length < 6) {
        for (let i = this.mXSResult.g3.length; i < 6; i++) {
          let xs = new XS();
          xs.xoso = "-----";
          this.mXSResult.g3.push(xs);
        }
      }
      if (this.mXSResult.g4.length < 4) {
        for (let i = this.mXSResult.g4.length; i < 4; i++) {
          let xs = new XS();
          xs.xoso = "----";
          this.mXSResult.g4.push(xs);
        }
      }
      if (this.mXSResult.g5.length < 6) {
        for (let i = this.mXSResult.g5.length; i < 6; i++) {
          let xs = new XS();
          xs.xoso = "----";
          this.mXSResult.g5.push(xs);
        }
      }
      if (this.mXSResult.g6.length < 3) {
        for (let i = this.mXSResult.g6.length; i < 3; i++) {
          let xs = new XS();
          xs.xoso = "---";
          this.mXSResult.g6.push(xs);
        }
      }
      if (this.mXSResult.g7.length < 4) {
        for (let i = this.mXSResult.g7.length; i < 4; i++) {
          let xs = new XS();
          xs.xoso = "--";
          this.mXSResult.g7.push(xs);
        }
      }
    }
  }


  onRequestLotoMB(data) {
    let arrangedLoto: Array<number> = [];
    data['content'][0].loto.forEach(element => {
      if (element.cate_id == 1) {
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

    this.mLotoMB.clearData();
    // check loto ve > 1 lan
    let lotoBeforeShow = new Map<number, number>();
    arrangedLoto.forEach(element => {
      let loto = new Loto();
      loto.setValue(1, element);
      this.mLotoMB.setValue(loto);

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
      this.mLotoMB.setLoto(loto);
    });
  }

  onRequestDienToan123(data) {
    let dientoan123 = data['content'][0].lottery;

    if (this.isDienToan123LiveTime) {
      dientoan123.forEach(element => {
        if (element.code.length == 1) {
          this.mDienToan123.bs1.setResult(element);
          this.mDienToan123.bs2.state = this.STATE_LOADING;
        }
        else if (element.code.length == 2) {
          this.mDienToan123.bs2.setResult(element);
          this.mDienToan123.bs3.state = this.STATE_LOADING;
        }
        else if (element.code.length == 3) {
          this.mDienToan123.bs3.setResult(element);
        }
        else {
          console.log("something wrong!");
        }
      });
    }
    else {
      dientoan123.forEach(element => {
        if (element.code.length == 1) {
          this.mDienToan123.bs1.setResult(element);
        }
        else if (element.code.length == 2) {
          this.mDienToan123.bs2.setResult(element);
        }
        else if (element.code.length == 3) {
          this.mDienToan123.bs3.setResult(element);
        }
        else {
          console.log("something wrong!");
        }
      });
    }
  }


  onRequestDienToan636(data) {
    let dientoan636 = data['content'][0].lottery;

    if (this.isDienToan636LiveTime) {
      if (dientoan636.length == 1) {
        this.mDienToan636.bs1.setResult(dientoan636[0]);
        this.mDienToan636.bs2.state = this.STATE_LOADING;
      }
      else if (dientoan636.length == 2) {
        this.mDienToan636.bs1.setResult(dientoan636[0]);
        this.mDienToan636.bs2.setResult(dientoan636[1]);
        this.mDienToan636.bs3.state = this.STATE_LOADING;
      }
      else if (dientoan636.length == 3) {
        this.mDienToan636.bs1.setResult(dientoan636[0]);
        this.mDienToan636.bs2.setResult(dientoan636[1]);
        this.mDienToan636.bs3.setResult(dientoan636[2]);
        this.mDienToan636.bs4.state = this.STATE_LOADING;
      }
      else if (dientoan636.length == 4) {
        this.mDienToan636.bs1.setResult(dientoan636[0]);
        this.mDienToan636.bs2.setResult(dientoan636[1]);
        this.mDienToan636.bs3.setResult(dientoan636[2]);
        this.mDienToan636.bs4.setResult(dientoan636[3]);
        this.mDienToan636.bs5.state = this.STATE_LOADING;
      }
      else if (dientoan636.length == 5) {
        this.mDienToan636.bs1.setResult(dientoan636[0]);
        this.mDienToan636.bs2.setResult(dientoan636[1]);
        this.mDienToan636.bs3.setResult(dientoan636[2]);
        this.mDienToan636.bs4.setResult(dientoan636[3]);
        this.mDienToan636.bs5.setResult(dientoan636[4]);
        this.mDienToan636.bs6.state = this.STATE_LOADING;
      }
      else if (dientoan636.length == 6) {
        this.mDienToan636.bs1.setResult(dientoan636[0]);
        this.mDienToan636.bs2.setResult(dientoan636[1]);
        this.mDienToan636.bs3.setResult(dientoan636[2]);
        this.mDienToan636.bs4.setResult(dientoan636[3]);
        this.mDienToan636.bs5.setResult(dientoan636[4]);
        this.mDienToan636.bs6.setResult(dientoan636[5]);
      }
      else {
        console.log("something wrong!");
      }
    }
    else {
      if (dientoan636.length == 1) {
        this.mDienToan636.bs1.setResult(dientoan636[0]);
      }
      else if (dientoan636.length == 2) {
        this.mDienToan636.bs1.setResult(dientoan636[0]);
        this.mDienToan636.bs2.setResult(dientoan636[1]);
      }
      else if (dientoan636.length == 3) {
        this.mDienToan636.bs1.setResult(dientoan636[0]);
        this.mDienToan636.bs2.setResult(dientoan636[1]);
        this.mDienToan636.bs3.setResult(dientoan636[2]);
      }
      else if (dientoan636.length == 4) {
        this.mDienToan636.bs1.setResult(dientoan636[0]);
        this.mDienToan636.bs2.setResult(dientoan636[1]);
        this.mDienToan636.bs3.setResult(dientoan636[2]);
        this.mDienToan636.bs4.setResult(dientoan636[3]);
      }
      else if (dientoan636.length == 5) {
        this.mDienToan636.bs1.setResult(dientoan636[0]);
        this.mDienToan636.bs2.setResult(dientoan636[1]);
        this.mDienToan636.bs3.setResult(dientoan636[2]);
        this.mDienToan636.bs4.setResult(dientoan636[3]);
        this.mDienToan636.bs5.setResult(dientoan636[4]);
      }
      else if (dientoan636.length == 6) {
        this.mDienToan636.bs1.setResult(dientoan636[0]);
        this.mDienToan636.bs2.setResult(dientoan636[1]);
        this.mDienToan636.bs3.setResult(dientoan636[2]);
        this.mDienToan636.bs4.setResult(dientoan636[3]);
        this.mDienToan636.bs5.setResult(dientoan636[4]);
        this.mDienToan636.bs6.setResult(dientoan636[5]);
      }
      else {
        console.log("something wrong!");
      }
    }
  }

  onRequestThanTai(data) {
    let thantai = data.content[0].lottery;
    this.mThanTai.mDate = data['content'][0].time;
    this.mThanTai.mDateStr = Utils.getViewDate(new Date(this.mThanTai.mDate + ''));

    this.mThanTai.lottery.setResult(thantai[0]);

  }

  isTimeToLive() {
    let currentTime = new Date();
    if (this.datas.mDateStr == Utils.getViewDate(currentTime)
      && currentTime.getHours() == 18
      && currentTime.getMinutes() >= 11
      && currentTime.getMinutes() <= 45) {
      return true;
    }
    return false;
  }

  isLiveEnd() {
    if (this.mXSResult.db.value > -1 || !this.isTimeToLive()) {
      return true;
    }
    return false;
  }

  isDienToan123LiveTime() {
    let currentTime = new Date();
    if (this.datas.mDateStr == Utils.getViewDate(currentTime)
      && currentTime.getHours() == 18
      && currentTime.getMinutes() >= 2
      && currentTime.getMinutes() <= 15) {
      return true;
    }
    return false;
  }

  isDienToan123End() {
    if (this.mDienToan123.bs3.value > -1 || !this.isDienToan123LiveTime()) {
      return true;
    }
    return false;
  }

  isDienToan636LiveTime() {
    let currentTime = new Date();
    if (this.datas.mDateStr == Utils.getViewDate(currentTime)
      && currentTime.getHours() == 18
      && currentTime.getMinutes() >= 2
      && currentTime.getMinutes() <= 15) {
      return true;
    }
    return false;
  }

  isDienToan636End() {
    if (this.mDienToan636.bs6.value > -1 || !this.isDienToan636LiveTime()) {
      return true;
    }
    return false;
  }

  isThanTaiLiveTime() {
    let currentTime = new Date();

    if (this.datas.mDateStr == Utils.getViewDate(currentTime)
      && currentTime.getHours() == 18
      && currentTime.getMinutes() >= 2
      && currentTime.getMinutes() <= 15) {
      return true;
    }
    return false;
  }

  isThanTaiEnd() {
    if (this.mThanTai.lottery.value > -1 || !this.isThanTaiLiveTime()) {
      return true;
    }
    return false;
  }

  OnClickViewByCategory(cate_id: number) {
    this.mCate_id = cate_id;

    if (this.mCate_id == this.mLotteryConstants.RESULTXSMB) {
      this.mTitle = "Xổ số Truyền thống";
    }
    else if (this.mCate_id == this.mLotteryConstants.XSDT123) {
      this.mTitle = "Xổ số Điện toán 123";
    }
    else if (this.mCate_id == this.mLotteryConstants.XSDT636) {
      this.mTitle = "Xổ số Điện toán 636";
    }
    else if (this.mCate_id == this.mLotteryConstants.TT) {
      this.mTitle = "Xổ số Thần tài";
    }

    this.datas.mDate = new Date();
    this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);
    if (this.mCate_id == this.mLotteryConstants.XSDT636) {
      this.findAvailableDay636("P", this.datas.mDate);
    }
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
