import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotteryTopGuessPage } from './lottery-topguess';

@NgModule({
  declarations: [
    LotteryTopGuessPage,
  ],
  imports: [
    IonicPageModule.forChild(LotteryTopGuessPage),
  ],
  exports: [
    LotteryTopGuessPage
  ]
})
export class LotteryTopGuessPageModule {}
