import { Component } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppController } from '../providers/app-controller';
import { LotteryDBCenter } from '../providers/lottery/lottery';
import { LotteryHomePage } from '../pages/lottery/lottery-home/lottery-home'


export class MenuItem {
  name: string;
  id: number;
  icon: string;
  page: string;
  isActive: boolean
}
export class MenuCategory {
  id: number;
  name: string;
  items: Array<MenuItem>;
}
export class Menu {
  id: number;
  name: string;
  active: boolean;
  categories: Array<MenuCategory>;
}
export class AppMenu {
  menus: Array<Menu>;
}
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = "LotteryLoadingPage";
  //rootPage: any = "BusRouteList";
  mMenuController: MenuController; 
  mLotteryMenu: any = [];

  mLotteryMenuOther: Array<MenuItem> = [];
  constructor(public mLotteryDBCenter: LotteryDBCenter, private menuController: MenuController, public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      splashScreen.hide();
      AppController.getInstance().setPlatform(platform);
      this.mLotteryMenu = this.mLotteryDBCenter.mLotteryMenu;
    });
  }
  onClickLotteryUser() {
    this.menuController.close().then(() => {
      AppController.getInstance().getNavController().setRoot("LotteryUserInfoPage");
    });
  }

  onClickLotteryMenuItem(category: MenuCategory, item: MenuItem) { 
    this.menuController.close()
    if (!AppController.getInstance().hasNavController()) return;
    this.setItemActive(item.page);
    //LotteryHomePage no more lazy loading
    if (item.page == "LotteryHomePage") AppController.getInstance().getNavController().setRoot(LotteryHomePage);
    else
      AppController.getInstance().getNavController().setRoot(item.page);
  }
  setItemActive(page: string) {
    if (page && page.length > 0) {
      this.mLotteryDBCenter.setMenuActive(page);
    }
  }

  onClickExitApps() {
    AppController.getInstance().doExitApps();
  }
}
