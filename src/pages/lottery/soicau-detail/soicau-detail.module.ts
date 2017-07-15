import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SoicauDetailPage } from './soicau-detail';

@NgModule({
  declarations: [
    SoicauDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SoicauDetailPage),
  ],
  exports: [
    SoicauDetailPage
  ]
})
export class SoicauDetailPageModule {}
