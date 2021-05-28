import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { IonicImageViewerModule } from 'ionic-img-viewer';

import { SigninPage } from '../pages/signin/signin';
import { HomePage } from '../pages/home/home';
import { SendReportPage } from '../pages/sendreport/sendreport';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiService } from '../providers/app.services';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApprovalPage } from '../pages/approval/approval';
import { ReportHistoryPage } from '../pages/reporthistory/reporthistory';

@NgModule({
  declarations: [
    MyApp,
    SigninPage,
    HomePage,
    SendReportPage,
    ApprovalPage,
    ReportHistoryPage
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SigninPage,
    HomePage,
    SendReportPage,
    ApprovalPage,
    ReportHistoryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    IonicImageViewerModule,
    ApiService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {
}
