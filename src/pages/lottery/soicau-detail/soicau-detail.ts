import { Component, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Alert, AlertController, LoadingController } from 'ionic-angular';
import { LotteryDBCenter, LotoNumber } from "../../../providers/lottery/lottery";
export class LotoPosition {
  i1: number = 0;
  i2: number = 0;
  constructor(i1?: any, i2?: any) {
    this.i1 = i1 || 0;
    this.i2 = i2 || 0;
  }
  toString() {
    return this.i1 + " - " + this.i2;
  }
  toShortString() {
    return this.i1 + "-" + this.i2;
  }
}
export class LotoNumberSoicau extends LotoNumber {
  positions: Array<LotoPosition> = [];
  constructor() {
    super();
    this.positions = [];
  }
}
@IonicPage()
@Component({
  selector: 'page-soicau-detail',
  templateUrl: 'soicau-detail.html',
})
export class SoicauDetailPage {
  selectedPositon: LotoPosition;
  lotoSoicau: LotoNumberSoicau;
  inputs: any = {};
  endDate: Date;
  lotteryResult = [];
  prize1 = 0;
  prize2 = 0;
  prizePos1 = 0;
  prizePos2 = 0;
  pos1 = 0;
  pos2 = 0;
  prevCount = 0;
  count = 0;
  @ViewChildren('dynamicCol') cols: QueryList<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mViewController: ViewController, public mAlertController: AlertController,
    public loadingCtrl: LoadingController, public mLotteryDBCenter: LotteryDBCenter) {
    let data = this.navParams.get("loto");
    let inputs = this.navParams.get("inputs");
    let date = this.navParams.get("date");
    if (data != null) {
      this.lotoSoicau = data;
      this.selectedPositon = this.lotoSoicau.positions[0];
    }
    if (inputs != null) {
      this.inputs = inputs;
    }
    if (date != null) {
      this.endDate = date;
    }
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() { 
    let startDate = new Date(this.endDate);
    let endDate = new Date(this.endDate);

    let elo = 1;
    if (this.inputs.category.id != 1) elo = 30;
    startDate.setDate(endDate.getDate() - this.inputs.days * elo - 2 * elo); 
    let loading = this.loadingCtrl.create({
      content: "Đang tải dữ liệu",
      duration: 5000,
      dismissOnPageChange: true
    })
    loading.present();
    this.mLotteryDBCenter.getLotteryHttpService().requestCategoryResultLotteryAndLotoByCateId(this.inputs.category.id, this.getSystemDate2(startDate), this.getSystemDate2(endDate), -1, 1).then(
      (data) => {
        if (data['content'].length > 0) {
          this.onResponseGetNormalLottery(data);
        }
        loading.dismiss();
      }, (error) => {
        console.log(error);
        loading.dismiss();
      });


  }
  ngAfterViewChecked() { 
    this.cols.forEach((col, index) => {

      let elm: HTMLElement = col.nativeElement;
      let numCol = +elm.getAttribute("num-col");
      let numColOfFirstRow = +(numCol / 2).toFixed();
      let numColOfSecondRow = numCol - numColOfFirstRow;
      if (index % numCol < numColOfFirstRow) {
        elm.setAttribute("col-" + 12 / numColOfFirstRow, "");
        elm.classList.add("a-border-bottom");
      }
      else elm.setAttribute("col-" + 12 / numColOfSecondRow, "");
    })
  }
  onResponseGetNormalLottery(data) {

    data.content.reverse().forEach(elm => {
      if (elm.lottery.length > 0 && this.lotteryResult.length <= this.inputs.days) {
        //lottery
        let normalLottery = [
          { title: "ĐB", prize: "Đặc biệt", code: [], numOfPrize: 0, numbOfDigit: 5, rank: 0 },
          { title: "G-1", prize: "Giải nhất", code: [], numOfPrize: 0, numbOfDigit: 5, rank: 1 },
          { title: "G-2", prize: "Giải nhì", code: [], numOfPrize: 0, numbOfDigit: 5, rank: 2 },
          { title: "G-3", prize: "Giải ba", code: [], numOfPrize: 0, numbOfDigit: 5, rank: 3 },
          { title: "G-4", prize: "Giải tư", code: [], numOfPrize: 0, numbOfDigit: 4, rank: 4 },
          { title: "G-5", prize: "Giải năm", code: [], numOfPrize: 0, numbOfDigit: 4, rank: 5 },
          { title: "G-6", prize: "Giải sáu", code: [], numOfPrize: 0, numbOfDigit: 3, rank: 6 },
          { title: "G-7", prize: "Giải bảy", code: [], numOfPrize: 0, numbOfDigit: 2, rank: 7 },
          { title: "G-8", prize: "Giải tám", code: [], numOfPrize: 0, numbOfDigit: 2, rank: 8 },
        ];
        let time = elm.time;
        let lotos = [];
        elm.lottery.forEach(element => {
          let rank = +element.rank;
          normalLottery[rank].code.push(element.code);
          normalLottery[rank].numOfPrize += 1;
          normalLottery[rank].numbOfDigit = element.code.length;
          lotos.push(element.code.substr(element.code.length - 2, 2));
        });
        lotos.sort((a, b) => {
          return +a - +b;
        })
        this.lotteryResult.push({ lottery: normalLottery, time: time, lotos: lotos });
      }
    });
    this.onInputChanged();
  }

  onInputChanged() {
    this.prize1 = 0;
    this.prize2 = 0;
    this.prizePos1 = 0;
    this.prizePos2 = 0;
    this.pos1 = 0;
    this.pos2 = 0;
    this.prevCount = 0;
    this.count = 0;

    let lottery = this.lotteryResult[0].lottery;
    while (true) {
      this.prevCount = this.count;
      this.count += lottery[this.prize1].numOfPrize * lottery[this.prize1].numbOfDigit;
      if (this.count >= this.selectedPositon.i1 + 1) {
        this.prizePos1 = Math.floor((this.selectedPositon.i1 - this.prevCount) / lottery[this.prize1].numbOfDigit)
        let surplus = (this.selectedPositon.i1 + 1 - this.prevCount) % lottery[this.prize1].numbOfDigit;
        this.pos1 = surplus == 0 ? lottery[this.prize1].numbOfDigit - 1 : surplus - 1;
        break;
      }
      this.prize1++;
    }

    this.prevCount = 0;
    this.count = 0;
    while (true) {
      this.prevCount = this.count;
      this.count += lottery[this.prize2].numOfPrize * lottery[this.prize2].numbOfDigit;
      if (this.count >= this.selectedPositon.i2 + 1) {
        this.prizePos2 = Math.floor((this.selectedPositon.i2 - this.prevCount) / lottery[this.prize2].numbOfDigit)
        let surplus = (this.selectedPositon.i2 + 1 - this.prevCount) % lottery[this.prize2].numbOfDigit;
        this.pos2 = surplus == 0 ? lottery[this.prize2].numbOfDigit - 1 : surplus - 1;
        break;
      }
      this.prize2++;
    }
    this.lotteryResult.map(elm => {
      let digit1 = elm.lottery[this.prize1].code[this.prizePos1].substr(this.pos1, 1);
      let digit2 = elm.lottery[this.prize2].code[this.prizePos2].substr(this.pos2, 1);
      elm.nextDayLoto = [];
      elm.nextDayLoto.push(digit1 + '' + digit2);
      if (digit1 != digit2) elm.nextDayLoto.push(digit2 + '' + digit1);
    })
  }

  onClickPickPosition() {
    let alert: Alert = this.mAlertController.create();
    alert.setTitle("Chọn vị trí");
    let index = 0;
    for (let position of this.lotoSoicau.positions) {
      alert.addInput({
        type: 'radio',
        label: position.toString(),
        value: position.toShortString(),
        checked: this.selectedPositon.toShortString() == position.toShortString()
      });
      index++;
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          for (let position of this.lotoSoicau.positions) {
            if (position.toShortString() == data) {
              this.selectedPositon = position;
              this.onInputChanged();
              break;
            }
          }
        }
      }
    });
    alert.present();

  }
  getCodeFormated(prize, prizePos, code) {
    let result = "";
    if (prize == this.prize1 && prizePos == this.prizePos1) {
      if (prize == this.prize2 && prizePos == this.prizePos2) {
        let arr = code.split('');
        for (let i = 0; i < arr.length; i++) {
          if (i == this.pos1) result += `<span class='red'>${arr[i]}</span>`;
          else {
            if (i == this.pos2) result += `<span class='red'>${arr[i]}</span>`;
            else
              result += arr[i]
          };
        }
        return result;
      } else {
        let arr = code.split('');
        for (let i = 0; i < arr.length; i++) {
          if (i == this.pos1) result += `<span class='red'>${arr[i]}</span>`;
          else result += arr[i];
        }
        return result;
      }

    }

    if (prize == this.prize2 && prizePos == this.prizePos2) {
      let arr = code.split('');
      for (let i = 0; i < arr.length; i++) {
        if (i == this.pos2) result += `<span class='red'>${arr[i]}</span>`;
        else result += arr[i];
      }
      return result;
    }
    return code;
  }

  getLotoFormated(index, loto) {
    if (index == this.inputs.days) return loto;
    if (this.lotteryResult[index + 1].nextDayLoto.indexOf(loto) > -1) return `<span class='red'>${loto}</span>`;
    return loto;
  }

  onClickBack() {
    this.mViewController.dismiss({
      //prams go here
    });
  }
  getSystemDate2(date: Date) {
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return date.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  }

  getViewDate(dateString: string) {
    let date = new Date(dateString);
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return (d < 10 ? "0" : "") + d + "/" + (m < 10 ? "0" : "") + m + "/" + date.getFullYear();
  }

}
