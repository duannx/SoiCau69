
import { Injectable } from '@angular/core';
import { LotteryHttpService } from "./lottery-http-service";
import { ResponseCode, RequestState, LoginStatus } from '../app-constant';
import { Utils } from '../app-utils';
import { LotteryConstants } from './lottery-constant';
import { DreamBook } from './lottery-dream';
import { LotteryStatistics } from './lottery-statistics';
import { LotteryType, LotteryCategory } from './lottery-type';
import { Storage } from "@ionic/storage";


@Injectable()
export class LotteryDBCenter {

  mDreamBook: DreamBook = new DreamBook();

  lotteries: Array<LotteryType> = [];

  categories: Array<LotteryCategory> = [];

  mLastSelectedCategoryID: number = -1;

  mUser: LotteryUser = new LotteryUser();

  mLotoProvider: LotoProvider = new LotoProvider();

  mAnimationFrameID: number = -1;

  mAnimationFrameRunning: boolean = false;

  mRequestState: number = RequestState.READY;

  mLotteryStatistics: LotteryStatistics = new LotteryStatistics();

  currentMoney: number = 0;

  mLotoVipNumbers: Array<LotoVipNumber> = [];

  appConfig = {
    "diem_lo_ratio": "1:23",
    "loxien3_ratio": "1:40",
    "loxien4_ratio": "1:100",
    "de_ratio": "1:70",
    "loxien_ratio": "1:10",
    "lo_ratio": "23:80"
  };

  mLotteryMenu = {
    id: 0, name: "lottery", active: true, categories: [
      {
        id: 0, name: "Chức năng", items: [
          { id: 0, name: "Trang chủ", icon: "fa-home", page: "LotteryRootPage", isActive: true },
          //  { id: 1, name: "Tường thuật trực tiếp", icon: "md-globe" },
          { id: 2, name: "Kết quả xổ số", icon: "fa-globe", page: "LotteryHomePage", isActive: false },
          { id: 3, name: "Thống kê", icon: "fa-calendar", page: "LotteryStatisticPage", isActive: false },
          { id: 5, name: "Soi cầu", icon: "fa-line-chart", page: "LotterySoicauPage", isActive: false },
          { id: 4, name: "Sổ mơ", icon: "fa-book", page: "LotteryDreamBookPage", isActive: false },
          
          // { id: 6, name: "Đầu tư", icon: "ios-pricetags-outline", page: "LotteryDauTuPage" },
          //{ id: 7, name: "Số vip hôm nay", icon: "ios-bookmark-outline", page: "LotoVipPage" },
          { id: 8, name: "Cùng quay xổ số", icon: "fa-play-circle", page: "FakeLotteryPage", isActive: false },
          { id: 9, name: "So kết quả", icon: "fa-search", page: "LoterryComparePage", isActive: false },
          { id: 10, name: "Loto Online", icon: "fa-life-ring", page: "LotoOnlinePage", isActive: false },
          { id: 11, name: "Thống kê Loto Online", icon: "fa-calendar-check-o", page: "StatisticLotoOnlinePage", isActive: false }
        ]
      },
      // {
      //   id: 1, name: "Về bạn", items: [
      //     { id: 0, name: "Thông tin cá nhân", icon: "account_circle", page: "LotteryUserInfoPage", isActive: false },
      //     { id: 1, name: "Ví tiền", icon: "account_balance_wallet", page: "LotteryUserMoneyPage", isActive: false },
      //     { id: 2, name: "Lịch sử Loto", icon: "history", page: "", isActive: false },
      //   ]
      // }
    ]
  };

  constructor(
    private mStorage: Storage,
    private mLotteryHttpService: LotteryHttpService,
    private mLotteryConstants: LotteryConstants) {
  }

  scheduleUpdate() {
    this.mAnimationFrameRunning = true;
    this.mAnimationFrameID = requestAnimationFrame(() => {
      this.onUpdate();
      if (this.mAnimationFrameRunning) this.scheduleUpdate();
    });
  }

  unScheduleUpdate() {
    cancelAnimationFrame(this.mAnimationFrameID);
    this.mAnimationFrameRunning = false;
  }

