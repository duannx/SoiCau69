import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { LotteryDBCenter } from '../../../providers/lottery/lottery';
@IonicPage()
@Component({
  selector: 'page-special-prize-table',
  templateUrl: 'special-prize-table.html',
})
export class SpecialPrizeTablePage {
  category = {
    id: 1,
    name: "Truyền thống"
  }
  times: Array<number> = [2000, 2001, 2002, 2003, 2014, 2015, 2016, 2017];
  quarterFilter = "1";
  quarters = ["Quý 1", "Quý 2", "Quý 3", "Quý 4"];
  days = [];
  numbers = [1, 2, 3];
  datas = {
    year: 2017,
    m1: [],
    m2: [],
    m3: [],
    m4: [],
    m5: [],
    m6: [],
    m7: [],
    m8: [],
    m9: [],
    m10: [],
    m11: [],
    m12: []
  }
  segmentTop = 0;
  segmentHeight = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public mAlertController: AlertController,
    public mLotteryDBCenter: LotteryDBCenter, public loadingCtrl: LoadingController) {
    this.mLotteryDBCenter.getCategories();
    if (this.mLotteryDBCenter.categories.length > 0) {
      this.category = this.mLotteryDBCenter.categories[0];
    }
    for (let i = 1; i <= 31; i++) {
      this.days.push(i);
    }
    this.times = [];
    for (let i = 2000; i <= new Date().getFullYear(); i++) {
      this.times.push(i);
    }
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
      duration: 5000,
      content: "Đang tải dữ liệu"
    })
    loading.present();
    //Refresh data
    this.refreshData();
    this.mLotteryDBCenter.getLotteryHttpService().requestSpecialPrize(this.category.id, this.datas.year.toString()).then(data => {
      this.onResponseSpecialPrize(data);
      loading.dismiss();
    }, error => {
      loading.dismiss();
    })

  }

  onResponseSpecialPrize(data) {
    let date = new Date();
    if (data.content.length > 0)
      data.content[0].date.forEach(element => {
        date = new Date(element.date);
        let day = date.getDate(); //start from 1
        let month = date.getMonth(); //start from 0
        this.datas["m" + (month + 1)][day - 1] = element.val;
      });
  }

  refreshData() {
    for (let i = 1; i <= 12; i++) {
      this.datas["m" + i] = [];
      for (let j = 1; j <= 31; j++) {
        this.datas["m" + i].push("");
      }
    }
  }

  setTouchMoveEvent() {
    setTimeout(() => {
      //Khi scroll đến vị trí, header segment và table sẽ fixtop
      let mainHeaderHeight = 56;
      let segmentHeader = document.getElementById("segment-header");
      let tableHeaders = document.getElementsByClassName("table-header");
      let tableContent = document.getElementById('table-content');
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
            tableContent.style.paddingTop = tableHeaders[0].clientHeight + segmentHeader.offsetHeight + 'px';
          });
        } else {
          segmentHeader.classList.remove("fixed-top");
          tableHeaderElement.forEach(element => {
            element.classList.remove("fixed-top");
            tableContent.style.paddingTop = "0px";
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

  onClickPickYear() {

    let alert = this.mAlertController.create();
    alert.setTitle("Chọn thời gian thống kê");
    for (let i = 0; i < this.times.length; i++) {

      alert.addInput({
        type: 'radio',
        label: "" + this.times[i],
        value: "" + this.times[i],
        checked: this.times[i] == this.datas.year
      });

    }
    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: data => {
        if (data) {
          let value: number = parseInt(data);
          if (value != this.datas.year) {
            this.datas.year = value;
            this.onInputChanged();
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
    return (d < 10 ? "0" : "") + d + "/" + (m < 10 ? "0" : "") + m + "<br>" + date.getFullYear();
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
