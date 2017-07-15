import { ResponseCode } from '../app-constant';

export class LotteryCategory {
  id: number;
  name: string;
  constructor() {
    this.id = 1;
    this.name = "Truyền thống";
  }
  onResponseCategory(data): void {
    this.id = data.id;
    this.name = data.title;
  }
}


export class LotteryType {
  id: number;
  name: string;
  title: string;
  nearest: Date;
  categories: Array<LotteryCategory> = [];

  constructor() {
    this.id = 1;
    this.name = "Truyền thống";
    this.title = "Xổ số truyền thống";
    this.nearest = new Date();
  }
  /**Kết quả trả về từ request các loại hình loại xổ số */
  onResponseType(data) {
    this.id = data.id;
    this.name = data.title;
    this.title = this.name.replace("Xổ số ", "");
  }
  /**Kết quả trả về từ request các danh mục con của xổ số */
  onResponseCategories(data) {
    if (data.status == ResponseCode.SUCCESS) {
      this.categories = [];
      for (let categoryData of data.content) {
        let category = new LotteryCategory();
        category.onResponseCategory(categoryData);
        this.categories.push(category);
      }
    }
  }
}
