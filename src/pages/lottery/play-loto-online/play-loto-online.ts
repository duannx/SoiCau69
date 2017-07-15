import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { LotteryDBCenter } from '../../../providers/lottery/lottery';
export class Loto {
  loto: string;
  value: number;
  selected: boolean;
  point: number;
  toString = function () { return this.loto; }
  constructor() {
    this.loto = "00";
    this.value = 0;
    this.selected = false;
    this.point = 0;
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

@IonicPage()
@Component({
  selector: 'page-play-loto-online',
  templateUrl: 'play-loto-online.html',
})
export class PlayLotoOnlinePage {
  category = {
    id: 1,
    title: "Truyền thống"
  }
  moneyUnit: string = "Xu";
  title: string = "Chọn bộ số";

  playMode: PlayMode = {
    name: "Đề",
    id: 0,
    numberOfCode: 1,
    moneyPerPoint: 1,
    pointRatio: 70,
    moneyRatio: 70
  };
  lotos: Array<Loto> = [];
  lotos_selected: Array<Loto> = [];
  totalPoint: number = 1;
  totalMoney: number = 0;
  minBetValue = 0;
  maxBetValue = 1000000;
  constructor(public mViewController: ViewController, public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public mLotteryDBCenter: LotteryDBCenter) {
    this.createLotos();

    let title = this.navParams.get("title");
    if (title) this.title = title;

    let playMode = this.navParams.get("playMode");
    if (playMode) {
      this.playMode = playMode;
    }

  }


  createLotos() {
    for (let i = 0; i <= 99; i++) {
      let loto = new Loto();
      loto.loto = ((i < 10) ? "0" : "") + i;
      loto.value = i;
      loto.point = 1;
      this.lotos.push(loto);
    }
  }

  onClickBack() {
    this.mViewController.dismiss({
      lotos: this.lotos_selected,
      cancel: true
    });
  }

  onClickLoto(loto) {
    if (this.playMode.numberOfCode != 1 && !loto.selected && this.lotos_selected.length == this.playMode.numberOfCode) {
      let alert = this.alertCtrl.create({
        title: "Luật chơi",
        message: `Bạn chỉ có thể chọn ${this.playMode.numberOfCode} bộ số`,
        buttons: [{ text: "OK" }]
      })
      alert.present();
      return;
    }
    loto.selected = !loto.selected;
    this.lotos_selected = [];
    for (let lt of this.lotos) {
      if (lt.selected) this.lotos_selected.push(lt);
    }
    this.onInputChange();
  }

  onClickPlay() {
    let alert = this.alertCtrl.create({
      message: `Tổng số tiền phải nằm trong khoảng ${this.minBetValue} - ${this.maxBetValue} ${this.moneyUnit}`,
      title: "Không hợp lê",
      buttons: [{ text: "Đóng", role: "cancel" }]
    })
    if (this.lotos_selected.length < this.playMode.numberOfCode) {
      alert.setMessage(`Bạn phải chọn ít nhất ${this.playMode.numberOfCode} bộ số`);
      alert.present();
      return
    };
    if (this.totalMoney > this.maxBetValue || this.totalMoney < this.minBetValue) {
      alert.present();
      return;
    } 
    if (this.totalMoney > this.mLotteryDBCenter.mUser.getMoney()) {
      alert.setMessage(`Bạn không đủ ${this.moneyUnit}. Vui lòng nạp thêm.`);
      alert.present();
      return;
    }

    if (this.playMode.numberOfCode == 1) {
      alert.setTitle("");
      alert.setMessage(`Bạn chắc chắn muốn đặt cược bộ số ${this.lotos_selected.join(',')} với tổng số tiền ${this.totalMoney} ${this.moneyUnit}?`);
      alert.addButton({
        text: "OK",
        handler: () => {

          this.lotos_selected.forEach(element => {
            this.mLotteryDBCenter.getLotteryHttpService()
              .requestLotoOnlineAdd(this.category.id, this.playMode.id, element.loto, element.point * this.playMode.moneyPerPoint).then(data => {
                this.onResponseLotoOnlineAdd(data);
              }, error => {
              })
          });
          this.onClickBack();
        }
      })
      alert.present();

    } else {

      alert.setTitle("");
      alert.setMessage(`Bạn chắc chắn muốn đặt cược bộ số ${this.lotos_selected.join(',')} với tổng số tiền ${this.totalMoney} ${this.moneyUnit}?`);
      alert.addButton({
        text: "OK",
        handler: () => {
          this.mLotteryDBCenter.getLotteryHttpService()
            .requestLotoOnlineAdd(this.category.id, this.playMode.id, this.lotos_selected.join(','), this.totalPoint).then(data => {
              this.onResponseLotoOnlineAdd(data);
            }, error => {
              console.log("error", error);
            });
          this.onClickBack();
        }
      })
      alert.present();
    }

  }

  onResponseLotoOnlineAdd(data) { 
    if (data.status == 1 && !isNaN(data.money))
      this.mLotteryDBCenter.mUser.setMoney(data.money);
  }

  onInputChange() {
    if (this.playMode.numberOfCode != 1 && this.lotos_selected.length != this.playMode.numberOfCode) {
      this.totalMoney = 0;
      return;
    }

    if (this.playMode.numberOfCode == 1) {
      this.totalPoint = 0;
      for (let i = 0; i < this.lotos_selected.length; i++) {
        this.totalPoint += +this.lotos_selected[i].point;
      }
    }
    this.totalMoney = this.totalPoint * this.playMode.moneyPerPoint;
  }
  onPointChange(loto: Loto, input) {
    if (loto.point < 0) {
      loto.point = 1;
      input.value = 1;
    }
    this.onInputChange();
  }

  onTotalPointChange(input) {
    if (this.totalPoint < 0) {
      this.totalPoint = 1;
      input.value = 1;
    }
    this.onInputChange();
  }
  getRandomColor(index) {
    let colorArr = ["#e13838", "#488aff", "#2ec95c", '#f53d3d', '#277dad', '#71a71d'];
    return colorArr[index % colorArr.length];
  }
}
