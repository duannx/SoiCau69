import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotteryDreamBookPage } from './lottery-dream-book';

@NgModule({
  declarations: [
    LotteryDreamBookPage,
  ],
  imports: [
    IonicPageModule.forChild(LotteryDreamBookPage),
  ],
  exports: [
    LotteryDreamBookPage
  ]
})
export class LotteryDreamBookModule {}
