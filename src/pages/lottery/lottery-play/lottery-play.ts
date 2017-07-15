import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { Utils } from '../../../providers/app-utils';
import { LotteryDBCenter } from '../../../providers/lottery/lottery';
export class LotoVipNumber {
  value: number;
  text: string;

  constructor() {
    this.reset();
  }
  reset() {
    this.value = -1;
    this.text = "?";
  }
  setValue(val: number) {
    if (val < 0) val = 0;
    if (val > 99) val = 99;
    this.value = val;
    this.text = ((val < 10) ? "0" : "") + val;
  }
}

export class LotoPlayed {
  recordId: number;
  code: string;
  time: string;
  moneyBet: number;
  type: number;
  constructor(recordId?: number, code?: string, time?: string, moneyBet?: number, type?: number) {
    this.recordId = recordId || 0;
    this.code = code || "";
    this.time = time || "";
    this.moneyBet = moneyBet || 0;
    this.type = type || 0;
  }
}

export class PlayMode {
  id: number = 0;
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
 
@Component({
  selector: 'page-lottery-play',
  templateUrl: 'lottery-play.html'
})
export class LotteryPlayPage {
  amount = 4;
  vips: Array<LotoVipNumber> = [];
  commons: Array<LotoVipNumber> = [];
  lotosPlayed: Array<LotoPlayed> = [];
  playModes: Array<PlayMode> = [];
  showingData = [
    {
      id: 0,
      lotoPlayed: []
    },
    {
      id: 1,
      lotoPlayed: []
    },
    {
      id: 2,
      lotoPlayed: []
    },
    {
      id: 3,
      lotoPlayed: []
    },
    {
      id: 4,
      lotoPlayed: []
    }
  ]
  inputs = {
    start: "2017-01-01",
    category: {
      id: 1,
      name: "Truyền thống"
    },
    playMode: {
      id: 0,
      name: "",
      numberOfCode: 0,
      moneyPerPoint: 0,
      pointRatio: 0,
      moneyRatio: 0
    }
  };
  breakTime = 18 * 3600 + 30 * 60;
  breakHour = 18;
  breakMinute = 30;
  incomingDate = new Date();

  constructor(public mAlertController: AlertController, public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController, public loadingCtrl: LoadingController, private mLotteryDBCenter: LotteryDBCenter) {
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

    let hour = this.incomingDate.getHours();
    let minute = this.incomingDate.getMinutes();
    if (hour * 3600 + minute * 60 >= this.breakTime) {
      //time for nextday
      this.incomingDate.setDate(this.incomingDate.getDate() + 1);
    } 
    this.inputs.start = Utils.getViewDate(this.incomingDate);
    this.inputs.playMode = this.playModes[1];
    this.refreshData();
  }
 
  onClickVipNumber(number: LotoVipNumber) {
    if (number.value != -1) {
      let alert = this.mAlertController.create({
        title: "Oops !",
        message: "Bạn đã cầu số vip của ngày hôm nay rồi!",
        buttons: [{
          text: "Ok"
        }]
      });
      alert.present();
      return;
    }

    let alert = this.mAlertController.create({
      title: "Cầu số vips",
      message: "Bạn cần 100 xu để cầu số vips. Số tiền này sẽ được hoàn trả lại gấp đôi nếu hôm nay số vip không về.",
      buttons: [{
        text: "Huỷ"
      }, {
        text: "100 Xu",
        handler: () => {
          this.doRequestVipNumbers();
        }
      }]
    });
    alert.present();
  }

  onClickAddNumber() {
  }

  doRequestVipNumbers() {
    for (let n of this.vips) {
      let found: boolean = true;
      let val: number = Utils.randInt(0, 99);
      while (found) {
        found = false;
        for (let v of this.vips) {
          if (v.value == val) {
            val = Utils.randInt(0, 99);
            found = true;
            break;
          }
        }
      }
      n.setValue(val);
    }
  }

  onClickTopNumber() {
  }

  onClickTopNumbers() {
    this.navCtrl.push("LotteryTopGuessPage");
  }

