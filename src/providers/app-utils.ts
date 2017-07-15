export class Utils {
  public static reg_phone = /^[0-9+]{6,12}$/;
  public static reg_number = /^[0-9+]$/;
  public static reg_username = /^[A-Za-z0-9_-]{6,20}$/;
  public static reg_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  public static isNumber(char: string) {
    return this.reg_number.test(char);
  }
  public static isValidUsername(username) {
    return this.reg_username.test(username);
  }
  public static isValidPhone(phone) {
    return this.reg_phone.test(phone);
  }
  public static isValidEmail(email) {
    return this.reg_email.test(email);
  }

  public static clamp(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }
  public static nFormatter(num: number, units?: Array<string>) {
    let unitArray = ["G", "M", "K"];
    if (units && units != undefined && units.length >= 3) unitArray = units;
    let isNegative = false
    if (num < 0) {
      isNegative = true
    }
    num = Math.abs(num)
    let formattedNumber = '';
    if (num >= 1000000000) {
      formattedNumber = (num / 1000000000).toFixed(1).replace(/\.0$/, '') + unitArray[0];
    } else if (num >= 1000000) {
      formattedNumber = (num / 1000000).toFixed(1).replace(/\.0$/, '') + unitArray[1];
    } else if (num >= 1000) {
      formattedNumber = (num / 1000).toFixed(1).replace(/\.0$/, '') + unitArray[2];
    } else {
      formattedNumber = num + '';
    }
    if (isNegative) { formattedNumber = '-' + formattedNumber }
    return formattedNumber;
  }

  public static bodauTiengViet(str: string): string {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    // str = str.replace(/\W+/g, ' ');
    // str = str.replace(/\s/g, '-');
    return str;
  }
  public static kiemTraToanDauCach(str: string): boolean {
    return str.trim().length == 0;
  }
  public static randInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  public static getRequestDate(date: Date): string {
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return date.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  }
  public static getViewDate(date: Date): string {
    let m: number = (date.getMonth() + 1);
    let d: number = date.getDate();
    return (d < 10 ? "0" : "") + d + "/" + (m < 10 ? "0" : "") + m + "/" + date.getFullYear();
  }

  public static getTimeBefore(date: Date, days: number): number {
    return date.getTime() - days * 86400000;
  }
  public static getTimeAfter(date: Date, days: number): number {
    return date.getTime() + days * 86400000;
  }
}