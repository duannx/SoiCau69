import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticLotoQuickPage } from './statistic-loto-quick';

@NgModule({
  declarations: [
    StatisticLotoQuickPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticLotoQuickPage),
  ],
  exports: [
    StatisticLotoQuickPage
  ]
})
export class StatisticLotoQuickPageModule {}
