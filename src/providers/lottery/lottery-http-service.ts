import { Injectable } from '@angular/core';
import { ParamBuilder, HttpService } from "../http-service";
import { Headers } from '@angular/http';
import { ParamsKey } from '../app-constant';
import { LotteryCmd } from './lottery-cmd';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class LotteryHttpService {
  //private SERVICE_URL: string = "http://192.168.1.62:8080/lottery_app/ws/";
  // private SERVICE_URL: string = "http://125.212.192.94:8080/lottery_app/ws/";
  private SERVICE_URL: string = "http://api.xosoonline.me/ws/";
  // private SERVICE_URL: string = "http://192.168.1.84:8080/lottery_app/ws/";

  private CLIENT_KEY: string = "8c24516c23b611420defccf253598412";
  private DEVICE_ID: string = "appinasia_macbookpro";
  mHeaderWithKey: Headers;
  constructor(private mHttpService: HttpService) {

  }
  createHeaders() {
    if (this.mHeaderWithKey == null || this.mHeaderWithKey == undefined) {
      this.mHeaderWithKey = new Headers();
      this.mHeaderWithKey.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
      this.mHeaderWithKey.append('X-device-id', this.DEVICE_ID);
    }
    //Postman ko dùng đc!
  }
  requestGet(url: string, params: string) {
    this.createHeaders();
    return this.mHttpService.requestGet(url, params, { headers: this.mHeaderWithKey });
  }

  requestPost(url: string, params: string) {
    this.createHeaders();
    return this.mHttpService.requestPost(url, params, { headers: this.mHeaderWithKey });
  }

  testRequest() { }
  /**Request 2.1  Đăng nhập*/
  requestLogin(platform: string, version: string, device_name: string, device_id: string) {
    this.DEVICE_ID = device_id;
    return this.requestPost(this.SERVICE_URL + LotteryCmd.LOGIN, ParamBuilder.builder()
      .add(ParamsKey.PLATFORM, platform)
      .add(ParamsKey.VERSION, version)
      .add(ParamsKey.DEVICE_NAME, device_name)
      .add(ParamsKey.DEVICE_ID, device_id)
      .add(ParamsKey.SIGN, Md5.hashStr(device_name + device_id + this.CLIENT_KEY))
      .build());
  }
  /**Request 2.2  Danh sách nhóm xổ số "type"*/
  requestTypes() {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LIST_TYPES, "");
  }
  /**Request 2.3  Danh sách các category xổ số*/
  requestCategoriesOfType(type: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.CATEGORIES, ParamBuilder.builder()
      .add(ParamsKey.TYPE, type)
      .build());
  }
  /**Request 2.4 Danh sách kết quả. Nếu tham số truyền vào bằng null sẽ bỏ qua*/
  requestCategoryResultLotteryOption(type: number, categoryID: number, timeStart: string, timeEnd: string, field: string, rank: number, count: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_RESULT, ParamBuilder.builder()
      .addIgnoreNull(ParamsKey.TYPE, type)
      .addIgnoreNull(ParamsKey.CATE_ID, categoryID)
      .addIgnoreNull(ParamsKey.TIME_START, timeStart)
      .addIgnoreNull(ParamsKey.TIME_END, timeEnd)
      .addIgnoreNull(ParamsKey.FIELD, field)
      .addIgnoreNull(ParamsKey.RANK, rank)
      .addIgnoreNull(ParamsKey.COUNT, count)
      .addIgnoreNull(ParamsKey.SIGN, Md5.hashStr(timeEnd + this.CLIENT_KEY))
      .build());
  }
  /**Request 2.4 Danh sách kết quả xổ số*/
  requestCategoryResultLottery(type: number, categoryID: number, timeStart: string, timeEnd: string, rank: number, count: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_RESULT, ParamBuilder.builder()
      .add(ParamsKey.TYPE, type)
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .add(ParamsKey.FIELD, "lottery")
      .add(ParamsKey.RANK, rank)
      .add(ParamsKey.COUNT, count)
      .add(ParamsKey.SIGN, Md5.hashStr(timeEnd + this.CLIENT_KEY))
      .build());
  }
  /**Request 2.4 Danh sách kết quả xổ số theo cate_id*/
  requestCategoryResultLotteryByCateId(categoryID: number, timeStart: string, timeEnd: string, rank: number, count: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_RESULT, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .add(ParamsKey.FIELD, "lottery")
      .add(ParamsKey.RANK, rank)
      .add(ParamsKey.COUNT, count)
      .add(ParamsKey.SIGN, Md5.hashStr(timeEnd + this.CLIENT_KEY))
      .build());
  }
  /**Request 2.4  Danh sách kết quả loto*/
  requestCategoryResultLoto(type: number, categoryID: number, timeStart: string, timeEnd: string, rank: number, count: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_RESULT, ParamBuilder.builder()
      .add(ParamsKey.TYPE, type)
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .add(ParamsKey.FIELD, "loto")
      .add(ParamsKey.RANK, rank)
      .add(ParamsKey.COUNT, count)
      .add(ParamsKey.SIGN, Md5.hashStr(timeEnd + this.CLIENT_KEY))
      .build());
  }
  /**Request 2.4  Danh sách kết quả xổ số và loto*/
  requestCategoryResultLotteryAndLoto(type: number, categoryID: number, timeStart: string, timeEnd: string, rank: number, count: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_RESULT, ParamBuilder.builder()
      .add(ParamsKey.TYPE, type)
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .add(ParamsKey.FIELD, "lottery,loto")
      .add(ParamsKey.RANK, rank)
      .add(ParamsKey.COUNT, count)
      .add(ParamsKey.SIGN, Md5.hashStr(timeEnd + this.CLIENT_KEY))
      .build());
  }
  /**Request 2.4  Danh sách kết quả loto miền bắc*/
  requestResultLotoXSMB(time: string) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_RESULT, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, 1)
      .add(ParamsKey.TIME_START, time)
      .add(ParamsKey.TIME_END, time)
      .add(ParamsKey.FIELD, "loto")
      .add(ParamsKey.RANK, -1)
      .add(ParamsKey.COUNT, 1)
      .add(ParamsKey.SIGN, Md5.hashStr(time + this.CLIENT_KEY))
      .build());
  }
  requestResultLoto(cate_id: number, time: string) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_RESULT, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, cate_id)
      .add(ParamsKey.TIME_START, time)
      .add(ParamsKey.TIME_END, time)
      .add(ParamsKey.FIELD, "loto")
      .add(ParamsKey.RANK, -1)
      .add(ParamsKey.COUNT, 1)
      .add(ParamsKey.SIGN, Md5.hashStr(time + this.CLIENT_KEY))
      .build());
  }
  /**Request 2.4  Danh sách kết quả xổ số và loto theo cate_id*/
  requestCategoryResultLotteryAndLotoByCateId(categoryID: number, timeStart: string, timeEnd: string, rank: number, count: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_RESULT, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .add(ParamsKey.FIELD, "lottery,loto")
      .add(ParamsKey.RANK, rank)
      .add(ParamsKey.COUNT, count)
      .add(ParamsKey.SIGN, Md5.hashStr(timeEnd + this.CLIENT_KEY))
      .build());
  }
  /**Request 2.4  Danh sách kết quả xổ số và loto theo type*/
  requestCategoryResultLotteryAndLotoByType(type: number, timeStart: string, timeEnd: string, rank: number, count: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_RESULT, ParamBuilder.builder()
      .add(ParamsKey.TYPE, type)
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .add(ParamsKey.FIELD, "lottery,loto")
      .add(ParamsKey.RANK, rank)
      .add(ParamsKey.COUNT, count)
      .add(ParamsKey.SIGN, Md5.hashStr(timeEnd + this.CLIENT_KEY))
      .build());
  }
  /**Request 2.5 Lấy thông tin ngày gần nhất có kết quả*/
  requestLotteryNearestDay(type: number, categoryID: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_NEAREST_DAY, ParamBuilder.builder()
      .add(ParamsKey.TYPE, type)
      .add(ParamsKey.CATE_ID, categoryID)
      .build());
  }
  /**Request 2.5 Lấy thông tin ngày gần nhất có kết quả*/
  requestLotteryTypeNearestDay(lotteryTypeID: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_NEAREST_DAY, ParamBuilder.builder()
      .add(ParamsKey.TYPE, lotteryTypeID)
      .build());
  }
  /**Request 2.5 Lấy thông tin ngày gần nhất có kết quả*/
  requestLotteryCateIdNearestDay(categoryID: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_NEAREST_DAY, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .build());
  }
  /**Request 2.6  Lấy dữ liệu sổ mơ*/
  requestDreamBook(range: string, code: string, keyword: string) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.DREAMBOOK, ParamBuilder.builder()
      .add(ParamsKey.RANGE, range)
      .addStringIgnoreEmpty(ParamsKey.CODE, code)
      .addStringIgnoreEmpty(ParamsKey.KEYWORD, keyword)
      .build());
  }
  /**Request 2.7  Lấy dữ liệu lô gan*/
  requestLotteryLogan(categoryID: number, timeStart: string, timeEnd: string, amount: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_LOGAN, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .add(ParamsKey.AMOUNT, amount)
      .build());
  }
  /**Request 2.7  Lấy dữ liệu lô gan*/
  requestLotteryLoganNow(categoryID: number, amount: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_LOGAN, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.AMOUNT, amount)
      .build());
  }
  /**Request 2.8  Lấy dữ liệu max gan của một loto*/
  requestLotteryLomaxgan(categoryID: number, timeStart: string, timeEnd: string) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_LOMAXGAN, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .build());
  }
  /**Request 2.9  Lấy dữ liệu thống kê tần suất xuất hiện loto*/
  requestAnalyticsLotoFrequentlyCount(categoryID: number, count: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.ANALYTICS_LOTO_FREQUENTLY, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.COUNT, count)
      .build());
  }
  /**Request 2.9  Lấy dữ liệu thống kê tần suất xuất hiện loto*/
  requestAnalyticsLotoFrequentlyByCountAndTime(categoryID: number, count: number, time_end: string) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.ANALYTICS_LOTO_FREQUENTLY, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.COUNT, count)
      .add(ParamsKey.TIME_END, time_end)
      .build());
  }
  /**Request 2.10  Lấy dữ liệu thống kê tần suất xuất hiện loto*/
  requestAnalyticsLotoFrequentlyTime(categoryID: number, timeStart: string, timeEnd: string) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.ANALYTICS_LOTO_FREQUENTLY, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .build());
  }
  /**Request 2.10 Lấy thông tin về số tiền của vietlott jackpot*/
  requestVietlottJackpot(timeStart: string, timeEnd: string) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_VIETLOTT_JACKPOT, ParamBuilder.builder()
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .build());
  }
  /**Request 2.11  Thống kê theo ngày trong tuần*/
  requestAnalyticsLotoByDay(categoryID: number, day_of_week: number, weeks: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.ANALYTICS_LOTO_BY_DAY, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.WEEKS, weeks)
      .add(ParamsKey.DAY_OF_WEEK, day_of_week)
      .build());
  }
  /**Request 2.12 Thống kê loto nhanh*/
  requestAnalyticsLotoQuick(categoryID: number, timeStart: string, timeEnd: string, value: string) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.ANALYTICS_LOTO_QUICK, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .add(ParamsKey.VALUE, value)
      .build());
  }
  /**Request 2.13  Thống kê loto theo tổng*/
  requestAnalyticsLotoSum(categoryID: number, timeStart: string, timeEnd: string, tong: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.ANALYTICS_LOTO_SUM, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .add(ParamsKey.TONG, "" + tong)
      .build());
  }
  /**Request 2.14  Thống kê loto ngày mai*/
  requestAnalyticsLotoTomorrow(categoryID: number, timeStart: string, timeEnd: string, code: string) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.ANALYTICS_LOTO_TOMORROW, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .add(ParamsKey.CODE, code)
      .build());
  }

  /**Request 2.15  Soi cầu loto*/
  requestSoiCauLoto(categoryID: number, timeEnd: string, amount: number, cau_loai?: number, cau_hai_nhay?: number) {
    return this.mHttpService.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_SOICAU, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.AMOUNT, amount)
      .add(ParamsKey.TIME_END, timeEnd)
      .addIgnoreNull(ParamsKey.CAU_LOAI, cau_loai)
      .addIgnoreNull(ParamsKey.CAU_HAI_NHAY, cau_hai_nhay)
      .build());
  }
  /**Request 2.16  cập nhật thông tin user*/
  requestUserUpdateInfo(name: string, avatar: string, phone: string, device_id: string) {
    return this.requestPost(this.SERVICE_URL + LotteryCmd.USER_UPDATE_INFO, ParamBuilder.builder()
      .add(ParamsKey.TITLE, name)
      .add(ParamsKey.PHONE, phone)
      .add(ParamsKey.AVATAR, avatar)
      .add(ParamsKey.SIGN, Md5.hashStr(device_id + this.CLIENT_KEY))
      .build());
  }
  /**Request 2.17  Lấy thông tin user*/
  requestUserInfo(user_name: string) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.USER_INFO, ParamBuilder.builder()
      .add(ParamsKey.USER_NAME, user_name)
      .build());
  }
  /**Request 2.18  Lấy thông tin cấu hình app*/
  requestGetAppConfig(user_name: string) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.APP_CONFIG, "");
  }
  /**Request 2.19  User ghi kết quả với server*/
  requestLotoOnlineAdd(categoryID: number, type: number, code: string, money_bet: number) {
    return this.requestPost(this.SERVICE_URL + LotteryCmd.LOTOONLINE_ADD_RECORD, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, categoryID)
      .add(ParamsKey.TYPE, type)
      .add(ParamsKey.CODE, code)
      .add(ParamsKey.MONEY_BET, money_bet)
      .add(ParamsKey.SIGN, Md5.hashStr(categoryID + "" + type + code + money_bet + this.CLIENT_KEY))
      .build());
  }
  /**Request 2.20 User huỷ kết quả với server*/
  requestLotoOnlineDelete(recordID: number) {
    return this.requestPost(this.SERVICE_URL + LotteryCmd.LOTOONLINE_DELETE_RECORD, ParamBuilder.builder()
      .add(ParamsKey.ID, recordID)
      .add(ParamsKey.SIGN, Md5.hashStr(recordID + this.CLIENT_KEY))
      .build());
  }
  /**Request 2.21 User truy vấn thông tin bản ghi loto đã chơi*/
  requestLotoOnlineQuery(timeStart: string, timeEnd: string, state: number, type: number) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTOONLINE_QUERY, ParamBuilder.builder()
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .add(ParamsKey.STATE, state)
      .add(ParamsKey.TYPE, type)
      .build());
  }

  /**Request 2.21 User truy vấn thông tin bản ghi loto đã chơi. Truyền null để bỏ qua tham số*/
  requestLotoOnlineQueryIgnoreNull(timeStart: string, timeEnd: string, state: number, type: number) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTOONLINE_QUERY, ParamBuilder.builder()
      .addIgnoreNull(ParamsKey.TIME_START, timeStart)
      .addIgnoreNull(ParamsKey.TIME_END, timeEnd)
      .addIgnoreNull(ParamsKey.STATE, state)
      .addIgnoreNull(ParamsKey.TYPE, type)
      .build());
  }

  /**Request 2.22 Truy vấn thông tin bộ số mà hệ thống gợi ý*/
  requestLotoRecommendQuery(cateID: number, timeStart: string, timeEnd: string) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTO_RECOMMEND_QUERY, ParamBuilder.builder()
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .add(ParamsKey.CATE_ID, cateID)
      .build());
  }
  /**Request 2.23 User dự đoán kết quả*/
  requestLotoRecommendUserGuess(cateID: number, username: string, code: string) {
    return this.requestPost(this.SERVICE_URL + LotteryCmd.LOTO_RECOMMEND_USER_GUESS, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, cateID)
      .add(ParamsKey.USER_NAME, username)
      .add(ParamsKey.CODE, code)
      .add(ParamsKey.SIGN, Md5.hashStr(cateID + code))
      .build());
  }
  /**Request 2.24 User truy vấn dự đoán kết quả*/
  requestLotoRecommendUserQuery(cateID: number, username: string, timeStart: string, timeEnd: string) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTO_RECOMMEND_USER_QUERY, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, cateID)
      .add(ParamsKey.USER_NAME, username)
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .build());
  }
  /**Request 2.25 User truy vấn tổng hợp dữ liệu*/
  requestLotoRecommendTotal(amount: number) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTO_RECOMMEND_TOTAL, ParamBuilder.builder()
      .add(ParamsKey.AMOUNT, amount)
      .build());
  }
  /**Request 2.26 Thống kê tần suất loto xuất hiện trong 1 khoảng thời gian*/
  requestLotoRecentlyByMonths(number_of_month: number) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTO_RECENTLY_MONTH, ParamBuilder.builder()
      .add(ParamsKey.AMOUNT, number_of_month)
      .build());
  }
  /**Request 2.27 Thống kê tần suất loto xuất hiện trong 1 khoảng thời gian*/
  requestLotoContinuous(cateID: number) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTO_RECENTLY_MONTH, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, cateID)
      .build());
  }
  /**Request 2.28 Thống kê Top người chơi dự đoán có tỉ lệ trúng cao nhất*/
  requestLotoUserTop(timeStart: string, timeEnd: string, limit: number) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTO_RECOMMEND_TOP_USER, ParamBuilder.builder()
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .add(ParamsKey.LIMIT, limit)
      .build());
  }
  /**Request 2.29 Thống kê Top người chơi dự đoán có tỉ lệ trúng cao nhất*/
  requestLotoWeight(time: string, code: string) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTO_RECOMMEND_WEIGHT, ParamBuilder.builder()
      .add(ParamsKey.TIME, time)
      .add(ParamsKey.CODE, code)
      .build());
  }
  requestLotoTopWeight(time: string) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTO_RECOMMEND_WEIGHT, ParamBuilder.builder()
      .add(ParamsKey.TIME, time)
      .build());
  }
  /**Request 2.30 Thống kê giải đặc biệt trong năm*/
  requestSpecialPrize(cateID: number, year: string) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_SPECIAL_PRIZE, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, cateID)
      .add(ParamsKey.YEAR, year)
      .build());
  }

  /**Request 2.31 Thống kê tổng, đầu, đuôi giải đặc biệt trong năm*/
  requestSpecialPrizeCycle(timeStart: string, timeEnd: string, cateID: number) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTTERY_SPECIAL_PRIZE_CYCLE, ParamBuilder.builder()
      .add(ParamsKey.CATE_ID, cateID)
      .add(ParamsKey.TIME_START, timeStart)
      .add(ParamsKey.TIME_END, timeEnd)
      .build());
  }

  /**Request 2.32 Truy vấn user có tỉ lệ chơi trúng nhiều nhất */
  requestTopWinRateUser(limit: number, type: number) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTO_ONLINE_TOP_WIN_RATE_USER, ParamBuilder.builder()
      .addIgnoreNull(ParamsKey.LIMIT, limit)
      .addIgnoreNull(ParamsKey.TYPE, type)
      .build());
  }

  /**Request 2.33 Truy vấn user có nhiều tiền nhất */
  requestTopRichUser(limit: number) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTO_ONLINE_TOP_RICK_USER, ParamBuilder.builder()
      .addIgnoreNull(ParamsKey.LIMIT, limit)
      .build());
  }
  /**Request 2.34 Lấy danh sách loto hay lộn đầu đuôi */
  requestLotoNguocList() {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.APP_LOTO_NGUOC_LIST, ParamBuilder.builder()
      .build());
  }
  /**Request 2.35 Cập nhật danh sách các cặp số loto hay lộn */
  requestLotoNguocUpdate(list: string) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.APP_LOTO_NGUOC_UPDATE, ParamBuilder.builder()
      .add(ParamsKey.LIST, list)
      .build());
  }

  /**Request 2.34 Truy vấn số được đánh nhiều nhất trong ngày */
  requestTopLotoPlayed(date: string) {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.LOTO_ONLINE_TOP_PLAYED, ParamBuilder.builder()
      .addIgnoreNull(ParamsKey.DATE, date)
      .build());
  }

  /**Request 2.35 Truy vấn bật tắt thống kê */
  requestFunctionPermition() {
    return this.requestGet(this.SERVICE_URL + LotteryCmd.FUNCTION_PERMISSION, ParamBuilder.builder()
      .build());
  }
}