  onUpdate() {
    if (this.mRequestState == RequestState.DONE) this.unScheduleUpdate();
    if (this.mRequestState != RequestState.READY && this.mRequestState != RequestState.FAIL) return;

    if (this.lotteries.length == 0) {
      this.requestLotteries();
      return;
    }
    let done: boolean = true;
    for (let type of this.lotteries) {
      if (type.categories.length == 0) {
        this.requestCategoryOfType(type);
        done = false;
        break;
      }
    }
    if (!done) return;

    if (this.categories.length == 0) {
      this.getCategories();
      return;
    }

    if (this.mDreamBook.dreams.length == 0) {
      this.requestDreamBook();
      return;
    }

    if (this.mLotteryStatistics.nhieunhat.length == 0
      || this.mLotteryStatistics.itnhat.length == 0
      || this.mLotteryStatistics.dauloto.length == 0
      || this.mLotteryStatistics.duoiloto.length == 0) {
      this.requestLotteryStatistics();
      return;
    }
    if (this.mLotteryStatistics.logan.length == 0) {
      this.requestLotteryLoganNow();
      return;
    }

    this.saveDataToStorage();

    this.getLotoVip();

    this.getAppConfig();

    this.mRequestState = RequestState.DONE;
  }

  setMenuActive(page: string) {
    this.mLotteryMenu.categories.forEach(element => {
      element.items.forEach(elm => {
        elm.isActive = false;
        if (elm.page == page) elm.isActive = true;
      })
    })
  }

  getAppConfig() {
    this.mLotteryHttpService.requestGetAppConfig(this.mUser.name).then(data => {
      this.onResponseAppConfig(data);
    })
  }

  getLotoVip() {
    let startDate = new Date();
    let endDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    this.mLotteryHttpService.requestLotoRecommendQuery(1, Utils.getRequestDate(startDate), Utils.getRequestDate(endDate)).then(data => {
      this.onResponseGetLotoVip(data);
    }, error => {

    });
  }

  onResponseGetLotoVip(data) {
    //Find the neareast day
    if (data.content.length > 0) {
      data.content.reverse();
      let currentDate = new Date('2017-01-01');
      for (let i = 0; i < data.content.length; i++) {
        let element = data.content[i];
        if (element.content.length > 0) {
          let lotoVip = [];
          element.content.forEach(elm => {
            lotoVip.push(new LotoVipNumber(elm.c, elm.r));
          });
          if (new Date(element.time) >= currentDate) {
            this.mLotoVipNumbers = [];
            currentDate = new Date(element.time);
            this.mLotoVipNumbers = lotoVip;
          }
        }
      }
    }
  }

  onResponseAppConfig(data) {
    this.appConfig.de_ratio = data.de_ratio;
    this.appConfig.diem_lo_ratio = data.diem_lo_ratio;
    this.appConfig.lo_ratio = data.lo_ratio;
    this.appConfig.loxien_ratio = data.loxien_ratio;
    this.appConfig.loxien3_ratio = data.loxien3_ratio;
    this.appConfig.loxien4_ratio = data.loxien4_ratio;

  }

  saveDataToStorage() {
    // this.mStorage.set("lotteries", this.lotteries);
    // this.mStorage.set("categories", this.categories);
  }

  getLotteryHttpService() {
    return this.mLotteryHttpService;
  }

  start() {
    this.scheduleUpdate();
  }


  getCategories() {
    if (this.categories.length == 0) {
      this.mLastSelectedCategoryID = -1;
      for (let lottery of this.lotteries) {
        if (lottery.id != this.mLotteryConstants.VIETLOTT) {
          for (let category of lottery.categories) {
            if (lottery.id == this.mLotteryConstants.XSMB) {
              if (category.id != 2 && category.id != 3 && category.id != 4) {
                this.categories.push(category);
              }
            } else {
              this.categories.push(category);
            }
          }
        }
      }
    }
    return this.categories;
  }

  getCurrentMoney() {
    //Just fake API
    this.currentMoney = 1000;
    return 1000;
  }

  updateCurrentMoney(money: number) {
    //Just fake API
    this.currentMoney = money;
  }

