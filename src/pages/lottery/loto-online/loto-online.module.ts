import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotoOnlinePage } from './loto-online';
import { LotteryPlayPage } from '../lottery-play/lottery-play';
import { LotoOnlineStatisticPage } from '../loto-online-statistic/loto-online-statistic'
@NgModule({
  declarations: [
    LotoOnlinePage,
    LotteryPlayPage,
    LotoOnlineStatisticPage
  ],
  imports: [
    IonicPageModule.forChild(LotoOnlinePage)
  ],
  exports: [
    LotoOnlinePage
  ]
})
export class LotoOnlinePageModule { }
