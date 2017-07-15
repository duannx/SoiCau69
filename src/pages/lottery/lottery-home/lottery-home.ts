import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform, Loading, LoadingController, AlertController } from 'ionic-angular';

import { LotteryDBCenter } from '../../../providers/lottery/lottery';
import { LotteryType, LotteryCategory } from '../../../providers/lottery/lottery-type';
import { LotteryConstants } from '../../../providers/lottery/lottery-constant';
import { ResponseCode } from '../../../providers/app-constant';
import { Utils } from '../../../providers/app-utils';
import { LotteryStatistics } from '../../../providers/lottery/lottery-statistics';
import { StatusBar } from '@ionic-native/status-bar';
import { DatePicker } from '@ionic-native/date-picker';

import { LotteryHttpService } from '../../../providers/lottery/lottery-http-service';
import Chart from "chart.js";

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
    this.frequency = 0;
  }
  setValue(frequency: number, code: number) {
    this.code = code;
    this.frequency = frequency;
    this.loto = "" + code;
  }
  setFrequency(frequency: number) {
    this.frequency = frequency;
  }
}

// -------------------------------------------- XSMB
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

class LotoMB {
  loto: Array<Loto> = [];
  lotoDau = [];
  lotoDuoi = [];
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
    this.setLotoDauDuoi();
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
    this.lotoDau = [];
    this.lotoDuoi = [];
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