  requestCategoryOfType(type: LotteryType) {
    this.mRequestState = RequestState.REQUESTING;
    this.mLotteryHttpService.requestCategoriesOfType(type.id).then(
      data => {
        type.onResponseCategories(data);
        this.mRequestState = RequestState.READY;
      },
      error => {

      }
    );

    this.mLotteryHttpService.requestLotteryTypeNearestDay(type.id).then(
      data => {
        if (data['status'] == ResponseCode.SUCCESS) {
          let time: string = data['time'];
          if (time && time.length > 0) {
            let date = new Date(time);
            if (date) {
              type.nearest = date;
            }
          }
        }
      },
      error => { }
    );
  }

  requestLotteries() {
    this.mRequestState = RequestState.REQUESTING;
    this.mLotteryHttpService.requestTypes().then(
      response => {
        this.onResponseLotteries(response);
        this.mRequestState = RequestState.READY;
      },
      error => { }
    );
  }

  onResponseLotteries(data) {
    if (data.status == ResponseCode.SUCCESS) {
      for (let lotteryData of data.content) {
        let lottery = new LotteryType();
        lottery.onResponseType(lotteryData);
        this.lotteries.push(lottery);
      }
    }
  }

  requestDreamBook() {
    if (this.mDreamBook.dreams.length == this.mDreamBook.count) return;
    this.mRequestState = RequestState.REQUESTING;
    let start: number = this.mDreamBook.dreams.length;
    let range: string = (start == 0 ? "0" : ("" + start)) + "-" + this.mDreamBook.count;
    this.mLotteryHttpService.requestDreamBook(range, "", "").then(
      data => {
        this.mDreamBook.onResponseDreamBook(data);
        this.mRequestState = RequestState.READY;
      },
      error => {
      }
    );
  }

  // thong ke cho page lottery-home
  requestLotteryStatistics() {
    this.mRequestState = RequestState.REQUESTING;
    // lay data trong 40 ngay
    this.mLotteryHttpService.requestAnalyticsLotoFrequentlyCount(1, 40).then(
      (data) => {
        this.mLotteryStatistics.onResponseLotteryStatistics(data);
        this.mRequestState = RequestState.READY;
      }, (error) => {

      });
  }

  requestLotteryLoganNow() {
    this.mRequestState = RequestState.REQUESTING;
    // logan ko ve >= 10 ngay
    this.mLotteryHttpService.requestLotteryLoganNow(1, 10).then(
      (data) => {
        this.mLotteryStatistics.onRequestLotteryLoganNow(data);
        this.mRequestState = RequestState.READY;
      }, (error) => {

      });
  }
  // end thong ke cho page lottery-home

}


export class LotoNumber {
  loto: string;
  value: number;
  count: number;
  last_time: string;
  /**
   * State 0 : lock
   * State 1 : unlock, unopen 
   * State 2 : unlock, fail
   * State 3 : unlock, success
   */
  state: number;
  constructor() {
    this.loto = "00";
    this.last_time = "2017-01-01";
    this.count = 0;
    this.value = 0;
    this.state = 0;
  }
  setDefaultTime() {
    this.last_time = "2017-01-01";
  }
  setState(newState: number) {
    this.state = newState;
  }
  setValue(value: number) {
    this.value = value;
    this.loto = (value < 10 ? "0" : "") + value;
  }

  onResponse(data: any) {
    this.loto = data.l;
    this.count = data.n;
    this.last_time = data.t;
    this.value = parseInt(this.loto);
  }
  onResponseWithoutTime(data: any) {
    this.loto = data.l;
    this.count = data.n;
    this.value = parseInt(this.loto);
  }
  cloneFrom(lotoNumber: LotoNumber) {
    this.loto = lotoNumber.loto;
    this.count = lotoNumber.count;
    this.last_time = lotoNumber.last_time;
    this.value = lotoNumber.value;
  }
}

export class LotoVipNumber {
  value: number;
  code: string;
  state: number;//-1 = Tach; 0 = Chua xu ly; 1 = trung

