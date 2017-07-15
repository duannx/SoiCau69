import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotterySettingPage } from './lottery-setting';

@NgModule({
  declarations: [
    LotterySettingPage,
  ],
  imports: [
    IonicPageModule.forChild(LotterySettingPage),
  ],
  exports: [
    LotterySettingPage
  ]
})
export class LotterySettingModule {}
