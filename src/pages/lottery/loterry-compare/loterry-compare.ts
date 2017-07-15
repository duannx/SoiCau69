import { Component, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { Loto, LotoDay, LotteryDBCenter } from '../../../providers/lottery/lottery';
import { DatePicker } from '@ionic-native/date-picker';
@IonicPage()
@Component({
  selector: 'page-loterry-compare',
  templateUrl: 'loterry-compare.html',
})
export class LoterryComparePage {
  placeholder = "Nhập vé số của bạn";
  seletedDate: Date = new Date();
  vietlottCategory = { "id": 40, "type": 4, "title": "Vietlott Mega 6/45" };
  prizeResult = "";
  showResult = false;
  normalLottery = [
    { title: "ĐB", prize: "Đặc biệt", code: [], numOfPrize: 1, numbOfDigit: 5, rank: 0 },
    { title: "G-1", prize: "Giải nhất", code: [], numOfPrize: 1, numbOfDigit: 5, rank: 1 },
    { title: "G-2", prize: "Giải nhì", code: [], numOfPrize: 2, numbOfDigit: 5, rank: 2 },
    { title: "G-3", prize: "Giải ba", code: [], numOfPrize: 6, numbOfDigit: 5, rank: 3 },
    { title: "G-4", prize: "Giải tư", code: [], numOfPrize: 4, numbOfDigit: 4, rank: 4 },
    { title: "G-5", prize: "Giải năm", code: [], numOfPrize: 6, numbOfDigit: 4, rank: 5 },
    { title: "G-6", prize: "Giải sáu", code: [], numOfPrize: 3, numbOfDigit: 3, rank: 6 },
    { title: "G-7", prize: "Giải bảy", code: [], numOfPrize: 4, numbOfDigit: 2, rank: 7 },
    { title: "G-8", prize: "Giải tám", code: [], numOfPrize: 4, numbOfDigit: 2, rank: 7 },
  ];
  normalLoto = {
    lotos: [],
    head: [],
    back: []
  }
  vietlottArr = [];
  vietlottPrize = [
    { prize: "Jackpot", numberSame: 6, numberOfPrize: 0, value: 0 },
    { prize: "Giải Nhất", numberSame: 5, numberOfPrize: 0, value: 0 },
    { prize: "Giải Nhì", numberSame: 4, numberOfPrize: 0, value: 0 },
    { prize: "Giải Ba", numberSame: 3, numberOfPrize: 0, value: 0 },
  ];
  interVal: any;
  type = 1;
  category = {
    name: "Truyền thống",
    id: 1
  }
  isStart = false;
  userLottery = "";
  @ViewChildren('dynamicCol') cols: QueryList<any>;
  @ViewChildren('dynamicDiv') divs: QueryList<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public mAlertController: AlertController,
    private mMenuController: MenuController, public mLotteryDBCenter: LotteryDBCenter, private mDatePicker: DatePicker) {
    this.mLotteryDBCenter.getCategories();
    if (this.mLotteryDBCenter.categories.length > 0) {
      this.category = this.mLotteryDBCenter.categories[0];
    }
    this.normalLottery.map((elm) => {
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
    //Lấy data ngày gần nhất có dữ liệu
    let typeIndex = this.mLotteryDBCenter.lotteries.findIndex(elm => {
      return elm.id == 1;
    })
    this.seletedDate = this.mLotteryDBCenter.lotteries[typeIndex].nearest;

    this.onInputChange();
  }

  onInputChange() {
    if (this.category.id == this.vietlottCategory.id) {
      this.type = 4;
      this.placeholder = "Các số cách nhau bằng dấu ,";
    }
    else {
      this.type = 1;
      this.placeholder = "Nhập vé số của bạn.";
    }
    this.userLottery = "";
    this.showResult = false;
    this.requestResultLotteryAndLoto(this.getSystemDate2(this.seletedDate));
  }

  requestResultLotteryAndLoto(date: string) {

    this.mLotteryDBCenter.getLotteryHttpService().requestCategoryResultLotteryAndLotoByCateId(this.category.id, date, date, -1, 1).then(
      (data) => {
        if (data['content'].length > 0) {
          if (this.category.id == this.vietlottCategory.id) {
            this.onResponseGetVietlottLottery(data);
          } else {
            this.onResponseGetNormalLottery(data);
          }

        } else {
          //No data 
          this.showResult = true;
          this.prizeResult = "Không có kết quả ngày " + this.seletedDate.toLocaleDateString();
        }

      }, (error) => {
        console.log(error);
      });


  }
  ngAfterViewChecked() {
    this.cols.forEach((col, index) => {
      let elm: HTMLElement = col.nativeElement;
      let numCol = +elm.getAttribute("num-col");
      let numColOfFirstRow = +(numCol / 2).toFixed();
      let numColOfSecondRow = numCol - numColOfFirstRow;
      if (index < numColOfFirstRow) {
        elm.setAttribute("col-" + 12 / numColOfFirstRow, "");
        elm.classList.add("a-border-bottom");
      }
      else elm.setAttribute("col-" + 12 / numColOfSecondRow, "");
    })
  }

  onResponseGetNormalLottery(data) {
    //lottery
    this.normalLottery = [
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
    data.content[0].lottery.forEach(element => {
      let rank = +element.rank;
      this.normalLottery[rank].code.push(element.code);
      this.normalLottery[rank].numOfPrize += 1;
      this.normalLottery[rank].numbOfDigit = element.code.length;
    });

    //loto
    this.normalLoto = {
      lotos: [],
      head: [[], [], [], [], [], [], [], [], [], []],
      back: [[], [], [], [], [], [], [], [], [], []]
    }
    data.content[0].loto.forEach(element => {
      this.normalLoto.lotos.push(element.code.slice(element.code.length - 2, element.code.length));
    });
    this.normalLoto.lotos.sort((a, b) => {
      return +a - +b;
    })
    this.normalLoto.lotos.forEach(loto => {
      let num = parseInt(loto);
      let head = Math.floor(num / 10);
      let back = num % 10;
      this.normalLoto.head[head].push(loto);
      this.normalLoto.back[back].push(loto);
    });
  }

  onResponseGetVietlottLottery(data) {
    this.vietlottArr = [];
    data.content[0].lottery.forEach(element => {
      this.vietlottArr.push(element.code);
    });
  }


  onkeyup(event) {
    var code = (event.keyCode ? event.keyCode : event.which);
    if ((code == 13) || (code == 10)) {
      this.compareLottery();
    }
  }

  compareLottery() {
    //remove highlight class
    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
      cells[i].classList.remove("highlight");
    }
    let userCode = this.userLottery.trim();

    this.prizeResult = "";
    this.showResult = false;
    if (userCode == null || userCode == '') {
      this.showResult = false;
      return;
    }
    if (this.category.id != this.vietlottCategory.id) {
      if (isNaN(parseInt(userCode)) || userCode.length > this.normalLottery[0].code[0].length) {
        //Wrong code
        this.showResult = true;
        this.prizeResult = "Vé số bạn nhập vào không hợp lệ";
      } else {
        let prize = []
        this.normalLottery.forEach(element => {
          element.code.forEach(code => {
            if (userCode.indexOf(code) != -1 && userCode.indexOf(code) + code.length == userCode.length) {
              prize.push(element.prize);
              let targetClass = element.title + code;
              let elms = document.getElementsByClassName(targetClass);
              for (let i = 0; i < elms.length; i++) {
                elms[i].classList.add("highlight");
              }
            }
          })
        });
        this.showResult = true;
        if (prize.length > 0) {
          this.prizeResult = "Chúc mừng, bạn đã trúng " + prize.join(' và ');
        } else {
          this.prizeResult = "Thật tiếc bạn chưa trúng giải nào";
        }
      }
    } else {

      let userArr = userCode.split(',');
      if (userArr.length != 6) {
        this.showResult = true;
        this.prizeResult = "Bạn phải nhập đúng 6 bộ số, phân cách bằng dấu ,";
      } else {
        let countArr = [];
        let vietlottPrizes = [...this.vietlottArr]
        userArr.forEach(code => {
          if (vietlottPrizes.indexOf(code.trim()) > -1) {
            countArr.push(code.trim());
            vietlottPrizes.splice(vietlottPrizes.indexOf(code.trim()), 1)
          }
        });
        this.showResult = true;
        if (countArr.length == 0) {
          this.prizeResult = "Vé số của bạn không trùng khớp số nào so với giải thưởng.<br> Chúc bạn may mắn lần sau"
        } else {
          if (countArr.length <= 2) {
            this.prizeResult = `Vé số của bạn trùng ${countArr.length} số: ${countArr.join(' ')}. <br> 
          Rất tiếc bạn không trúng thưởng.
          `
          } else {
            let index = this.vietlottPrize.findIndex(elm => {
              return elm.numberSame == countArr.length;
            })
            this.prizeResult = `Chúc mừng bạn đã trúng ${this.vietlottPrize[index].prize}.<br>
            Các con số trùng khớp là: ${countArr.join(' ')}
          `
          }
        }

      }
    }
  }

  rollingData() {
    if (this.type == 1) {
      this.normalLottery.map(element => {
        for (let j = 0; j < element.code.length; j++) {
          let newcode = "";
          for (let i = 0; i < element.numbOfDigit; i++) {
            newcode += Math.floor(Math.random() * 10);
          }
          element.code[j] = newcode;
        }

        return element;
      });

      this.normalLoto = {
        lotos: [],
        head: [[], [], [], [], [], [], [], [], [], []],
        back: [[], [], [], [], [], [], [], [], [], []]
      }
      this.normalLottery.forEach(element => {
        element.code.forEach(code => {
          this.normalLoto.lotos.push(code.slice(code.length - 2, code.length));
        });
      });
      this.normalLoto.lotos.forEach(loto => {
        let num = parseInt(loto);
        let head = Math.floor(num / 10);
        let back = num % 10;
        this.normalLoto.head[head].push(loto);
        this.normalLoto.back[back].push(loto);
      });
    }


    if (this.type == 4) {
      this.vietlottArr = this.vietlottArr.map(element => {
        return Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10);
      });
    }

  }

  onClickPickCategory() {
    let alert = this.mAlertController.create();
    alert.setTitle("Chọn tỉnh");
    let index = 0;
    alert.addInput({
      type: 'radio',
      label: this.vietlottCategory.title,
      value: this.vietlottCategory.id + "",
      checked: this.category.id == this.vietlottCategory.id
    });
    for (let category of this.mLotteryDBCenter.categories) {
      if (category.id == this.vietlottCategory.id) continue;
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
          if (id == this.vietlottCategory.id) {
            this.category.id = this.vietlottCategory.id;
            this.category.name = this.vietlottCategory.title;
          } else {
            for (let category of this.mLotteryDBCenter.categories) {
              if (category.id == id) {
                this.category = category;
                break;
              }
            }
          }
          this.onInputChange();
        }
      }
    });
    alert.present();
  }

  onClickSelectDate() {
    this.mDatePicker.show({
      date: this.seletedDate,
      mode: 'date',
      maxDate: this.seletedDate
    }).then(
      date => {
        if (date) {
          this.seletedDate = date;
          this.onInputChange();
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }

  onClickOpenMenu() {
    this.mMenuController.open("lottery");
  }

  getLottery(start, end) {
    let result = "";
    for (let i = start; i <= end; i++) {
      result += this.normalLottery[i];
    }
    return result;
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