  constructor(text?: string, state?: number) {
    if (text != null && text != "" && text != undefined) {
      this.code = text;
      this.value = +text;
      this.state = 0 || state;
    } else
      this.reset();
  }
  reset() {
    this.value = -1;
    this.code = "?";
  }
  setValue(val: number) {
    if (val < 0) val = 0;
    if (val > 99) val = 99;
    this.value = val;
    this.code = ((val < 10) ? "0" : "") + val;
  }
}

export class LotteryUser {
  username: string;
  name: string;
  private money: number;
  level: number;
  role: number;
  avatar: string;
  time: string;
  phone: string;
  address: string;
  status: number;
  type: number;
  gender: string;
  login_status: number;
  id: number;
  constructor() {
    this.username = "undefined";
    this.name = "LotteryUser";
    this.money = 0;
    this.avatar = "";
    this.time = "2017-01-01";
    this.status = 1;
    this.level = 1;
    this.role = 0;
    this.type = 0;
    this.phone = "";
    this.address = "";
    this.gender = "";
    this.login_status = LoginStatus.LOGGED_OUT;
    this.id = -1;
  }
  onResponseLogin(data) {
    this.login_status = LoginStatus.LOGGED_IN;
    this.username = data.user_name;
    this.money = data.money;
    this.name = data.title;
    this.id = data.id;
  }
  onResponseUserInfo(data) {
    this.money = data.money;
    this.status = data.status;
    this.time = data.time;
    if (data.avatar && data.avatar.length > 0) {
      this.avatar = data.avatar;
    }
  }
  getMoney() {
    return this.money;
  }

  setMoney(money: number) {
    this.money = money;
  }
}

export class Loto {
  loto: string;
  value: number;
  ranks: Array<number> = [];
  special: boolean;
  constructor() {
    this.loto = "00";
    this.value = 0;
    this.special = false;
  }

  setValue(val: number) {
    this.value = val;
    this.loto = ((val < 10) ? "0" : "") + val;
  }
  addRank(rank: number) {
    this.ranks.push(rank);
    if (rank == 0) {
      this.special = true;
    }
  }
  clearRanks() {
    this.special = false;
    this.ranks = [];
  }
}

export class LotoDay {
  time: string;
  times: Array<string> = [];
  lotos: Array<Loto> = [];
  constructor() {
    this.setTime("2017-01-01");
    for (let i = 0; i < 100; i++) {
      let loto = new Loto();
      this.lotos.push(loto);
    }
  }
  setTime(time: string) {
    this.time = time;
    this.times = this.time.split("-");
  }
  getLoto(value): Loto {
    if (value >= 0 && value < this.lotos.length) return this.lotos[value];
    return null;
  }
  public onResponseCategoryResultLoto(data) {
    this.lotos = [];
    this.setTime(data.time);
    data.loto.forEach(loto => {
      let curLoto = new Loto();
      curLoto.loto = loto.code;
      curLoto.value = loto.code;
      this.lotos.push(curLoto);
    });
  }
}

export class LotoMonth {
  month: number;
  year: number;
  days: Array<LotoDay> = [];
  constructor() {
    this.month = 0;
    this.year = 2017;
  }
}

export class LotoProvider {
  months: Array<LotoMonth> = [];


  onResponseMonth(data) {
    if (data.status == ResponseCode.SUCCESS) {
      for (let monthData of data.content) {
        let month = monthData.month;
        if (this.getLotoMonth(month, 2017) == null) {
          let lotoMonth = new LotoMonth();
          lotoMonth.month = month;
          for (let day of monthData.d) {
            let lotoDay = new LotoDay();
            lotoDay.setTime(day.d);
            for (let lotoData of day.l) {
              let code: number = parseInt(lotoData.c);
              let loto = lotoDay.getLoto(code);
              if (loto) {
                loto.addRank(lotoData.r);
              }
            }
            lotoMonth.days.push(lotoDay);
          }
          this.months.push(lotoMonth);
        }
      }
    }
  }


  getLotoMonth(month: number, year: number): LotoMonth {
    for (let lotoMonth of this.months) {
      if (lotoMonth.month == month && lotoMonth.year == year) {
        return lotoMonth;
      }
    }
    return null;
  }

}