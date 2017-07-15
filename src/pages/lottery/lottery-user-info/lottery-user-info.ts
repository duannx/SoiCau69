import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Alert, AlertController, ToastController } from 'ionic-angular';
import { LotteryDBCenter } from '../../../providers/lottery/lottery';
import { DeviceInfoProvider } from '../../../providers/device-info/device-info';

import { Utils } from '../../../providers/app-utils';
@IonicPage()
@Component({
  selector: 'page-lottery-user-info',
  templateUrl: 'lottery-user-info.html',
})
export class LotteryUserInfoPage {
  constructor(
    private mToastController: ToastController,
    private mDeviceInfoProvider: DeviceInfoProvider,
    private mAlerController: AlertController,
    private mLotteryDBCenter: LotteryDBCenter,
    private navCtrl: NavController,
    private mMenuController: MenuController) {

  }

  ionViewDidEnter() {

  }

  onClickUserMoney() {
    this.navCtrl.setRoot("LotteryUserMoneyPage", {}, {
      animate: true,
      animation: 'switch',
      duration: 400
    });
  }
  onClickEditName() {
    //this.doNotifyDoing();
    let alert = this.mAlerController.create({
      title: "Cập nhật tên hiển thị",
      message: "Tên hiển thị có từ 6-20 ký tự, không trùng tên đăng nhập, không gồm các ký tự đặc biệt.",
      inputs: [
        {
          type: "text",
          value: this.mLotteryDBCenter.mUser.name,
          name: 'name'
        }
      ],
      buttons: [{
        text: "Cancel"
      }, {
        text: "Ok",
        handler: (data) => {
          this.onUpdateName(data);
        }
      }]
    });
    alert.present();
  }
  onClickEditPhone() {
    let alert = this.mAlerController.create({
      title: "Cập nhật số điện thoại",
      message: "Vui lòng nhập đúng số điện thoại bạn đang dùng để nhận được tư vấn, giúp đỡ khi có vấn đề xảy ra, xin cảm ơn",
      inputs: [
        {
          type: "tel",
          value: "",
          name: 'phone'
        }
      ],
      buttons: [{
        text: "Cancel"
      }, {
        text: "Ok",
        handler: (data) => {
          this.onUpdatePhone(data);
        }
      }]
    });
    alert.present();
    //this.doNotifyDoing();
  }
  onClickEditAddress() {
    //  this.doNotifyDoing();
    let alert = this.mAlerController.create({
      title: "Cập nhật địa chỉ hiện tại",
      message: "Vui lòng nhập chính xác địa chỉ hiện tại của bạn.",
      inputs: [
        {
          type: "text",
          value: "",
          name: 'address'
        }
      ],
      buttons: [{
        text: "Cancel"
      }, {
        text: "Ok"
      }]
    });
    alert.present();
  }
  onClickEditGender() {
    this.doNotifyDoing();
  }
  onClickEditAvatar() {
    this.doNotifyDoing();
  }
  doNotifyDoing() {
    let alert = this.mAlerController.create({
      title: "Opps !",
      message: "Chức năng đang được phát triển, vui lòng thử lại sau !",
      buttons: ["OK"]
    });
    alert.present();
  }

  onUpdatePhone(data) {
    if (!Utils.isValidPhone(data.phone)) {
      this.showToast("Số điện thoại không hợp lệ", 2000);
      return;
    }
    this.mLotteryDBCenter.getLotteryHttpService().requestUserUpdateInfo(this.mLotteryDBCenter.mUser.name, this.mLotteryDBCenter.mUser.avatar, data.phone, this.mDeviceInfoProvider.getDeviceID()).then(
      response => {
        if (response['status'] == 1) {
          this.mLotteryDBCenter.mUser.phone = data.phone;
        } else {
          this.showToast(response['message'], 2000);
        }
      },
      error => {

      }
    );
  }
  onUpdateName(data) {

    if (!Utils.isValidUsername(data.name)) {
      this.showToast("Tên hiển thị không hợp lệ", 2000);
      return;
    }
    this.mLotteryDBCenter.getLotteryHttpService().requestUserUpdateInfo(data.name, this.mLotteryDBCenter.mUser.avatar, this.mLotteryDBCenter.mUser.phone, this.mDeviceInfoProvider.getDeviceID()).then(
      response => {
        if (response['status'] == 1) {
          this.mLotteryDBCenter.mUser.name = data.name;
        } else {
          this.showToast(response['message'], 2000);
        }
      },
      error => {

      }
    );
  }
  showToast(message: string, duration: number) {
    let toast = this.mToastController.create({
      message: message,
      duration: duration
    });
    toast.present();
  }
  getUserPhone(): string {
    if (this.mLotteryDBCenter.mUser.phone.length == 0) return "Chưa xác định";
    return this.mLotteryDBCenter.mUser.phone;
  }
  getUserAddress(): string {
    if (this.mLotteryDBCenter.mUser.address.length == 0) return "Chưa xác định";
    return this.mLotteryDBCenter.mUser.address;
  }
  getUserSex(){
     if (this.mLotteryDBCenter.mUser.gender.length == 0) return "Chưa xác định";
    return this.mLotteryDBCenter.mUser.gender;
  }
}
