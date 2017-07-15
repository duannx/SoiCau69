import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { LotteryDBCenter } from '../../../providers/lottery/lottery';

export class PlayMode {
  id: number = 0;//type
  name: string = "";
  numberOfCode: number = 0;
  moneyPerPoint: number = 0;
  pointRatio: number = 0;
  moneyRatio: number = 0;
  constructor(id?: number, name?: string, numberOfCode?: number, moneyPerPoint?: number, pointRatio?: number, moneyRatio?: number) {
    this.id = id || 0;
    this.name = name || "";
    this.numberOfCode = numberOfCode || 0;
    this.moneyPerPoint = moneyPerPoint || 0;
    this.pointRatio = pointRatio || 0;
    this.moneyRatio = moneyRatio || 0;
  }
}

export class LotoPlayed {
  recordId: number;
  code: string;
  time: string;
  moneyBet: number;
  moneyWin: number;
  state: number;
  result: number;
  type: number;
  numberOfCode: number;

  constructor(recordId?: number, code?: string, time?: string, moneyBet?: number, moneyWin?: number, state?: number, result?: number, type?: number) {
    this.recordId = recordId || 0;
    this.code = code || "";
    this.time = time || "";
    this.moneyBet = moneyBet || 0;
    this.moneyWin = moneyWin || 0;
    this.state = state || 0;
    this.result = result || 0;
    this.type = type || 0;
    this.numberOfCode = this.code.split(',').length;
  }
}

export class LotoVipNumber {
  value: number;
  code: string;

  constructor(text?: string) {
    if (text != null && text != "" && text != undefined) {
      this.code = text;
      this.value = +text;
    } else
      this.reset();
  }
  reset() {
    this.value = -1;
    this.code = "?";
  }
  setValue(val: number) {
    if (val < 0) val = 0;
    if (val > 99) val = 99;
    this.value = val;
    this.code = ((val < 10) ? "0" : "") + val;
  }
}
 
@Component({
  selector: 'page-loto-online-statistic',
  templateUrl: 'loto-online-statistic.html',
})
export class LotoOnlineStatisticPage {
  showingDatas = []
  statisticMode = 1;
  dayCompute = 10;
  breakTime = 18 * 3600 + 30 * 60;
  breakHour = 18;
  breakMinute = 30;
  incomingDate = new Date();
  playModes: Array<PlayMode> = [];

  today = new Date();
  upcomingDate = new Date();

