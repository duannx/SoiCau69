import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';

import { LotteryDBCenter, LotoNumber } from "../../../providers/lottery/lottery";
import { Utils } from "../../../providers/app-utils";
import { DatePicker } from '@ionic-native/date-picker';

import Chart from "chart.js";
@IonicPage()
@Component({
  selector: 'page-statistic-next-day',
  templateUrl: 'statistic-next-day.html',
})
export class StatisticNextDayPage {
  //Ngày bắt đầu mặc định
  START_TIME = "2014-01-01";
  //data lottery ngày được chọn
  datas = {
    date: "2017-05-01",
    lottery: "00000",
    lotoSpecial: "00",
    category: {
      id: 1,
      name: "Truyền thống"
    },
    type: {
      id: 1,
      name: "Miền Bắc"
    }
  };
  upcomingDate = new Date();
  //data lottery các ngày trong quá khứ
  historyLotteryDatas = [
    {
      prevDay: {
        date: "01-01-2017",
        lottery: "00000"
      },
      nextDay: {
        date: "02-01-2017",
        lottery: "00000"
      }
    },
    {
      prevDay: {
        date: "03-04-2017",
        lottery: "00000"
      },
      nextDay: {
        date: "04-04-2017",
        lottery: "00000"
      }
    },
    {
      prevDay: {
        date: "01-01-2017",
        lottery: "00000"
      },
      nextDay: {
        date: "02-01-2017",
        lottery: "00000"
      }
    },
    {
      prevDay: {
        date: "03-04-2017",
        lottery: "00000"
      },
      nextDay: {
        date: "04-04-2017",
        lottery: "00000"
      }
    },
    {
      prevDay: {
        date: "01-01-2017",
        lottery: "00000"
      },
      nextDay: {
        date: "02-01-2017",
        lottery: "00000"
      }
    },
    {
      prevDay: {
        date: "03-04-2017",
        lottery: "00000"
      },
      nextDay: {
        date: "04-04-2017",
        lottery: "00000"
      }
    },
  ]
  //data loto DB các ngày trong quá khứ
  historyLotoData = []
  historyLotoDataSorted = [];
  historyLotoDataFilted = {
    sum: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0
    },
    head: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0
    },
    back: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0
    }
  }
  numberCollection = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  mChart: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public mAlertController: AlertController, public mLoadingController: LoadingController,
    public mLotteryDBCenter: LotteryDBCenter, private mDatePicker: DatePicker) {
    this.mLotteryDBCenter.getCategories();
    if (this.mLotteryDBCenter.categories.length > 0) {
      this.datas.category = this.mLotteryDBCenter.categories[0];
    }
  }

  mViewEnter: boolean = false;
  ionViewDidEnter() {
    this.drawChart();
    this.mViewEnter = true;
    //Lấy data ngày gần nhất có dữ liệu
    let typeIndex = this.mLotteryDBCenter.lotteries.findIndex(elm => {
      return elm.id == this.datas.type.id;
    })  
    let nearestDay = this.mLotteryDBCenter.lotteries[typeIndex].nearest; 
    this.datas.date = this.getSystemDate2(nearestDay);
    this.upcomingDate = new Date(nearestDay);
    this.upcomingDate.setDate(this.upcomingDate.getDate() + 1);
    this.onInputChanged();
  }

  onInputChanged() {
    let startDate = new Date(this.datas.date);
    startDate.setDate(startDate.getDate() - 20);
    let loading: Loading = this.mLoadingController.create({
      duration: 5000,
      content: "Đang tải dữ liệu..."
    });
    loading.present();
    //Refresh data
    this.historyLotoData = []
    this.historyLotoDataSorted = [];
    this.numberCollection.forEach(element => {
      this.historyLotoDataFilted.sum[element + ""] = 0;
      this.historyLotoDataFilted.head[element + ""] = 0;
      this.historyLotoDataFilted.back[element + ""] = 0;
    });
    //Lấy data lottery của ngày được chọn
    this.mLotteryDBCenter.getLotteryHttpService().requestCategoryResultLottery(this.datas.type.id, this.datas.category.id,
      this.getSystemDate(startDate.toDateString()), this.datas.date, 0, 1).then(data => {
        this.onResponsCategoryResultLottery(data);
        //Lấy data thống kê ngày mai
        this.mLotteryDBCenter.getLotteryHttpService().requestAnalyticsLotoTomorrow(this.datas.category.id, this.START_TIME,
          this.datas.date, this.datas.lotoSpecial).then(data => {
            this.onResponsAnalyticsLotoTomorrow(data);
            loading.dismiss();
          }, error => {
            loading.dismiss();
          })
      }, error => {
        loading.dismiss();
      })
  }

  //xử lý kết quả trả về của requestCategoryResultLottery
  onResponsCategoryResultLottery(data) {
    if (data.content.length > 0) {
      let dataArray = data.content;
      let firstValidData: any = {};
      while (dataArray.length > 0) {
        let firstValidData = dataArray.pop();
        if (firstValidData.lottery.length > 0) {
          this.datas.date = firstValidData.time;
          this.upcomingDate = new Date(this.datas.date);
          this.upcomingDate.setDate(this.upcomingDate.getDate() + 1);
          this.datas.lottery = firstValidData.lottery[0].code;
          this.datas.lotoSpecial = this.datas.lottery.substr(this.datas.lottery.length - 2, 2);
          break;
        }
      }

    }
  }

  //xử lý kết quả trả về của requestAnalyticsLotoTomorrow
  onResponsAnalyticsLotoTomorrow(data) {
    //refresh data
    this.historyLotteryDatas = [];
    if (data.content.length > 0) {
      data.content.forEach(tomorow => {
        let nextDay: any = {};
        let prevDate = new Date(tomorow.t);
        prevDate.setDate(prevDate.getDate() - 1);
        nextDay["date"] = tomorow.t;
        nextDay["lottery"] = tomorow.l;
        let prevDay: any = {};
        prevDay["date"] = Utils.getViewDate(prevDate);
        prevDay["lottery"] = "xxx" + this.datas.lotoSpecial;
        this.historyLotteryDatas.push({ "prevDay": prevDay, "nextDay": nextDay })
        this.historyLotoData.push(nextDay.lottery.substr(nextDay.lottery.length - 2, 2));
      });
      this.historyLotteryDatas.reverse();
      this.historyLotoData.forEach(element => {
        let index = this.historyLotoDataSorted.findIndex((elm) => { return elm.loto == element });
        if (index == -1) {
          this.historyLotoDataSorted.push({ "loto": element, "n": 1 });
        } else {
          this.historyLotoDataSorted[index]["n"]++;
        }
      });
      this.historyLotoDataSorted.sort((a, b) => {
        return - a.n + b.n;
      })
      this.redrawChart();
      //filter by sum
      this.historyLotoDataSorted.forEach(element => {
        let decimal = Math.floor(parseInt(element.loto) / 10);
        let unit = parseInt(element.loto) % 10;
        let sum = (decimal + unit) % 10;
        this.historyLotoDataFilted.sum[sum + ''] += element.n;
        this.historyLotoDataFilted.head[decimal + ''] += element.n;
        this.historyLotoDataFilted.back[unit + ''] += element.n;
      });
    }
  }

  drawChart() {
    let chartCanvas = document.getElementById("mChartCanvas");

    if (chartCanvas == undefined) return;

    this.mChart = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"],
        datasets: [
          {
            label: "Số lần xuất hiện",
            backgroundColor: "#44b6ae",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true
            }
          }]
        },
        responsive: false,
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    });

  }
  redrawChart() {
    if (!this.mViewEnter) return;
    this.mChart.data.labels = [];
    this.mChart.data.datasets[0].data = [];
    for (let lotoNumber of this.historyLotoDataSorted) {
      if (this.mChart.data.labels.length < 10) {
        this.mChart.data.labels.push(lotoNumber.loto);
        this.mChart.data.datasets[0].data.push(lotoNumber.n);
      }
    }
    this.mChart.update();
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
        checked: category.id == this.datas.category.id
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
              this.datas.category = category;
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
      date: this.upcomingDate,
      mode: 'date',
      maxDate: this.upcomingDate
    }).then(
      date => {
        if (date) {
          let selectDate = new Date(this.getSystemDate2(date));
          this.upcomingDate = selectDate;
          selectDate.setDate(selectDate.getDate() - 1);
          this.datas.date = this.getSystemDate2(selectDate);
          this.onInputChanged();
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }

  //Format
  formatLottery(lottery: string) {

    let result = "";
    if (lottery) {
      if (lottery.length <= 2) {
        result = `<span class="red">${lottery}</span>`;
      } else {
        result = lottery.substr(0, lottery.length - 2);
        result += `<span class="red">${lottery.substr(lottery.length - 2, 2)}</span>`;
      }
    }
    return result;
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
