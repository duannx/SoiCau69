import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { LotteryDBCenter } from '../../../providers/lottery/lottery';
import { DatePicker } from '@ionic-native/date-picker';
export class Cycle {
  dau_date: string;
  dau_gan: number;
  dau_gan_max: number;
  duoi_date: string;
  duoi_gan: number;
  duoi_gan_max: number;
  tong_date: string;
  tong_gan: number;
  tong_gan_max: number;
  value: number;
  constructor(dau_date?: string, dau_gan?: number, dau_max_gan?: number, duoi_date?: string, duoi_gan?: number,
    duoi_max_gan?: number, tong_date?: string, tong_gan?: number, tong_max_gan?: number, value?: number) {
    this.dau_date = dau_date || "2017-01-01";
    this.dau_gan = dau_gan || 0;
    this.dau_gan_max = dau_max_gan || 0;
    this.duoi_date = duoi_date || "2017-01-01";
    this.duoi_gan = duoi_gan || 0;
    this.duoi_gan_max = duoi_max_gan || 0;
    this.tong_date = tong_date || "2017-01-01";
    this.tong_gan = tong_gan || 0;
    this.tong_gan_max = tong_max_gan || 0;
    this.value = value || 0;
  }
}
@IonicPage()
@Component({
  selector: 'page-special-prize-cycle',
  templateUrl: 'special-prize-cycle.html',
})
export class SpecialPrizeCyclePage {
  startDate = "2016-01-01";
  endDate = new Date();
  typeFilter = "1";
  category = {
    id: 1,
    name: "Truyền thống"
  }
  datas = [
  ]
  segmentTop = 0;
  segmentHeight = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public mAlertController: AlertController,
    public mLotteryDBCenter: LotteryDBCenter, public loadingCtrl: LoadingController, private mDatePicker: DatePicker) {
    this.mLotteryDBCenter.getCategories();
    if (this.mLotteryDBCenter.categories.length > 0) {
      this.category = this.mLotteryDBCenter.categories[0];
    }
    this.refreshData();
  }

  ionViewDidEnter() {
    let segmentHeader = document.getElementById("segment-header");
    this.segmentTop = segmentHeader.offsetTop;
    this.segmentHeight = segmentHeader.offsetHeight;
    this.setTouchMoveEvent();
    this.onInputChanged();
  }

  onInputChanged() {
    let loading = this.loadingCtrl.create({
      duration: 15000,
      content: "Đang tải dữ liệu"
    })
    loading.present();
    //Refresh data
    this.refreshData();
    let startTime = Date.now();
    this.mLotteryDBCenter.getLotteryHttpService().requestSpecialPrizeCycle(this.startDate, "2017-06-14", this.category.id).then(data => {
      this.onResponseSpecialPrize(data);
      loading.dismiss();
    }, error => {
      loading.dismiss();
    })
  }

  onResponseSpecialPrize(data) {
    this.datas = data.content;
  }

  refreshData() {
    this.datas = [];
    for (let i = 0; i <= 9; i++) {
      let elm = new Cycle();
      this.datas.push(elm);
    }
  }

  setTouchMoveEvent() {
    setTimeout(() => {
      //Khi scroll đến vị trí, header segment và table sẽ fixtop
      let mainHeaderHeight = 56;
      let segmentHeader = document.getElementById("segment-header");
      let tableHeaders = document.getElementsByClassName("table-header");
      let tableHeaderElement = [];
      for (let i = 0; i < tableHeaders.length; i++) {
        tableHeaderElement.push(<HTMLElement>tableHeaders[i]);
      }
      let mainContent = <HTMLDivElement>document.getElementById("main-content");
      changeClass(this.segmentTop);
      mainContent.addEventListener('scroll', (event) => {
        changeClass(this.segmentTop);
      })
      function changeClass(segmentTop) {
        if (mainContent.scrollTop >= -mainHeaderHeight + segmentTop) {
          segmentHeader.classList.add("fixed-top");
          tableHeaderElement.forEach(element => {
            element.classList.add("fixed-top");
          });
        } else {
          segmentHeader.classList.remove("fixed-top");
          tableHeaderElement.forEach(element => {
            element.classList.remove("fixed-top");
          });
        }
      }
    }, 200);
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
  //Click nút chọn ngày
  onClickStartDate() {
    this.mDatePicker.show({
      date: this.endDate,
      mode: 'date',
      maxDate: new Date()
    }).then(
      date => {
        if (date) {
          this.endDate = date;
          this.onInputChanged();
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
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
