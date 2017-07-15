import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Utils } from '../../../providers/app-utils';
import { LotoNumber, LotteryDBCenter } from '../../../providers/lottery/lottery';


/** Đối tượng chứa kết quả về lotos của 1 ngày */
class LotoResult {
  date: Date;
  mDateStr: string;
  numbers: Array<LotoNumber> = [];
  constructor() {
    this.numbers = [];
    this.date = new Date();
    this.onDataChanged();
  }
  onDataChanged() {
    this.mDateStr = Utils.getViewDate(this.date);
  }
}

@IonicPage()
@Component({
  selector: 'page-loto-vip',
  templateUrl: 'loto-vip.html',
})
export class LotoVipPage {
  STATE_LOCK: number = 0;
  STATE_UNLOCK: number = 1;
  STATE_UNLOCK_FAIL: number = 2;
  STATE_UNLOCK_SUCCESS: number = 3;
  mDate: Date = new Date();
  vips: Array<LotoNumber> = [];
  lotoResults: Array<LotoResult> = [];
  constructor(
    public mLotteryDBCenter: LotteryDBCenter,
    private mLoadingController: LoadingController,
    private mAlertController: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.createFakeDatas();
  }
  createFakeDatas() {
    while (this.vips.length < 4) {
      let vipNumber = new LotoNumber();
      vipNumber.loto = "?";
      this.vips.push(vipNumber);
    }
    for (let i = 0; i < 5; i++) {
      let lotoResult: LotoResult = new LotoResult();
      lotoResult.date.setTime(Utils.getTimeBefore(this.mDate, i + 1));
      for (let j = 0; j < 4; j++) {
        let lotoNumber = new LotoNumber();
        let found: boolean = true;
        let val: number = Utils.randInt(0, 99);
        while (found) {
          found = false;
          for (let v of lotoResult.numbers) {
            if (v.value == val) {
              val = Utils.randInt(0, 99);
              found = true;
              break;
            }
          }
        }
        lotoNumber.setValue(val);
        lotoNumber.setState((Utils.randInt(0, 99) % 3 == 0) ? this.STATE_UNLOCK_SUCCESS : this.STATE_UNLOCK_FAIL);
        lotoResult.numbers.push(lotoNumber);
      }
      lotoResult.onDataChanged();
      this.lotoResults.push(lotoResult);
    }

  }

  onClickVipNumber(number: LotoNumber) {
    if (number.state != this.STATE_LOCK) {
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
    let moneyRequire: number = 100;
    // check money 
    {
      if (this.mLotteryDBCenter.mUser.getMoney() < moneyRequire) {
        let alert = this.mAlertController.create({
          title: "Oops !",
          message: "Vui lòng nạp thêm tiền để tiếp tục, bạn cần " + moneyRequire + " xu để cầu số vips ",
          buttons: [{
            text: "Ok"
          }]
        });
        alert.present();
        return;
      }

    }

    let alert = this.mAlertController.create({
      title: "Cầu số vips",
      message: "Bạn cần " + moneyRequire + " xu để cầu số vips. Số tiền này sẽ được hoàn trả lại gấp đôi nếu hôm nay số vip không về.",
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
  doRequestVipNumbers() {
    let loading = this.mLoadingController.create({
      content: "Vui lòng đợi",
      spinner: "ios",
      duration: 1000
    });
    loading.present();
    loading.onDidDismiss(() => {
      this.onResponseVipNumbers({});
    });
  }
  onResponseVipNumbers(data) {
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
      n.setState(this.STATE_UNLOCK);
    }
  }
  onClickLotoResult(lotoResult: LotoResult) {
    this.navCtrl.push("XsmbPage", {
      date: lotoResult.date
    });
  }
}
