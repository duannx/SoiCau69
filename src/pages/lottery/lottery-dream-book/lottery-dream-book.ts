import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Searchbar, LoadingController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { LotteryDBCenter } from '../../../providers/lottery/lottery';
import { AppLoop } from '../../../providers/app-loop';
import { LotteryDream } from '../../../providers/lottery/lottery-dream';
import { Utils } from '../../../providers/app-utils';


@IonicPage()
@Component({
  selector: 'page-lottery-dream-book',
  templateUrl: 'lottery-dream-book.html',
})
export class LotteryDreamBookPage {
  @ViewChild("mSearchBar") mSearchbar: Searchbar;
  estimateItemCount = 1000;
  dreams: Array<LotteryDream> = [];
  dreams_filtered: Array<LotteryDream> = [];
  mSearchInput: string = "";
  mShouldShowCancel: boolean = true;
  mLoading: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public mLotteryDBCenter: LotteryDBCenter,
    private mMenuController: MenuController, public loadingCtrl: LoadingController, private storage: Storage) {
  }

  ionViewDidEnter() {

    this.storage.get('dreamBook').then(data => {
      if (data == null || data == undefined) {
        this.requestDreamBook();
        return
      }; 
      data.forEach(element => {
        let dream = new LotteryDream();
        dream.onResponseDream(element);
        this.dreams.push(dream);
      });
      if (this.dreams.length < this.estimateItemCount) {
        this.requestDreamBook();
      } else {
        this.dreams_filtered = this.dreams;
        this.mLotteryDBCenter.mDreamBook.dreams = this.dreams;
        this.mLotteryDBCenter.mDreamBook.count = this.dreams.length;
      }
    }, error => {
      console.log(error, error.message);
      this.requestDreamBook();
    })

  }
  requestDreamBook() {
    let loading = this.loadingCtrl.create({
      content: "Đang tải dữ liệu",
      duration: 5000,
      dismissOnPageChange: true
    })
    loading.present();
    this.dreams = [];
    this.dreams = this.mLotteryDBCenter.mDreamBook.dreams;
    if (this.dreams.length < this.estimateItemCount) {
      this.dreams = [];
      this.mLotteryDBCenter.getLotteryHttpService().requestDreamBook("0-2000", "", "").then(data => {
        this.onResponseDreamBook(data);
        loading.dismiss();
      })
    } else {
      this.dreams_filtered = this.dreams;
      loading.dismiss();
      this.storage.set("dreamBook", this.dreams).then(() => console.log('Stored item!'),
        error => console.error('Error storing item', error));
    }
  }
  onResponseDreamBook(data) {
    data.content.forEach(element => {
      let dream = new LotteryDream();
      dream.onResponseDream(element);
      this.dreams.push(dream);
    });
    this.dreams_filtered = this.dreams;
    this.mLotteryDBCenter.mDreamBook.dreams = this.dreams;
    this.mLotteryDBCenter.mDreamBook.count = this.dreams.length;
    this.storage.set("dreamBook", this.dreams).then(() => console.log('Stored item!'),
      error => console.error('Error storing item', error));
  }

  //trackby function for virtual scroll
  trackBy(index, item) {
    return item ? item.id : undefined;
  }

  onClickOpenMenu() {
    this.mMenuController.open("lottery");
  }
  onSearchInput() {
    let query: string = this.mSearchInput.toLocaleLowerCase().trim();

    if (Utils.kiemTraToanDauCach(query)) {
      if (this.dreams_filtered.length != this.dreams.length)
        this.dreams_filtered = this.dreams;
      return;
    }
    this.dreams_filtered = this.dreams.filter(elm => {
      return (elm.search.indexOf(query) !== -1) || (elm.search.indexOf(Utils.bodauTiengViet(query)) !== -1)
    })
  }

  onSearchCancel() {
    this.dreams_filtered = this.dreams;
  }
  onClickSearch() {
    this.mSearchbar.setFocus();
  }
}
