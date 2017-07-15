import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotteryLoadingPage } from './lottery-loading';

@NgModule({
  declarations: [
    LotteryLoadingPage,
  ],
  imports: [
    IonicPageModule.forChild(LotteryLoadingPage),
  ],
  exports: [
    LotteryLoadingPage
  ]
})
export class LotteryLoadingPageModule {}
