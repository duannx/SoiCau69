import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { LotteryDBCenter } from '../../../providers/lottery/lottery';
import { AppLoop } from '../../../providers/app-loop';
import { AppInterface, ResponseCode } from '../../../providers/app-constant';
import { DeviceInfoProvider } from '../../../providers/device-info/device-info';
import { Device } from "@ionic-native/device";
import { AppController } from '../../../providers/app-controller';
import Chart from "chart.js";
@IonicPage()
@Component({
  selector: 'page-lottery-loading',
  templateUrl: 'lottery-loading.html',
})
export class LotteryLoadingPage {
  app: AppInterface;
  constructor(
    private storage: Storage,
    private device: Device,
    private mPlatform: Platform,
    private mDeviceInfoProvider: DeviceInfoProvider,
    private navParams: NavParams,
    private mLotteryDBCenter: LotteryDBCenter,
    private navCtrl: NavController,
    private mMenuController: MenuController,
    private mLoadingController: LoadingController, ) {
    this.app = this.navParams.get('app');

  }
  ionViewDidEnter() {
    this.mMenuController.enable(false, "lottery");
    AppController.getInstance().setNavController(this.navCtrl);
    AppController.getInstance().setLoadingController(this.mLoadingController);
    AppController.getInstance().setPlatform(this.mPlatform);
    /**
     * To do :
     * - Lấy thông tin devices.
     * - Lấy thông tin đã cached.
     * - Tự động đăng nhập.
     * - Tự động lấy thông tin cá nhân
     * - Chuyển Pages
     *
     */
    AppLoop.getInstance().start();
    this.registerChardDrawLabels();
    this.mPlatform.ready().then(() => {
      this.onPlatformReady();
    });
  }
  registerChardDrawLabels() {
    Chart.plugins.register({
      afterDatasetsDraw: function (chart, easing) {
        // To only draw at the end of animation, check for easing === 1
        var ctx = chart.ctx;

        chart.data.datasets.forEach(function (dataset, i) {
          var meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach(function (element, index) {

              ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
              // Just naively convert to string for now
              var dataString = dataset.data[index].toString();

              // Make sure alignment settings are correct
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';

              var padding = 5;
              var position = element.tooltipPosition();
              ctx.fillText(dataString, position.x, position.y - (Chart.defaults.global.defaultFontSize / 2) - padding);
            });
          }
        });
      }
    });

  }
  onPlatformReady() {
    this.doCheckNetwork().then(
      data => { this.onHasNetwork(); },
      error => { }
    );
  }
  doCheckNetwork() {
    return new Promise((success, fail) => {
      success();
    });
  }
  onHasNetwork() {
    this.getDeviceInfos();
    this.getDataFromCache();
    this.doAutoLogin();
    this.doSwitchPage();
  }
  getDeviceInfos() {
    this.mDeviceInfoProvider.mUserDevice.createDefault();
    if (this.device.uuid != null) {
      this.mDeviceInfoProvider.mUserDevice.cordova = this.device.cordova;
      this.mDeviceInfoProvider.mUserDevice.manufacture = this.device.manufacturer;
      this.mDeviceInfoProvider.mUserDevice.model = this.device.model;
      this.mDeviceInfoProvider.mUserDevice.platform = this.device.platform;
      this.mDeviceInfoProvider.mUserDevice.serial = this.device.serial;
      this.mDeviceInfoProvider.mUserDevice.uuid = this.device.uuid;
      this.mDeviceInfoProvider.mUserDevice.version = this.device.version;
    }
  }
  getDataFromCache() {
    /**1. Lấy thông tin về types */
    /**2. Lấy thông tin về dreambooks */
    /**3. Lấy thông tin về lotos */

    let types = this.storage.get("types").then(val => {
    });

  }
  doAutoLogin() {
    this.mLotteryDBCenter.getLotteryHttpService().requestLogin(this.mDeviceInfoProvider.getPlatform(), this.mDeviceInfoProvider.getVersion(), this.mDeviceInfoProvider.getDeviceName(), this.mDeviceInfoProvider.getDeviceID()).then(
      data => {
        this.onLoginData(data);
      },
      error => {
        this.onLoginError(error);
      }
    );
  }

  onLoginData(data) {
    if (data.status == ResponseCode.SUCCESS) {
      this.mLotteryDBCenter.mUser.onResponseLogin(data);
    }
    this.getUserInfo();
    this.mLotteryDBCenter.start();
  }
  onLoginError(error) {

  }

  getUserInfo() {
    this.mLotteryDBCenter.getLotteryHttpService().requestUserInfo(this.mLotteryDBCenter.mUser.username).then(
      data => {
        this.onUserInfoData(data);
      },
      error => {

      }
    );
  }
  onUserInfoData(data) {
    if (data.status == ResponseCode.SUCCESS) {
      this.mLotteryDBCenter.mUser.onResponseUserInfo(data);
    }
  }
  doSwitchPage() {
    setTimeout(() => {
      this.navCtrl.setRoot("LotteryRootPage");
    }, 2000);
  }
}
