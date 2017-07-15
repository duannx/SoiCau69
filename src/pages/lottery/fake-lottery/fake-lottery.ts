import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { Loto, LotoDay, LotteryDBCenter } from '../../../providers/lottery/lottery';
@IonicPage()
@Component({
  selector: 'page-fake-lottery',
  templateUrl: 'fake-lottery.html',
})
export class FakeLotteryPage {
  northLottery = [
    { title: "ĐB", code: [], numOfPrize: 1, numbOfDigit: 5 },
    { title: "G-1", code: [], numOfPrize: 1, numbOfDigit: 5 },
    { title: "G-2", code: [], numOfPrize: 2, numbOfDigit: 5 },
    { title: "G-3", code: [], numOfPrize: 6, numbOfDigit: 5 },
    { title: "G-4", code: [], numOfPrize: 4, numbOfDigit: 4 },
    { title: "G-5", code: [], numOfPrize: 6, numbOfDigit: 4 },
    { title: "G-6", code: [], numOfPrize: 3, numbOfDigit: 3 },
    { title: "G-7", code: [], numOfPrize: 4, numbOfDigit: 2 },
  ];
  northLoto = {
    lotos: [],
    head: [],
    back: []
  }
  vietlottArr = [];
  interVal: any;
  type = 1;
  category = {
    name: "Truyền thống",
    id: 1
  }
  isStart = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public mAlertController: AlertController,
    private mMenuController: MenuController, public mLotteryDBCenter: LotteryDBCenter) {
    this.northLottery.map((elm) => {
      for (let i = 0; i < elm.numOfPrize; i++) {
        let code = ""
        for (let j = 0; j < elm.numbOfDigit; j++) {
          code += "*";
        }
        elm.code.push(code);
      }
      return elm;
    })
    for (let i = 1; i <= 6; i++)this.vietlottArr.push('--');
  }

  ionViewDidLoad() {

  }

  rollingData() {
    if (this.type == 1) {
      this.northLottery.map(element => {
        for (let j = 0; j < element.code.length; j++) {
          let newcode = "";
          for (let i = 0; i < element.numbOfDigit; i++) {
            newcode += Math.floor(Math.random() * 10);
          }
          element.code[j] = newcode;
        }

        return element;
      });
    }


    if (this.type == 4) {
      this.vietlottArr = this.vietlottArr.map(element => {
        return Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10);
      });
    }

  }
  start() {
    this.isStart = true;
    this.northLoto = {
      lotos: [],
      head: [[], [], [], [], [], [], [], [], [], []],
      back: [[], [], [], [], [], [], [], [], [], []]
    }
    clearInterval(this.interVal);
    this.interVal = setInterval(() => {
      this.rollingData();
    }, 200);

  }
  end() {
    this.isStart = false;
    clearInterval(this.interVal);

    this.northLottery.forEach(element => {
      element.code.forEach(code => {
        this.northLoto.lotos.push(code.slice(code.length - 2, code.length));
      });
    });
    this.northLoto.lotos.sort((a, b) => {
      return +a - +b;
    })
    this.northLoto.lotos.forEach(loto => {
      let num = parseInt(loto);
      let head = Math.floor(num / 10);
      let back = num % 10;
      this.northLoto.head[head].push(loto);
      this.northLoto.back[back].push(loto);
    });
  }

  onClickPickCategory() {
    let alert = this.mAlertController.create();
    alert.setTitle("Chọn tỉnh");

    alert.addInput({
      type: 'radio',
      label: "Truyền thống",
      value: 1 + '',
      checked: 1 == this.category.id
    });
    alert.addInput({
      type: 'radio',
      label: "Vietlott",
      value: 4 + '',
      checked: 4 == this.category.id
    });
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let id: number = parseInt(data);
          this.type = id;
          if (id == 1) {
            this.category = {
              name: "Truyền thống",
              id: 1
            }
          }
          if (id == 4) {
            this.category = {
              name: "Vietlott",
              id: 4
            }
          }
        }
      }
    });
    alert.present();
  }
  onClickOpenMenu() {
    this.mMenuController.open("lottery");
  }
  getLottery(start, end) {
    let result = "";
    for (let i = start; i <= end; i++) {
      result += this.northLottery[i];
    }
    return result;
  }
}
