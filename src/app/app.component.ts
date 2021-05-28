import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, Events } from 'ionic-angular';

import { SigninPage } from '../pages/signin/signin';
import { HomePage } from '../pages/home/home';
import { SendReportPage } from '../pages/sendreport/sendreport';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ReportHistoryPage } from '../pages/reporthistory/reporthistory';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HomePage the root (or first) page
  rootPage: any;
  username: any = 'Global Assist';
  pages: Array<{ title: string, component: any, icon: string, isshow: boolean }>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    events: Events,
  ) {
    this.initializeApp();
    events.subscribe('user:signin', data => {
      this.getSideMenu(data);
    });
    this.getSideMenu();
  }

  getSideMenu(data = null) {
    let loggedUser = JSON.parse(localStorage.getItem('globalassist'));
    if (data != null)
      loggedUser = JSON.parse(data);
    if (loggedUser !== null) {
      this.username = loggedUser.FirstName + ' ' + loggedUser.LastName;
      this.pages = [
        { title: 'Profile', component: HomePage, icon: 'contact', isshow: true },
        { title: 'Send Report', component: SendReportPage, icon: 'folder', isshow: loggedUser.RoleId == '5' ? true : false },
        { title: 'Approval', component: SendReportPage, icon: 'thumbs-up', isshow: loggedUser.RoleId == '4' ? true : false },
        { title: 'Report Histroy', component: ReportHistoryPage, icon: 'thumbs-up', isshow: loggedUser.RoleId == '4' ? true : false },
      ];
    }
  }

  initializeApp() {
    let loggedUser = JSON.parse(localStorage.getItem('globalassist'));
    if (loggedUser == null)
      this.rootPage = SigninPage;
    else
      this.rootPage = HomePage;
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page.component);
  }
}
