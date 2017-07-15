import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticLotoRecommendPage } from './statistic-loto-recommend';

@NgModule({
  declarations: [
    StatisticLotoRecommendPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticLotoRecommendPage),
  ],
  exports: [
    StatisticLotoRecommendPage
  ]
})
export class StatisticLotoRecommendPageModule { }
