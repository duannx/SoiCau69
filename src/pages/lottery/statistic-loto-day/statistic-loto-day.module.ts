import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticLotoDayPage } from './statistic-loto-day';

@NgModule({
  declarations: [
    StatisticLotoDayPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticLotoDayPage),
  ],
  exports: [
    StatisticLotoDayPage
  ]
})
export class StatisticLotoDayPageModule {}
