import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DauTuHelpPage } from './dautu-help';

@NgModule({
  declarations: [
    DauTuHelpPage,
  ],
  imports: [
    IonicPageModule.forChild(DauTuHelpPage),
  ],
  exports: [
    DauTuHelpPage
  ]
})
export class DauTuHelpPageModule {}
