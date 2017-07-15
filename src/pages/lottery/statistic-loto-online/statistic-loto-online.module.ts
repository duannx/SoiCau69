import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticLotoOnlinePage } from './statistic-loto-online';

@NgModule({
  declarations: [
    StatisticLotoOnlinePage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticLotoOnlinePage),
  ],
  exports: [
    StatisticLotoOnlinePage
  ]
})
export class StatisticLotoOnlinePageModule {}