  lotosVip: Array<LotoVipNumber> = [new LotoVipNumber(), new LotoVipNumber(), new LotoVipNumber(), new LotoVipNumber()];
  lotosTopPlayed: Array<LotoVipNumber> = [new LotoVipNumber(), new LotoVipNumber(), new LotoVipNumber(), new LotoVipNumber()];
  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController,
    private mLotteryDBCenter: LotteryDBCenter, public alertCtrl: AlertController) {
    let de_ratio = this.mLotteryDBCenter.appConfig.de_ratio.split(':');
    let diem_lo_ratio = this.mLotteryDBCenter.appConfig.diem_lo_ratio.split(':');
    let loxien3_ratio = this.mLotteryDBCenter.appConfig.loxien3_ratio.split(':');
    let loxien4_ratio = this.mLotteryDBCenter.appConfig.loxien4_ratio.split(':');
    let loxien_ratio = this.mLotteryDBCenter.appConfig.loxien_ratio.split(':');
    let lo_ratio = this.mLotteryDBCenter.appConfig.lo_ratio.split(':');

    this.playModes = [
      new PlayMode(0, "Đề", 1, 1, +de_ratio[1], +de_ratio[1]),
      new PlayMode(1, "Loto bạch thủ", 1, +diem_lo_ratio[1], +lo_ratio[1], +lo_ratio[1] / +lo_ratio[0]),
      new PlayMode(2, "Lô xiên 2", 2, 1, +loxien_ratio[1], +loxien_ratio[1]),
      new PlayMode(3, "Lô xiên 3", 3, 1, +loxien3_ratio[1]),
      new PlayMode(4, "Lô xiên 4", 4, 1, +loxien4_ratio[1])
    ]
    this.upcomingDate.setDate(this.upcomingDate.getDate() + 1);
    this.refreshData();
    this.getLotoTopPlayed();
    this.getLotoVip();
  }

  refreshData() {
    let startDate = new Date(this.incomingDate.getTime() - 24 * 3600 * this.dayCompute * 1000);
    let loading = this.loadingCtrl.create({
      duration: 5000,
      content: "Đang tải dữ liệu"
    })
    loading.present();
    this.mLotteryDBCenter.getLotteryHttpService().requestLotoOnlineQueryIgnoreNull(this.getSystemDate2(startDate), this.getSystemDate2(this.incomingDate), null, null).then(data => {
      this.onResponseGetLotoOnline(data);
      loading.dismiss();
    }, error => {
      loading.dismiss();
    })
  }

  getLotoVip() {
    let loading = this.loadingCtrl.create({
      content: "Xin đợi",
      duration: 5000,
      dismissOnPageChange: true
    })
    loading.present();
    this.mLotteryDBCenter.getLotteryHttpService().requestLotoRecommendQuery(1, this.getSystemDate2(this.today), this.getSystemDate2(this.upcomingDate)).then(data => {
      this.onResponseGetLotoVip(data);
      loading.dismiss();
    }, error => {
      console.log('get loto vip error', error);
      loading.dismiss();
    });
  }

  onResponseGetLotoVip(data) { 
    if (data.content.length > 0) {
      data.content.reverse();
      let currentDate = new Date('2017-01-01');
      for (let i = 0; i < data.content.length; i++) {
        let element = data.content[i];
        if (element.content.length > 0) {
          if (new Date(element.time) >= currentDate) {
            this.lotosVip = [];
            currentDate = new Date(element.time);
            element.content.forEach(elm => {
              this.lotosVip.push(new LotoVipNumber(elm.c));
            });
          } else {
            break;
          }
        }
      }
    }

  }

  getLotoTopPlayed() {
    this.mLotteryDBCenter.getLotteryHttpService().requestTopLotoPlayed(null).then(data => {
      this.onResponseLotoTopPlayed(data);
    }, error => {
      console.log('get loto top played', error);
    });
  }

  onResponseLotoTopPlayed(data) { 
    if (data.content.length > 0) {
      this.lotosTopPlayed = [];
      data.content.forEach(element => {
        if (this.lotosTopPlayed.length < 4)
          this.lotosTopPlayed.push(new LotoVipNumber(element.code));
      });
    }
  }

  onResponseGetLotoOnline(data) { 
    this.showingDatas = [];
    if (data.content == undefined) return;
    let prevDayEndTime = new Date(this.incomingDate);
    prevDayEndTime.setHours(this.breakHour);
    prevDayEndTime.setMinutes(this.breakMinute);
    prevDayEndTime.setSeconds(0);
    let currentDay = {
      time: '',
      lotosPlayed: []
    }
    if (prevDayEndTime.getTime() > this.incomingDate.getTime()) {
      prevDayEndTime.setDate(this.incomingDate.getDate() - 1);
      currentDay.time = this.getViewDate(this.incomingDate);
    }
    let prevDayStartTime = new Date(prevDayEndTime);
    prevDayStartTime.setDate(prevDayEndTime.getDate() - 1);
    let todayDatas = data.content.filter((elm) => {
      return (new Date(elm.time).getTime() > prevDayEndTime.getTime());
    })
    todayDatas.forEach(element => {
      currentDay.lotosPlayed.push(new LotoPlayed(element.id, element.code, element.time, element.money_bet, element.money_win, element.state, element.result, element.type));
    });
    currentDay.lotosPlayed.sort((a, b) => {
      return (+a.type - +b.type);
    })

    this.showingDatas.push(currentDay);

    for (let i = 0; i < this.dayCompute; i++) {
      currentDay = {
        time: '',
        lotosPlayed: []
      }
      if (i != 0) {
        prevDayEndTime.setDate(prevDayEndTime.getDate() - 1);
        prevDayStartTime.setDate(prevDayStartTime.getDate() - 1);
      }
      currentDay.time = this.getViewDate(prevDayEndTime);
      let currentData = data.content.filter((elm) => {
        return ((new Date(elm.time).getTime() > prevDayStartTime.getTime()) && (new Date(elm.time).getTime() <= prevDayEndTime.getTime()));
      })
      currentData.forEach(element => {
        currentDay.lotosPlayed.push(new LotoPlayed(element.id, element.code, element.time, element.money_bet, element.money_win, element.state, element.result, element.type));
      });
      currentDay.lotosPlayed.sort((a, b) => {
        if (a.type == b.type)
          return +a.code - +b.code;
        return a.type - b.type;
      })
      this.showingDatas.push(currentDay);
    }


    let pendingData = data.content.filter((elm) => {
      return (elm.state == 0 && (new Date(elm.time).getTime() > prevDayEndTime.getTime()));
    }) 
    //Fake data
    // this.showingDatas = [{
    //   time: '10-10-2010',
    //   lotosPlayed: [
    //     new LotoPlayed(1, "10", "", 100, 200, 1, 1, 0),
    //     new LotoPlayed(1, "11", "", 100, 200, 1, 1, 1),
    //     new LotoPlayed(1, "12,13", "", 100, 200, 1, 1, 2),
    //     new LotoPlayed(1, "10,11,12", "", 100, 200, 1, 1, 3),
    //     new LotoPlayed(1, "10,11,12,13", "", 100, 200, 1, 1, 4),
    //   ]
    // }]
  }

  getSystemDate2(date: Date) {
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return date.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  }

  getViewDate(date: Date) {
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return (d < 10 ? "0" : "") + d + " - " + (m < 10 ? "0" : "") + m + " - " + date.getFullYear();
  }

  getPoint(money: number, type: number) {
    return Math.floor(money / this.playModes.find(elm => { return elm.id == type }).moneyPerPoint);
  }
  getTotal(day: any) {
    let sum = 0;
    let code = "";
    let state = 0;
    day.lotosPlayed.forEach(element => {
      state += element.state;
      if (+element.moneyWin > 0) {
        sum += +element.moneyWin;
        if (element.numberOfCode == 1) {
          code += `<span class="code win code-small">${element.code}</span>`
        } else {
          let blockCode = "";
          let codes = element.code.split(',');
          for (let i = 0; i < codes.length; i++) {
            blockCode += `<span class="code win code-small">${codes[i]}</span>`;
          }
          code += `<div class="code-block">${blockCode}</div>`;
        }
      }
    });
    if (state == 0) return `<span class='margin-3'>Chưa có kết quả</span>`
    if (sum == 0) return `<span class='margin-3'>Lãi 0 Xu</span> `;
    return `Ăn ${code} được tổng cộng <span class="red">${sum}</span> xu`
  }
}
