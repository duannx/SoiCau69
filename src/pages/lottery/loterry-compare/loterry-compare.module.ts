import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoterryComparePage } from './loterry-compare';

@NgModule({
  declarations: [
    LoterryComparePage,
  ],
  imports: [
    IonicPageModule.forChild(LoterryComparePage),
  ],
  exports: [
    LoterryComparePage
  ]
})
export class LoterryComparePageModule {}
