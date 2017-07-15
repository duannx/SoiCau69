import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotteryUserInfoPage } from './lottery-user-info';

@NgModule({
  declarations: [
    LotteryUserInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(LotteryUserInfoPage),
  ],
  exports: [
    LotteryUserInfoPage
  ]
})
export class LotteryUserInfoModule {}
