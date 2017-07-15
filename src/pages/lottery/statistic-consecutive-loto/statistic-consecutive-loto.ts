import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { LotteryDBCenter } from '../../../providers/lottery/lottery';
//Class lô rơi
class ConsecutiveLoto {
  code: string;                 //Loto
  bestStreak: number;           //Số ngày về liên tiếp lớn nhất
  numOfMissDay: number;         //Số ngày chưa ra
  numOfFireTime: number;        //Số lần ra
  lastFireDay: string;          //Ngày ra cuối
  streakIncludeToday: number    //Số ngày ra liên tiếp tính cả hôm  nay
  lastOfBestStreak: string
  constructor(code?: any, bestStreak?: any, numOfMissDay?: any, numOfFireTime?: any, lastFireDay?: any, streakIncludeToday?: any) {
    this.code = code || "00";
    this.bestStreak = bestStreak || 0;
    this.numOfMissDay = numOfMissDay || 0;
    this.numOfFireTime = numOfFireTime || 0;
    this.lastFireDay = lastFireDay || "01/01/2017";
    this.streakIncludeToday = streakIncludeToday || 0;
    this.lastOfBestStreak = "xxx";
  }
}

@IonicPage()
@Component({
  selector: 'page-statistic-consecutive-loto',
  templateUrl: 'statistic-consecutive-loto.html',
})

export class StatisticConsecutiveLotoPage {
  count = 30;
  category = {
    id: 1,
    name: "Truyền thống"
  }
  typeSelect = 1;
  datas: Array<ConsecutiveLoto> = [new ConsecutiveLoto()];
  showData: Array<ConsecutiveLoto> = [new ConsecutiveLoto()];
  constructor(public navCtrl: NavController, public navParams: NavParams, public mAlertController: AlertController,
    public mLotteryDBCenter: LotteryDBCenter, public loadingCtrl: LoadingController) {
  }

  ionViewDidEnter() {
    this.onInputChanged();
  }

  onInputChanged() {
    //Refresh data
    this.datas = [];
    for (let i = 0; i < 100; i++) {
      let code = i < 10 ? ("0" + i) : (i + "")
      this.datas.push(new ConsecutiveLoto(code, 0, 0, 0, "01/01/2000", 0));
    }
    let loading = this.loadingCtrl.create({
      duration: 5000,
      content: "Đang tải dữ liệu"
    })
    loading.present();
    this.mLotteryDBCenter.getLotteryHttpService().requestCategoryResultLotteryOption(null, this.category.id, null, null, "loto", null, this.count).then(data => {
      this.onResponseCategoryResultLotteryOption(data);
      loading.dismiss();
    }, error => {
      loading.dismiss();
    })
  }
  onTypeChanged() {
    this.showData = [];
    let tempArray = [...this.datas];
    if (this.typeSelect == 1) {//lô rơi đến hôm nay
      tempArray.sort((a, b) => {
        return b.streakIncludeToday - a.streakIncludeToday;
      });
      this.showData = tempArray.filter(elm => {
        return elm.streakIncludeToday >= 2;
      })
    } else {
      if (this.typeSelect == 2) {//lô xuất hiện liên tiếp
        tempArray.sort((a, b) => {
          return b.bestStreak - a.bestStreak;
        });
        this.showData = tempArray.filter(elm => {
          return elm.bestStreak >= 3;
        });
      } else {//lô xuất hiện nhiều
        tempArray.sort((a, b) => {
          return b.numOfFireTime - a.numOfFireTime;
        });
        this.showData = tempArray.splice(0, 27);
      }
    }
  }

  onResponseCategoryResultLotteryOption(data) {
    if (data.content.length <= 0) return;
    this.datas.forEach(loto => {
      let currentSreak = 0;
      let isFired = false;
      let lastFireDay = new Date("2000-01-01").getTime();
      data.content.forEach(day => {
        isFired = false;
        day.loto.forEach(element => {
          if (element.code == loto.code) {
            loto.numOfFireTime++;
            isFired = true;
            if (new Date(day.time).getTime() > lastFireDay) {
              lastFireDay = new Date(day.time).getTime();
              loto.lastFireDay = this.getViewDate(new Date(lastFireDay).toDateString());
            };
          }
        });
        if (!isFired) currentSreak = 0;
        else {
          currentSreak++;
          if (currentSreak > loto.bestStreak) {
            loto.bestStreak = currentSreak;
            loto.lastOfBestStreak = day.time;
          }
        }
      });
      loto.numOfMissDay = Math.floor((new Date().getTime() - lastFireDay) / 1000 / 60 / 60 / 24);

      //Tính số ngày ra liên tiếp kể cả hôm nay
      if (Math.floor((new Date(data.content[data.content.length - 1].time).getTime() - lastFireDay) / 1000 / 60 / 60 / 24) == 0) {
        loto.streakIncludeToday = 1;
        for (let i = data.content.length - 2; i >= 0; i--) {
          let day = data.content[i];

          if (day.loto.findIndex(elm => { return elm.code == loto.code }) > -1) {
            loto.streakIncludeToday++;
          } else break;
        }
      }
    });
    this.onTypeChanged();
  }

  onClickPickCategory() {
    let alert = this.mAlertController.create();
    alert.setTitle("Chọn tỉnh");
    let index = 0;
    for (let category of this.mLotteryDBCenter.categories) {
      alert.addInput({
        type: 'radio',
        label: category.name,
        value: category.id + '',
        checked: category.id == this.category.id
      });
      index++;
    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let id: number = parseInt(data);
          for (let category of this.mLotteryDBCenter.categories) {
            if (category.id == id) {
              this.category = category;
              this.onInputChanged();
              break;
            }
          }
        }
      }
    });
    alert.present();
  }

  onClickPickWeeks() {

    let alert = this.mAlertController.create();
    alert.setTitle("Chọn thời thống kê muốn xem");

    alert.addInput({
      type: 'radio',
      label: "Những bộ số xuất hiện liên tiếp và kết thúc vào ngày hôm nay",
      value: "1",
      checked: this.typeSelect == 1
    });
    alert.addInput({
      type: 'radio',
      label: "Những bộ số xuất hiện liên tiếp",
      value: "2",
      checked: this.typeSelect == 2
    });
    alert.addInput({
      type: 'radio',
      label: "27 bộ số xuất hiện nhiều nhất trong 30 lần quay trước",
      value: "3",
      checked: this.typeSelect == 3
    });
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let value: number = parseInt(data);
          if (value != this.typeSelect) {
            this.typeSelect = value;
            this.onTypeChanged();
          }
        }
      }
    });
    alert.present();

  }

  onClickBack() {
    this.navCtrl.pop();
  }


  getViewDate(dateString: string) {
    let date = new Date(dateString);
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return (d < 10 ? "0" : "") + d + "/" + (m < 10 ? "0" : "") + m + "/" + date.getFullYear();
  }

  getSystemDate(dateString: string) {
    let date = new Date(dateString);
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return date.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  }

  getSystemDate2(date: Date) {
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return date.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  }
}