  onClickPlayType() {
    let alert = this.mAlertController.create();
    alert.setTitle("Chọn loại chơi");
    let index = 0;
    for (let playMode of this.playModes) {
      alert.addInput({
        type: 'radio',
        label: playMode.name,
        value: playMode.id + '',
        checked: playMode.id == this.inputs.playMode.id
      });
      index++;
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let id: number = parseInt(data);
          for (let type of this.playModes) {
            if (type.id == id) {
              this.inputs.playMode = type;
              this.onClickPlay();
              break;
            }
          }
        }
      }
    });
    alert.present();
  }

  refreshData() {
    let startDate = new Date(this.incomingDate.getTime() - 24 * 3600 * 2 * 1000);
    this.lotosPlayed = [];
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
    this.mLotteryDBCenter.getLotteryHttpService().requestTopLotoPlayed(null).then(data => {
      this.onResponseGetTopLotoPlayed(data);
    })
  }
  onResponseGetTopLotoPlayed(data) {
    if (data.content.length > 0) {
      this.commons = [];
      data.content.forEach(elm => {
        if (this.commons.length < 4) {
          let loto = new LotoVipNumber();
          loto.setValue(+elm.code);
          this.commons.push(loto);
        }
      });

    }
  }

  onResponseGetLotoOnline(data) { 
    if (data.content == undefined) return;
    let prevDayEndTime = new Date(this.incomingDate);
    prevDayEndTime.setDate(this.incomingDate.getDate() - 1);
    prevDayEndTime.setHours(this.breakHour);
    prevDayEndTime.setMinutes(this.breakMinute);
    prevDayEndTime.setSeconds(0);

    let prevDayStartTime = new Date(prevDayEndTime);
    prevDayStartTime.setDate(prevDayEndTime.getDate() - 1);
    let pendingData = data.content.filter((elm) => {
      return (elm.state == 0 && (new Date(elm.time).getTime() > prevDayEndTime.getTime()));
    })
    pendingData.forEach(element => {
      this.lotosPlayed.push(new LotoPlayed(element.id, element.code, element.time, element.money_bet, element.type));
    });
    for (let i = 0; i < this.showingData.length; i++) {
      this.showingData[i].lotoPlayed = this.lotosPlayed.filter(elm => {
        return elm.type == i;
      })
      this.showingData[i].lotoPlayed.sort((a, b) => {
        return +a.code - +b.code;
      })
    } 
    let processedData = data.content.filter((elm) => {
      return (elm.state != 0 && (new Date(elm.time).getTime() <= prevDayEndTime.getTime()) && (new Date(elm.time).getTime() >= prevDayStartTime.getTime()));
    })
  }
  onClickPlay() {
    let modal = this.modalCtrl.create("PlayLotoOnlinePage", { playMode: this.inputs.playMode, title: this.inputs.playMode.name + " online" });
    modal.present();
    modal.onDidDismiss((data, role) => {
      this.refreshData();
    });
  }

  notifyDoing() {
    let alert = this.mAlertController.create({
      title: "Opps",
      message: "Chức năng đang được phát triển, vui lòng thử lại sau",
      buttons: [{
        text: "OK"
      }]
    });
    alert.present();
  }

  deletePlayedLoto(loto: LotoPlayed) {
    let alert = this.mAlertController.create({
      message: `Bạn chắc chắn muốn xóa bộ số ${loto.code}? `,
      buttons: [{
        text: "Cancel"
      }, {
        text: "OK",
        handler: () => {
          this.mLotteryDBCenter.getLotteryHttpService().requestLotoOnlineDelete(loto.recordId).then((data) => {
            this.onResponseDeleteLoto(data);
            this.refreshData();
          }, error => {
            this.refreshData();
          })
        }
      }]
    });
    alert.present();
  }

  onResponseDeleteLoto(data) {
    if (data.status == 1 && !isNaN(data.money))
      this.mLotteryDBCenter.mUser.setMoney(data.money);
  }

  getSystemDate2(date: Date) {
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return date.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  }

  getRandomColor(index) {
    let colorArr = ["#e13838", "#488aff", "#2ec95c", '#f53d3d', '#277dad', '#71a71d'];
    return colorArr[index % colorArr.length];
  }
  getClass(code) {
    code = code.trim();
    let lotos = code.split(',');
    if (lotos.length > 1) return 'square square-' + lotos.length;
    return 'a-number-know';
  }

  getCode(code) {
    code = code.trim();
    let lotos = code.split(',');
    let result = "";
    for (let i = 0; i < lotos.length; i++) {
      result += `<span>${lotos[i]}</span>`
    }
    return result;
  }
  openLotoDetailModal(loto) {
    let modal = this.modalCtrl.create('ModalLotoDetailPage', { loto: loto });
    modal.present();
  }

  getPoint(type: number, moneyBet: number) {
    let mode = this.playModes.find(elm => {
      return elm.id == type;
    })
    return Math.floor(moneyBet / mode.moneyPerPoint);
  }

  showDetail(loto: LotoPlayed) {
    let mode = this.playModes.find(elm => {
      return elm.id == loto.type;
    })
    let alert = this.mAlertController.create({
      title: `Bộ số ` + loto.code,
      message: `
      Loại: ${mode.name} <br/>
      Số điểm đánh: ${Math.floor(loto.moneyBet / mode.moneyPerPoint)} đ <br/>
      Số tiền đánh: ${loto.moneyBet} xu`,
      buttons: [{
        text: "Đóng"
      }]
    })
    alert.present();
  }

}
