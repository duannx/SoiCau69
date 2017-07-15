import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticNextDayPage } from './statistic-next-day';

@NgModule({
  declarations: [
    StatisticNextDayPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticNextDayPage),
  ],
  exports: [
    StatisticNextDayPage
  ]
})
export class StatisticNextDayPageModule {}
