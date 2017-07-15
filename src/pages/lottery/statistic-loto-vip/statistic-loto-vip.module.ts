import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticLotoVipPage } from './statistic-loto-vip';

@NgModule({
  declarations: [
    StatisticLotoVipPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticLotoVipPage),
  ],
  exports: [
    StatisticLotoVipPage
  ]
})
export class StatisticLotoVipPageModule { }
