export class LotteryCmd {
  public static LOGIN: string = "user/login";
  /**Danh sach loai xo so : TT, MT,MN, Vietlott */
  public static LIST_TYPES: string = "category/type";
  public static CATEGORIES: string = "category/category";
  public static LOTTERY_RESULT: string = "lottery/result/query";
  public static LOTTERY_NEAREST_DAY: string = "lottery/nearest_day";
  public static DREAMBOOK: string = "dreambook/query";
  public static LOTTERY_LOGAN: string = "lottery/lo_gan";
  public static LOTTERY_LOMAXGAN: string = "lottery/lo_max_gan";
  public static LOTTERY_VIETLOTT_JACKPOT: string = "lottery/vietlott/jackpot";

  public static ANALYTICS_LOTO_FREQUENTLY: string = "lottery/analystics/loto";
  public static ANALYTICS_LOTO_BY_DAY: string = "lottery/analytics/loto_by_day";
  public static ANALYTICS_LOTO_QUICK: string = "lottery/analytics/quick_analytics";
  public static ANALYTICS_LOTO_SUM: string = "lottery/analytics/thong_ke_tong";
  public static ANALYTICS_LOTO_TOMORROW: string = "lottery/analytics/thong_ke_ngay_mai";
  public static LOTTERY_SOICAU: string = "lottery/soi_cau";
  public static USER_UPDATE_INFO: string = "user/update_info";
  public static USER_INFO: string = "user/info";
  public static APP_CONFIG: string = "app/getconfig";
  public static LOTOONLINE_ADD_RECORD: string = "loto_online/add_record";
  public static LOTOONLINE_DELETE_RECORD: string = "loto_online/delete_record";
  public static LOTOONLINE_QUERY: string = "loto_online/query";
  public static LOTO_RECOMMEND_QUERY: string = "loto_recommend/system/query";
  public static LOTO_RECOMMEND_USER_GUESS: string = "loto_recommend/user/add_record";
  public static LOTO_RECOMMEND_USER_QUERY: string = "loto_recommend/user/query";
  public static LOTO_RECOMMEND_TOTAL: string = "loto_recommend/query_total_record";
  public static LOTO_RECENTLY_MONTH: string = "lottery/analytics/tan_suat";
  public static ANALYTICS_LOTO_CONTINUOUS: string = "lottery/analytics/xuat_hien_lien_tiep";
  public static LOTO_RECOMMEND_TOP_USER: string = "loto_recommend/user/query_top_user";
  public static LOTO_RECOMMEND_WEIGHT: string = "loto_recommend/calculate_weight";
  public static LOTTERY_SPECIAL_PRIZE: string = "lottery/analytics/dac_biet";
  public static LOTTERY_SPECIAL_PRIZE_CYCLE: string = "lottery/analytics/chu_ki_dac_biet";
  public static LOTO_ONLINE_TOP_WIN_RATE_USER: string = "loto_online/query/top_win_rate_user";
  public static LOTO_ONLINE_TOP_RICK_USER: string = "loto_online/query/rich_user";
  public static APP_LOTO_NGUOC_LIST: string = "app/get_loto_nguoc";
  public static APP_LOTO_NGUOC_UPDATE: string = "app/update_loto_nguoc";
  public static LOTO_ONLINE_TOP_PLAYED: string = "loto_online/query/top_play_code";
  public static FUNCTION_PERMISSION: string = "app/get_permited_func";  
}