    this.setLotoDauDuoi();
  }

  setLotoDauDuoi() {
    this.lotoDau = [this.dau0, this.dau1, this.dau2, this.dau3, this.dau4, this.dau5, this.dau6, this.dau7, this.dau8, this.dau9];
    this.lotoDuoi = [this.duoi0, this.duoi1, this.duoi2, this.duoi3, this.duoi4, this.duoi5, this.duoi6, this.duoi7, this.duoi8, this.duoi9];
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
  setDate(date: Date) {
    this.mDate = date;
    this.mDateStr = Utils.getViewDate(date); // fix me
    this.mDay = date.getDay();
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

// -------------------------------------------- XSMT & XSMN
class XSMTvMN {
  mDate: Date;
  mDateStr: string;
  city: string;
  city_id: number;
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
    this.mDate = new Date();
    this.city = "...";
    this.city_id = 0;
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

  setDefaultValueFromG7() {
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
    let xs = new XS();
    xs.xoso = "-----";
    this.g3.push(xs);
    xs.xoso = "-----";
    this.g4.push(xs);
    xs.xoso = "----";
    this.g6.push(xs);
  }
  setDefaultValueFromG6() {
    this.db = new XS();
    this.db.xoso = "------";
    this.g1 = new XS();
    this.g1.xoso = "-----";
    this.g2 = new XS();
    this.g2.xoso = "-----";
    this.g5 = new XS();
    this.g5.xoso = "----";
    let xs = new XS();
    xs.xoso = "-----";
    this.g3.push(xs);
    xs.xoso = "-----";
    this.g4.push(xs);
    xs.xoso = "----";
    this.g6.push(xs);
  }
  setDefaultValueFromG5() {
    this.db = new XS();
    this.db.xoso = "------";
    this.g1 = new XS();
    this.g1.xoso = "-----";
    this.g2 = new XS();
    this.g2.xoso = "-----";
    this.g5 = new XS();
    this.g5.xoso = "----";
    let xs = new XS();
    xs.xoso = "-----";
    this.g3.push(xs);
    xs.xoso = "-----";
    this.g4.push(xs);
  }
  setDefaultValueFromG4() {
    this.db = new XS();
    this.db.xoso = "------";
    this.g1 = new XS();
    this.g1.xoso = "-----";
    this.g2 = new XS();
    this.g2.xoso = "-----";
    let xs = new XS();
    xs.xoso = "-----";
    this.g3.push(xs);
    xs.xoso = "-----";
    this.g4.push(xs);
  }
  setDefaultValueFromG3() {
    this.db = new XS();
    this.db.xoso = "------";
    this.g1 = new XS();
    this.g1.xoso = "-----";
    this.g2 = new XS();
    this.g2.xoso = "-----";
    let xs = new XS();
    xs.xoso = "-----";
    this.g3.push(xs);
  }
  setDefaultValueFromG2() {
    this.db = new XS();
    this.db.xoso = "------";
    this.g1 = new XS();
    this.g1.xoso = "-----";
    this.g2 = new XS();
    this.g2.xoso = "-----";
  }
  setDefaultValueFromG1() {
    this.db = new XS();
    this.db.xoso = "------";
    this.g1 = new XS();
    this.g1.xoso = "-----";
  }
  createDefaultDB() {
    this.db = new XS();
    this.db.xoso = "------";
  }
  createDefaultG1() {
    this.g1 = new XS();
    this.g1.xoso = "-----";
  }
  createDefaultG2() {
    this.g2 = new XS();
    this.g2.xoso = "-----";
  }
  createDefaultG3() {
    let xs = new XS();
    xs.xoso = "-----";
    this.g3.push(xs);
  }
  createDefaultG4() {
    let xs = new XS();
    xs.xoso = "-----";
    this.g4.push(xs);
  }
  createDefaultG5() {
    this.g5 = new XS();
    this.g5.xoso = "----";
  }
  createDefaultG6() {
    let xs = new XS();
    xs.xoso = "----";
    this.g3.push(xs);
  }
  createDefaultG7() {
    this.g7 = new XS();
    this.g7.xoso = "---";
  }
  createDefaultG8() {
    this.g8 = new XS();
    this.g8.xoso = "---";
  }
}

class XSMTMNResult {
  currentXS: number;
  mDate: Date;
  mDateStr: string;
  mDay: number;
  resultLottery: Array<XSMTvMN> = [];
  constructor() {
    this.createDefaults();
  }
  createDefaults() {
    this.clearData();
    this.mDate = new Date();
    {
      let mXSMTvMN = new XSMTvMN();

      for (let i = 0; i < this.getNumberOfCitiesByDay(); i++) {
        this.resultLottery.push(mXSMTvMN);
      }
    }
    this.onDataChange();
  }
  onDataChange() {
    this.mDateStr = Utils.getViewDate(this.mDate);
  }
  addNewCity(tempXSMTvMN: XSMTvMN, tempCateId: number, isLiveNow: boolean) {
    if (isLiveNow) {
      // state = 0: LOADING, state = -1: NONE
      if (tempXSMTvMN.db.value != -1) {
        // do nothing
      }
      else if (tempXSMTvMN.g8.value == -1) {
        tempXSMTvMN.g8.state = 0;
        tempXSMTvMN.setDefaultValueFromG7();
      }
      else if (tempXSMTvMN.g7.value == -1) {
        tempXSMTvMN.g7.state = 0;
        tempXSMTvMN.setDefaultValueFromG6();
      }
      else if (tempXSMTvMN.g6.length < 3) {
        tempXSMTvMN.setDefaultValueFromG5();

        let xs = new XS();
        xs.state = 0;
        tempXSMTvMN.g6.push(xs);
      }
      else if (tempXSMTvMN.g5.value == -1) {
        tempXSMTvMN.g5.state = 0;
        tempXSMTvMN.setDefaultValueFromG4();
      }
      else if (tempXSMTvMN.g4.length < 7) {
        tempXSMTvMN.setDefaultValueFromG3();

        let xs = new XS();
        xs.state = 0;
        tempXSMTvMN.g4.push(xs);
      }
      else if (tempXSMTvMN.g3.length < 2) {
        tempXSMTvMN.setDefaultValueFromG2();

        let xs = new XS();
        xs.state = 0;
        tempXSMTvMN.g3.push(xs);
      }
      else if (tempXSMTvMN.g2.value == -1) {
        tempXSMTvMN.g2.state = 0;
        tempXSMTvMN.setDefaultValueFromG1();
      }
      else if (tempXSMTvMN.g1.value == -1) {
        tempXSMTvMN.g1.state = 0;
        tempXSMTvMN.createDefaultDB();
      }
      else if (tempXSMTvMN.db.value == -1) {
        tempXSMTvMN.db.state = 0;
      }
    }
    else {
      if (tempXSMTvMN.g8.value == -1) {
        tempXSMTvMN.g8 = new XS();
        tempXSMTvMN.g8.setXoso("--");
      }
      if (tempXSMTvMN.g7.value == -1) {
        tempXSMTvMN.g7 = new XS();
        tempXSMTvMN.g7.setXoso("---");
      }
      if (tempXSMTvMN.g5.value == -1) {
        tempXSMTvMN.g5 = new XS();
        tempXSMTvMN.g5.setXoso("----");
      }
      if (tempXSMTvMN.g2.value == -1) {
        tempXSMTvMN.g2 = new XS();
        tempXSMTvMN.g2.setXoso("-----");
      }
      if (tempXSMTvMN.g1.value == -1) {
        tempXSMTvMN.g1 = new XS();
        tempXSMTvMN.g1.setXoso("-----");
      }
      if (tempXSMTvMN.db.value == -1) {
        tempXSMTvMN.db = new XS();
        tempXSMTvMN.db.setXoso("------");
      }
      if (tempXSMTvMN.g6.length < 3) {
        let xs = new XS();
        xs.setXoso("----");
        for (let i = tempXSMTvMN.g6.length; i < 3; i++) {
          tempXSMTvMN.g6.push(xs)
        };
      }
      if (tempXSMTvMN.g4.length < 7) {
        let xs = new XS();
        xs.setXoso("-----");
        for (let i = tempXSMTvMN.g4.length; i < 7; i++) {
          tempXSMTvMN.g4.push(xs)
        };
      }
      if (tempXSMTvMN.g3.length < 2) {
        let xs = new XS();
        xs.setXoso("-----");
        for (let i = tempXSMTvMN.g3.length; i < 2; i++) {
          tempXSMTvMN.g3.push(xs)
        };
      }
    }
    this.resultLottery.push(tempXSMTvMN);
  }
  clearData() {
    this.resultLottery = [];
  }
  setDate(date: Date) {
    this.mDate = date;
    this.mDateStr = Utils.getViewDate(date); // fix me
    this.mDay = date.getDay();
  }
  setCurrentXS(XS: number) {
    this.currentXS = XS;
  }
  /** Số tỉnh quay theo ngày trong tuần xổ số miền Trung */
  getNumberOfCitiesByDay(): number {
    // XSMT: currentXS = 2, XSMN: currentXS = 3
    if (this.currentXS == 2) {
      if (this.mDay == 4) {
        return 3;
      }
      return 2;
    }
    else if (this.currentXS == 3) {
      if (this.mDay == 6) {
        return 4;
      }
      return 3;
    }
    else {
      return 3;
    }
  }
}

class LotoCity {
  city: string;
  city_id: number;
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
  lotoDau = [];
  lotoDuoi = [];
  constructor() {
    this.createDefault();
  }
  createDefault() {
    this.clearData();
    this.city = '...';
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
    this.lotoDau = [this.dau0, this.dau1, this.dau2, this.dau3, this.dau4, this.dau5, this.dau6, this.dau7, this.dau8, this.dau9];
    this.lotoDuoi = [...this.lotoDau];
  }
  clearData() {
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
    this.lotoDau = [[], [], [], [], [], [], [], [], [], []];
    this.lotoDuoi = [[], [], [], [], [], [], [], [], [], []];
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
    let first = Math.floor(+loto.code / 10);
    let last = +loto.code % 10;
    this.lotoDau[first].push(loto);
    this.lotoDuoi[last].push(loto);
  }
  setCity(city: string) {
    this.city = city;
  }
}

class LotoMTMN {
  lotoMTMN: Array<LotoCity> = [];
  constructor() {
    this.createDefault();
  }
  createDefault() {
    this.clearData();
    let lotoCity = new LotoCity();
    this.lotoMTMN.push(lotoCity);
    this.lotoMTMN.push(lotoCity);
    this.lotoMTMN.push(lotoCity);
  }
  clearData() {
    this.lotoMTMN = [];
  }
}

class Vietlott {
  amount: number;
  amountStr: string;
  mDate: Date;
  mDateStr: string;
  mDay: number;
  numberOfJackpot: number;
  numberOfPrize1: number;
  numberOfPrize2: number;
  numberOfPrize3: number;
  lottery: Array<XS> = [];

  constructor() {
    this.createDefault();
  }

  createDefault() {
    this.clearData();
    this.mDate = new Date();
    this.amount = 0;
    this.amountStr = '';
    this.numberOfJackpot = 0;
    this.numberOfPrize1 = 0;
    this.numberOfPrize2 = 0;
    this.numberOfPrize3 = 0;

    let xs: XS = new XS();
    xs.xoso = '--';
    for (let i = 0; i < 6; i++) {
      this.lottery.push(xs);
    }
    this.onDataChange()
  }
  clearData() {
    this.lottery = [];
  }
  onDataChange() {
    this.mDateStr = Utils.getViewDate(this.mDate);
  }
  setTime(time: string) {
    this.mDate = new Date(time);
    this.mDateStr = Utils.getViewDate(this.mDate);
    this.mDay = this.mDate.getDay();
  }
  setAmount(amount: number) {
    this.amount = amount;
    // let tempAmount: string = amount.toString();
    // let amountLen = tempAmount.length;

    // if (amountLen > 3) {
    //   let leftoversLen: number = amountLen % 3 == 0 ? 3 : (amountLen % 3);
    //   this.amountStr += tempAmount.substring(0, leftoversLen) + ',';

    //   for (let i = leftoversLen; i < amountLen; i = i + 3) {
    //     this.amountStr += tempAmount.substring(i, i + 3) + ',';
    //   }
    // }
    // else {
    //   this.amountStr = amount.toString();
    // }
    // this.amountStr = this.amountStr.substring(0, this.amountStr.length - 1);

    this.amountStr = Utils.nFormatter(amount, [" Tỷ", " Triệu", " Ngàn"]);
  }
}

@Component({
  selector: 'page-lottery-home',
  templateUrl: 'lottery-home.html',
})
export class LotteryHomePage {
  testTime = 0;

  contentForm = {};
  fakeLoto = [{ L: 21, N: 20 }, { L: 25, N: 21 }, { L: 14, N: 12 }, { L: 97, N: 15 }, { L: 65, N: 44 }, { L: 42, N: 123 }, { L: 78, N: 6666 }];
  datas = {
    mDate: new Date(),
    mDateStr: "",
    mTypeStr: "XSMB",
    mSelectedLotteryID: 0
  };

  categories: Array<LotteryCategory> = [];
  // mb
  mXSResult: XSResult;
  mLotoMB: LotoMB;
  mDienToan123: DienToan123;
  mDienToan636: DienToan636;
  mThanTai: ThanTai;
  mThongKe: LotteryStatistics;
  // mXSResult: XSResult = new XSResult();
  // mLotoMB: LotoMB = new LotoMB();
  // mDienToan123: DienToan123 = new DienToan123();
  // mDienToan636: DienToan636 = new DienToan636();
  // mThanTai: ThanTai = new ThanTai();
  // mThongKe: LotteryStatistics = new LotteryStatistics();
  AVAILABLE636: Array<number> = [3, 6]; // thu 4 va thu 7 hang tuan
  // mChart1 = { element: {} };
  // mChart2 = { element: {} };
  // mChart3 = { element: {} };
  // mChart4 = { element: {} };
  // mChart5 = { element: {} };
  // backgroundColors = ['#44b6ae'];

  // mtmn
  XSMTMN: XSMTMNResult = new XSMTMNResult();
  mLotoMTMN: LotoMTMN = new LotoMTMN();

  STATE_NONE: number = -1;
  STATE_LOADING: number = 0;
  filterLotoMT = 0;
  filterLotoMN = 0;

  // for live time
  interval: any;
  intervalMT: any;
  intervalMN: any;
  intervalDT123: any;
  intervalDT636: any;
  intervalTT: any;
  intervalVietlott: any;

  // mien trung mien nam
  cities: Array<number> = [];

  // vietlott

  mVietlott: Vietlott = new Vietlott();
  AVAILABLEVIETLOTT: Array<number> = [0, 3, 5];
  mFirstimeRequesting: boolean = true;

  vietlott = {
    amount: 0,
    time: new Date(),
    turn: '#.....',
    dateStr: '../../....',
    lottery: ['', '', '', '', '', '']
  }

  constructor(private platform: Platform,
    private navCtrl: NavController,
    private mLotteryDBCenter: LotteryDBCenter,
    private mStatusBar: StatusBar,
    private mMenuController: MenuController,
    private mLotteryConstants: LotteryConstants,
    private mLoadingController: LoadingController,
    private mDatePicker: DatePicker,
    private mLotteryHttpService: LotteryHttpService,
    private mAlertController: AlertController,
    private mNavParams: NavParams) {
    this.testTime = Date.now();
    this.mXSResult = new XSResult();
    this.mLotoMB = new LotoMB();
    this.mDienToan123 = new DienToan123();
    this.mDienToan636 = new DienToan636();
    this.mThanTai = new ThanTai();
    this.mThongKe = new LotteryStatistics();

    this.datas.mSelectedLotteryID = this.mLotteryConstants.XSMB;
    this.datas.mDate.setTime(Utils.getTimeBefore(this.datas.mDate, 1));
    let input = this.mNavParams.get("input");
    if (input) {
      this.datas.mDate = new Date(input.date);
      this.datas.mDateStr = input.date;
      this.datas.mSelectedLotteryID = input.category;
      this.datas.mTypeStr = input.type;
    }
  }
  // ngOnInit() {
  //   console.log("ngOnInit", Date.now() - this.testTime)
  // }
  // ionViewDidLoad() {
  //   console.log("ionViewDidLoad", Date.now() - this.testTime);
  // }
  // ngAfterViewChecked() {
  //   console.log("ngAfterViewChecked", Date.now() - this.testTime);
  // }
  ionViewDidEnter() {
     this.mMenuController.enable(true, "lottery");
    this.mStatusBar.overlaysWebView(false);
    this.mStatusBar.backgroundColorByHexString("#a00000");
    this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);
    // this.drawChart(this.mChart1, "mChart1", "Số lần xuất hiện", this.backgroundColors[0]);
    // this.drawChart(this.mChart2, "mChart2", "Số lần xuất hiện", this.backgroundColors[0]);
    // this.drawChart(this.mChart3, "mChart3", "Số ngày chưa ra", this.backgroundColors[0]);
    // this.drawChart(this.mChart4, "mChart4", "Số lần xuất hiện", this.backgroundColors[0]);
    // this.drawChart(this.mChart5, "mChart5", "Số lần xuất hiện", this.backgroundColors[0]);
    this.onClickLottery(null);
    //  this.mLotteryDBCenter.start();

    this.mThongKe = this.mLotteryDBCenter.mLotteryStatistics;
    if (this.mThongKe.nhieunhat.length == 0
      || this.mThongKe.itnhat.length == 0) {
      this.mLotteryDBCenter.requestLotteryStatistics();
    }
    if (this.mThongKe.logan.length == 0) {
      this.mLotteryDBCenter.requestLotteryLoganNow();
      return;
    }
  }

  ionViewDidLeave() {
    clearInterval(this.interval);
    clearInterval(this.intervalDT123);
    clearInterval(this.intervalDT636);
    clearInterval(this.intervalTT);
    clearInterval(this.intervalMT);
    clearInterval(this.intervalMN);
    clearInterval(this.intervalVietlott);
  }
  onClickOpenMenu() {
    this.mMenuController.open("lottery");
  }

  onClickLottery(lottery: LotteryType) {
    clearInterval(this.interval);
    clearInterval(this.intervalDT123);
    clearInterval(this.intervalDT636);
    clearInterval(this.intervalTT);
    clearInterval(this.intervalMT);
    clearInterval(this.intervalMN);
    clearInterval(this.intervalVietlott);

    if (lottery) {
      this.datas.mSelectedLotteryID = lottery.id;
      if (lottery.nearest) {
        this.datas.mDate.setTime(lottery.nearest.getTime());
      }
    }
    if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMB) {
      this.datas.mTypeStr = "XSMB";
    } else if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMT) {
      this.datas.mTypeStr = "XSMT";
    } else if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMN) {
      this.datas.mTypeStr = "XSMN";
    } else if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMN) {
      this.datas.mTypeStr = "XSMN";
    } else if (this.datas.mSelectedLotteryID == this.mLotteryConstants.VIETLOTT) {
      this.datas.mTypeStr = "XSMEGA";
      this.mFirstimeRequesting = true;
    }
    this.showHeader(true);
    this.onDataChange();
  }
  showHeader(show: boolean) {
    let headerContent = document.getElementById("a-header-content");
    if (headerContent) {
      if (show) {
        if (headerContent.classList.contains("a-header-content-hide")) {
          headerContent.classList.remove("a-header-content-hide");
        }
      } else {
        if (!headerContent.classList.contains("a-header-content-hide")) {
          headerContent.classList.add("a-header-content-hide");
        }
      }
    }
  }

  mLastScrollTop: number = 0;
  mScrollDelta: number = 0;
  onScroll(event) {
    let scrollContent = document.getElementById("a-scroll-content");
    if (scrollContent) {
      this.mScrollDelta = scrollContent.scrollTop - this.mLastScrollTop;
      this.mLastScrollTop = scrollContent.scrollTop;
      if (this.mLastScrollTop < 100) {
        this.showHeader(true);
      } else {
        if (Math.abs(this.mScrollDelta) > 6) {
          this.showHeader(this.mScrollDelta < 0);
        }
      }
    }
  }


  onClickPreviousDay() {
    this.datas.mDate.setTime(this.datas.mDate.getTime() - this.mLotteryConstants.DAY_IN_MILLISECONDS);
    this.onDataChange();
  }

  onClickNextDay() {
    this.datas.mDate.setTime(this.datas.mDate.getTime() + this.mLotteryConstants.DAY_IN_MILLISECONDS);
    // if (this.datas.mDate.getMilliseconds() > Date.now()) {
    //   this.datas.mDate.setMilliseconds(Date.now());
    // } else {
    //   this.onDataChange();
    // }
    if (this.datas.mDate.getTime() >= Date.now()) {
      this.datas.mDate.setTime(Date.now());
      this.showAlertInvalidDay();

    } else {
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
          if (this.datas.mDate.getTime() >= Date.now()) {
            this.showAlertInvalidDay();

          } else {
            this.onDataChange();
          }
        }
      },
      err => console.log('Error occurred while getting date: ', err));
  }
  onLoadingShown() {
    this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);
    this.getCategories();

    // MAKE REQUEST HERE
    if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMB) {
      this.currentLengthRL = 0;
      this.currentLengthDT123 = 0;
      this.currentLengthDT636 = 0;

      this.requestResultLotteryAndLotoMB(Utils.getRequestDate(this.datas.mDate));

      this.requestResultLotteryDienToan123(Utils.getRequestDate(this.datas.mDate));

      this.mDienToan636.setDate(this.datas.mDate);
      this.requestResultLotteryDienToan636(Utils.getRequestDate(this.datas.mDate));

      this.requestResultLotteryThanTai(Utils.getRequestDate(this.datas.mDate));

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

      if (this.isDienToan123LiveTime()) {
        clearInterval(this.intervalDT123);
        this.mDienToan123.createDefault();
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

      if (this.isDienToan636LiveTime() && !this.isDienToan636End()) {
        if (this.datas.mDate.getDay() == this.AVAILABLE636[0]
          || this.datas.mDate.getDay() == this.AVAILABLE636[1]) {
          clearInterval(this.intervalDT636);
          this.mDienToan636.createDefault();
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

      if (this.isThanTaiLiveTime() && !this.isThanTaiEnd()) {
        clearInterval(this.intervalTT);
        this.mThanTai.createDefault();
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
    else if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMT) {
      this.currentLengthMTMN = 0;

      this.XSMTMN.setDate(this.datas.mDate);
      this.XSMTMN.setCurrentXS(this.datas.mSelectedLotteryID);
      this.requestResultLotteryAndLotoMTMN(this.datas.mSelectedLotteryID, Utils.getRequestDate(this.datas.mDate));

      if (this.isTimeToLiveMT()) {
        clearInterval(this.intervalMT);

        this.XSMTMN.clearData();
        let mXSMTvMN = new XSMTvMN();
        this.XSMTMN.resultLottery.push(mXSMTvMN);
        this.XSMTMN.resultLottery[0].g8.state = this.STATE_LOADING;

        this.mLotoMTMN.clearData();
        let lotoCity = new LotoCity();
        this.mLotoMTMN.lotoMTMN.push(lotoCity);

        this.intervalMT = setInterval(() => {
          this.requestResultLotteryAndLotoMTMN(this.datas.mSelectedLotteryID, Utils.getRequestDate(this.datas.mDate));
        }, 4000);
      }
      else {
        clearInterval(this.intervalMT);
      }
    }
    else if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMN) {
      this.currentLengthMTMN = 0;

      this.XSMTMN.setDate(this.datas.mDate);
      this.XSMTMN.setCurrentXS(this.datas.mSelectedLotteryID);
      this.requestResultLotteryAndLotoMTMN(this.datas.mSelectedLotteryID, Utils.getRequestDate(this.datas.mDate));

      if (this.isTimeToLiveMN()) {
        clearInterval(this.intervalMN);

        this.XSMTMN.clearData();
        let mXSMTvMN = new XSMTvMN();
        this.XSMTMN.resultLottery.push(mXSMTvMN);
        this.XSMTMN.resultLottery[0].g8.state = this.STATE_LOADING;

        this.mLotoMTMN.clearData();
        let lotoCity = new LotoCity();
        this.mLotoMTMN.lotoMTMN.push(lotoCity);

        this.intervalMN = setInterval(() => {
          this.requestResultLotteryAndLotoMTMN(this.datas.mSelectedLotteryID, Utils.getRequestDate(this.datas.mDate));
        }, 4000);
      }
      else {
        clearInterval(this.intervalMN);
      }
    }
    else if (this.datas.mSelectedLotteryID == this.mLotteryConstants.VIETLOTT) {
      this.currentLengthVietlott = 0;

      this.mVietlott.mDay = this.datas.mDate.getDay();
      this.requestResultLotteryVietlott(Utils.getRequestDate(this.datas.mDate)); 
      if (this.isTimeToLiveVietlott() && !this.isLiveEndVietlott()) {
        if (this.datas.mDate.getDay() == this.AVAILABLEVIETLOTT[0]
          || this.datas.mDate.getDay() == this.AVAILABLEVIETLOTT[1]
          || this.datas.mDate.getDay() == this.AVAILABLEVIETLOTT[2]) {
          clearInterval(this.intervalVietlott);
          {
            this.mVietlott.lottery[0].state = this.STATE_LOADING;
          }
          this.intervalVietlott = setInterval(() => {
            this.requestResultLotteryVietlott(Utils.getRequestDate(this.datas.mDate));
          }, 4000);
        }
      }
      else {
        clearInterval(this.intervalVietlott);
      }
    }
    else {

    }
  }

  onDataChange() {
    this.showLoading();
    setTimeout(() => {
      this.onLoadingShown();
    }, 500);
  }

  // ------------------------------------------------------------------------ Request handle
  //----------------------------------------------- XSMB
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

        if (this.isLiveEnd()) {
          clearInterval(this.interval);
        }
      }, (error) => {
        console.log(error);
        this.mXSResult.createDefaults();
        this.mLotoMB.createDefault();
        this.closeLoading();
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

        if (this.isDienToan123End()) {
          clearInterval(this.intervalDT123);
        }
      }, (error) => {
        this.mDienToan123.createDefault();
        console.log(error);

      });
  }

  currentLengthDT636: number = 0;
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

        if (this.isDienToan636End()) {
          clearInterval(this.intervalDT636);
        }
      }, (error) => {
        console.log(error);
        this.mDienToan636.createDefault();

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

        if (this.isThanTaiEnd()) {
          clearInterval(this.intervalTT);
        }
      },
      (error) => {
        console.log(error);
        this.mThanTai.createDefault();
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

  // drawChart(object: any, id: string, label: string, backgroundColor: string) {
  //   let chartCanvas = document.getElementById(id);
  //   if (chartCanvas == undefined) return;
  //   let newElement = new Chart(chartCanvas, {
  //     type: 'bar',
  //     data: {
  //       labels: ["00", "19", "28", "37", "46", "55", "64", "73", "82", "91"],
  //       datasets: [
  //         {
  //           label: label,
  //           backgroundColor: backgroundColor,
  //           data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  //         }
  //       ]
  //     },
  //     options: {
  //       scales: {
  //         yAxes: [{
  //           ticks: {
  //             beginAtZero: true
  //           }
  //         }]
  //       },
  //       responsive: false,
  //       legend: {
  //         display: true,
  //         position: 'bottom'
  //       }
  //     }
  //   });
  //   object.element = newElement;//Sở dĩ phải làm vậy vì function js không truyền vào references của object mà truyền vào value.
  // }

  // redrawChart(object, data) { 
  //   object.element.data.labels = [];
  //   object.element.data.datasets[0].data = [];
  //   for (let lotoNumber of data) {
  //     object.element.data.labels.push(lotoNumber.loto);
  //     object.element.data.datasets[0].data.push(lotoNumber.frequency);
  //   }

  //   object.element.update();
  //   object.element.render(500);
  // }

  //----------------------------------------------- XSMT & XSMN
  isLiveEndMT(data) {
    if ((data.length >= this.XSMTMN.resultLottery.length * 18) || !this.isTimeToLiveMT()) {
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

  isLiveEndMN(data) {
    if ((data.length >= this.XSMTMN.resultLottery.length * 18) || !this.isTimeToLiveMN()) {
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
    this.mLotteryHttpService.requestCategoryResultLotteryAndLotoByType(selectedLotteryID, time, time, -1, 1).then(
      (data) => {
        if (data['status'] == ResponseCode.SUCCESS) {
          if (data['content'].length > 0) {
            let xsmtmn = data['content'][0].lottery;
            let lotoes = data['content'][0].loto;

            if (xsmtmn.length > this.currentLengthMTMN && lotoes.length > this.currentLengthMTMN) {
              this.currentLengthMTMN = xsmtmn.length;
              this.XSMTMN.clearData();
              this.mLotoMTMN.clearData();
              this.onRequestResultLotteryAndLotoMTMN(xsmtmn);
              this.onRequestLotoMTMN(lotoes);

              for (let i = 0; i < this.XSMTMN.resultLottery.length - 1; i++) {
                for (let j = i + 1; j < this.XSMTMN.resultLottery.length; j++) {
                  if (this.XSMTMN.resultLottery[i].city_id > this.XSMTMN.resultLottery[j].city_id) {
                    let t: XSMTvMN = this.XSMTMN.resultLottery[i];
                    this.XSMTMN.resultLottery[i] = this.XSMTMN.resultLottery[j];
                    this.XSMTMN.resultLottery[j] = t;
                  }
                }
              }

              for (let i = 0; i < this.mLotoMTMN.lotoMTMN.length - 1; i++) {
                for (let j = i + 1; j < this.mLotoMTMN.lotoMTMN.length; j++) {
                  if (this.mLotoMTMN.lotoMTMN[i].city_id > this.mLotoMTMN.lotoMTMN[j].city_id) {
                    let t: LotoCity = this.mLotoMTMN.lotoMTMN[i];
                    this.mLotoMTMN.lotoMTMN[i] = this.mLotoMTMN.lotoMTMN[j];
                    this.mLotoMTMN.lotoMTMN[j] = t;
                  }
                }
              }
            }
            else if (xsmtmn.length == 0) {
              if ((!this.isTimeToLiveMT() && this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMT)
                || (!this.isTimeToLiveMN() && this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMN)) {

                this.XSMTMN.createDefaults();
                this.mLotoMTMN.createDefault();
              }
            }
            this.closeLoading();

            if (this.isLiveEndMT(xsmtmn)) {
              clearInterval(this.intervalMT);
            }

            if (this.isLiveEndMN(xsmtmn)) {
              clearInterval(this.intervalMN);
            }
          }
          else if ((!this.isTimeToLiveMT() && this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMT)
            || (!this.isTimeToLiveMN() && this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMN)) {

            this.XSMTMN.createDefaults();
            this.mLotoMTMN.createDefault();
          }
        }

      }, (error) => {
        console.log(error);
        this.closeLoading();
      });

  }

  onRequestResultLotteryAndLotoMTMN(data) {
    let lotteries = data;
    let tempCateId: number = 0; //
    let tempXSMTvMN: XSMTvMN;
    lotteries.forEach(lottery => {
      if (lottery.cate_id != tempCateId) {
        if (tempCateId != 0) {
          if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMT) {
            this.XSMTMN.addNewCity(tempXSMTvMN, tempCateId, this.isTimeToLiveMT());
          }
          else if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMN) {
            this.XSMTMN.addNewCity(tempXSMTvMN, tempCateId, this.isTimeToLiveMN());
          }

          // handle unarranged lottery cate_id
          for (let i = 0; i < this.XSMTMN.resultLottery.length; i++) {
            if (lottery.cate_id == this.XSMTMN.resultLottery[i].city_id) {
              tempXSMTvMN = this.XSMTMN.resultLottery[i];
              this.XSMTMN.resultLottery.splice(i, 1);
              break;
            }
            else {
              tempXSMTvMN = new XSMTvMN();
              tempXSMTvMN.clearData();
            }
          }
        }
        else {
          tempXSMTvMN = new XSMTvMN();
          tempXSMTvMN.clearData();
        }

        tempCateId = lottery.cate_id;

        tempXSMTvMN.city_id = lottery.cate_id;
        for (let i = 0; i < this.categories.length; i++) {
          if (this.categories[i].id == lottery.cate_id) {
            tempXSMTvMN.city = this.categories[i].name;
            break;
          }
        }
      }

      if (lottery.rank == 0) {
        tempXSMTvMN.db.setResult(lottery);
      }
      else if (lottery.rank == 1) {
        tempXSMTvMN.g1.setResult(lottery);
      }
      else if (lottery.rank == 2) {
        tempXSMTvMN.g2.setResult(lottery);
      }
      else if (lottery.rank == 5) {
        tempXSMTvMN.g5.setResult(lottery);
      }
      else if (lottery.rank == 7) {
        tempXSMTvMN.g7.setResult(lottery);
      }
      else if (lottery.rank == 8) {
        tempXSMTvMN.g8.setResult(lottery);
      }
      else {
        let tempXS = new XS();
        tempXS.setResult(lottery);

        if (lottery.rank == 3) {
          tempXSMTvMN.g3.push(tempXS);
        }
        else if (lottery.rank == 4) {
          tempXSMTvMN.g4.push(tempXS);
        }
        else if (lottery.rank == 6) {
          tempXSMTvMN.g6.push(tempXS);
        }
      }
    });
    if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMT) {
      this.XSMTMN.addNewCity(tempXSMTvMN, tempCateId, this.isTimeToLiveMT());
    }
    else if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMN) {
      this.XSMTMN.addNewCity(tempXSMTvMN, tempCateId, this.isTimeToLiveMN());
    }
  }

  onRequestLotoMTMN(data) {
    let quantityOfCity: number = -1;
    let tempCateId: number = 0;
    let arrangedLoto: Array<Array<number>> = [];
    this.clearCities();
    data.forEach(element => {
      if (element.cate_id != tempCateId) {
        tempCateId = element.cate_id;
        quantityOfCity++;
        arrangedLoto[quantityOfCity] = [];
        this.cities.push(element.cate_id);
      }
      arrangedLoto[quantityOfCity].push(element.code);
    });

    // sap xep loto
    arrangedLoto.forEach(city => {
      for (let i = 0; i < city.length - 1; i++) {
        for (let j = i + 1; j < city.length; j++) {
          if (city[i] > city[j]) {
            let tempValue = city[i];
            city[i] = city[j];
            city[j] = tempValue;
          }
        }
      }
    })

    // check loto ve > 1 lan
    quantityOfCity = 0;
    this.mLotoMTMN.clearData();
    arrangedLoto.forEach(city => {
      let lotoBeforeShow = new Map<number, number>();
      city.forEach(element => {
        if (!lotoBeforeShow.has(element)) {
          lotoBeforeShow.set(element, 1);
        }
        else {
          lotoBeforeShow.set(element, lotoBeforeShow.get(element) + 1);
        }
      });

      let tempLotoCity = new LotoCity();
      tempLotoCity.clearData();
      lotoBeforeShow.forEach((frequency, code) => {
        let loto = new Loto();
        loto.setValue(frequency, code);
        tempLotoCity.setLoto(loto);
      });

      this.categories.forEach(city => {
        if (this.cities[quantityOfCity] == city.id) {
          tempLotoCity.setCity(city.name);
          tempLotoCity.city_id = city.id;
        }
      });
      // tempLotoCity.setCity(this.cities[quantityOfCity]);
      this.mLotoMTMN.lotoMTMN.push(tempLotoCity);

      quantityOfCity++;
    })
    this.filterLotoMT = this.mLotoMTMN.lotoMTMN[0].city_id;
    this.filterLotoMN = this.mLotoMTMN.lotoMTMN[0].city_id;
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
    this.mLotoMB.setLotoDauDuoi();

    lotoBeforeShow.forEach((frequency, code) => {
      let loto = new Loto();
      loto.setValue(frequency, code);
      this.mLotoMB.setLoto(loto);
    });

    this.mLotoMB.setLotoDauDuoi();

    // this.redrawChart(this.mChart1, this.mThongKe.nhieunhat);
    // this.redrawChart(this.mChart2, this.mThongKe.itnhat);
    // this.redrawChart(this.mChart3, this.mThongKe.logan);
    // this.redrawChart(this.mChart4, this.mThongKe.dauloto);
    // this.redrawChart(this.mChart5, this.mThongKe.duoiloto);
  }

  //----------------------------------------------- VIETLOTT
  isLiveEndVietlott() {
    if (this.mVietlott.lottery[5].value > -1 || !this.isTimeToLiveVietlott()) {
      return true;
    }
    return false;
  }

  isTimeToLiveVietlott() {
    let currentTime = new Date();
    if (this.datas.mDateStr == Utils.getViewDate(currentTime)
      && currentTime.getHours() == 18
      && currentTime.getMinutes() >= 0
      && currentTime.getMinutes() <= 30) {
      return true;
    }
    return false;
  }

  currentLengthVietlott: number = 0;
  requestResultLotteryVietlott(time) {
    if (this.mFirstimeRequesting == true) {
      this.mVietlott.createDefault();
      this.mFirstimeRequesting = false;
      this.mLotteryHttpService.requestLotteryCateIdNearestDay(40).then((nearest) => {
        if (nearest['status'] == ResponseCode.SUCCESS) {
          this.requestVietlottJackpot(nearest['time']);
          this.requestVietlottLottery(nearest['time']);
        }
        if (this.isLiveEndVietlott()) {
          clearInterval(this.intervalVietlott);
        }
      }, (error) => {
        console.log(error);

      });
    }
    else {
      // if (this.mVietlott.mDay == this.AVAILABLEVIETLOTT[0]
      //   || this.mVietlott.mDay == this.AVAILABLEVIETLOTT[1]
      //   || this.mVietlott.mDay == this.AVAILABLEVIETLOTT[2]) {
      //   this.mVietlott.createDefault();
      //   this.requestVietlottJackpot(time);
      //   this.requestVietlottLottery(time);
      // }
      // else {
      //   this.closeLoading();
      // }
      this.mVietlott.createDefault();
      this.requestVietlottJackpot(time);
      this.requestVietlottLottery(time);
    }
  }

  requestVietlottJackpot(time) {
    let startDate = new Date(time);
    if (!this.isTimeToLiveVietlott || this.isLiveEndVietlott)
      startDate.setDate(startDate.getDate() - 3);
    this.mLotteryHttpService.requestVietlottJackpot(Utils.getRequestDate(startDate), time).then((data) => {
      if (data['status'] == ResponseCode.SUCCESS) {
        if (data['content'].length > 0) {
          let info = data['content'][data['content'].length - 1];
          this.mVietlott.setTime(info.time);
          this.mVietlott.setAmount(info.amount);
          this.mVietlott.numberOfJackpot = info.giai_jackpot;
          this.mVietlott.numberOfPrize1 = info.giai_nhat;
          this.mVietlott.numberOfPrize2 = info.giai_nhi;
          this.mVietlott.numberOfPrize3 = info.giai_ba;
          this.datas.mDate  = new Date(info.time);
          this.datas.mDateStr = Utils.getViewDate(this.datas.mDate);
        }
      }
    }, (error) => {
      console.log(error);
      this.closeLoading();
    });
  }

  requestVietlottLottery(time) {
    let startDate = new Date(time);
    if (!this.isTimeToLiveVietlott || this.isLiveEndVietlott)
      startDate.setDate(startDate.getDate() - 3);
    this.mLotteryHttpService.requestCategoryResultLotteryByCateId(40, Utils.getRequestDate(startDate), time, -1, 1).then((data) => {
      if (data['status'] == ResponseCode.SUCCESS) {
        if (data['content'].length > 0) {
          if (data['content'][data['content'].length - 1].lottery.length > this.currentLengthVietlott) {
            this.currentLengthVietlott = data['content'][data['content'].length - 1].lottery.length;

            this.mVietlott.clearData();
            this.onRequestVietlott(data);
          }
        }
        this.closeLoading();
      }
    }), (error) => {
      console.log(error);
      this.closeLoading();
    }
  }

  onRequestVietlott(data) {
    let vietlott = data['content'][0].lottery;

    vietlott.forEach(element => {
      let xs = new XS();
      xs.setResult(element);
      this.mVietlott.lottery.push(xs);
    });

    if (vietlott.length == 1) {
      let xs = new XS();
      xs.state = this.STATE_LOADING;
      this.mVietlott.lottery.push(xs);
      xs = new XS();
      this.mVietlott.lottery.push(xs);
      this.mVietlott.lottery.push(xs);
      this.mVietlott.lottery.push(xs);
      this.mVietlott.lottery.push(xs);
    }
    else if (vietlott.length == 2) {
      let xs = new XS();
      xs.state = this.STATE_LOADING;
      this.mVietlott.lottery.push(xs);
      xs = new XS();
      this.mVietlott.lottery.push(xs);
      this.mVietlott.lottery.push(xs);
      this.mVietlott.lottery.push(xs);
    }
    else if (vietlott.length == 3) {
      let xs = new XS();
      xs.state = this.STATE_LOADING;
      this.mVietlott.lottery.push(xs);
      xs = new XS();
      this.mVietlott.lottery.push(xs);
      this.mVietlott.lottery.push(xs);
    }
    else if (vietlott.length == 4) {
      let xs = new XS();
      xs.state = this.STATE_LOADING;
      this.mVietlott.lottery.push(xs);
      xs = new XS();
      this.mVietlott.lottery.push(xs);
    }
    else if (vietlott.length == 5) {
      let xs = new XS();
      xs.state = this.STATE_LOADING;
      this.mVietlott.lottery.push(xs);
      xs = new XS();
    }
  }

  // ------------------------------------------------------------------------ End request handle

  OnClickViewByCategory(cate_id: number, name: string) {
    let id = this.datas.mSelectedLotteryID;
    if (this.datas.mSelectedLotteryID == this.mLotteryConstants.XSMB) {
      this.navCtrl.push("HomeXsmbBycategory", { cate_id, id, name });
    }
    else {
      this.navCtrl.push("HomeXsmtXsmnBycategory", { cate_id, id, name });
    }
    clearInterval(this.interval);
    clearInterval(this.intervalDT123);
    clearInterval(this.intervalDT636);
    clearInterval(this.intervalTT);
    clearInterval(this.intervalMT);
    clearInterval(this.intervalMN);
    clearInterval(this.intervalVietlott);
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
      this.mLoading.present().then();
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
