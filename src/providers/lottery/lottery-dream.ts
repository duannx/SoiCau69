import { Utils } from '../app-utils';
import { ResponseCode } from '../app-constant';

export class LotteryDream {
  id: number;
  content: string;
  code: string;
  search: string;
  onResponseDream(data) {
    this.id = data.id;
    this.content = data.content;
    this.code = data.code;
    this.onDataChanged();
  }
  onDataChanged() {
    let en: string = Utils.bodauTiengViet(this.content);
    this.search = en + " " + this.code;
    let words = en.split(" ");
    if (words.length > 1) {
      this.search += " ";
      for (let word of words) {
        if (word.length > 0) {
          this.search += word.charAt(0);
        }
      }
    }
    this.search += " " + this.content;
  }
}
export class DreamBook {
  dreams: Array<LotteryDream> = [];
  count: number = 2000;
  onResponseDreamBook(data) { 
    if (data.status == ResponseCode.SUCCESS) {
      this.count = data.meta.amount;
      for (let dreamData of data.content) {
        let lotteryDream = new LotteryDream();
        lotteryDream.onResponseDream(dreamData);
        this.dreams.push(lotteryDream);
      }
    }
  }
}