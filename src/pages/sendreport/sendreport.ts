import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from 'moment';
import { ApiService } from '../../providers/app.services';
import { HomePage } from '../home/home';
import { SigninPage } from '../signin/signin';
import { ReportHistoryPage } from '../reporthistory/reporthistory';

@Component({
  selector: 'page-sendreport',
  templateUrl: 'sendreport.html'
})
export class SendReportPage {
  reportForm: FormGroup;
  public loading: any;
  public alert: any;
  isSubmitted: boolean = false;
  user: any = JSON.parse(localStorage.getItem('globalassist'));
  isReadyOnly: Boolean = false;
  constructor(public formBuilder: FormBuilder, public alertController: AlertController, public navCtrl: NavController, private loaderCtrl: LoadingController, private toastCtrl: ToastController, private apiService: ApiService) {
    this.reportForm = this.formBuilder.group({
      Id: [0, [Validators.required]],
      UserId: [this.user.Id, [Validators.required]],
      AppMonth: [moment(new Date()).format('MMMM YYYY'), [Validators.required]],
      NoOfVillages: ["", [Validators.required]],
      NoOfPersonHeard: [0, [Validators.required]],
      NoOfMen: [0, [Validators.required]],
      NoOfWomen: [0, [Validators.required]],
      NoOfChildren: [0, [Validators.required]],
      NoOfNewGroup: ["", [Validators.required]],
      NoOfLevel1Leader: ["", [Validators.required]],
      NoOfLevel2Leader: ["", [Validators.required]],
      NoOfLevel3Leader: ["", [Validators.required]],
      NoOfVolunteers: ["", [Validators.required]],
      NoOfSocialProjects: ["", [Validators.required]],
      NoOfBeneficiaries: ["", [Validators.required]],
      isGoodPoints: ["No", [Validators.required]],
      GoodPoints: ["", []],
      isConcernReport: ["No", [Validators.required]],
      ConcernPoints: ["", []],
      isPhotoShared: ["Yes", [Validators.required]],
      isVideoShared: ["Yes", [Validators.required]],
      SupervisorRemarks: ["", []],
      CoordinatorRemarks: ["", []]
    });
    if (localStorage.getItem('reportId') && localStorage.getItem('reportId') != null)
      this.getReportById(localStorage.getItem('reportId'));
  }

  getReportById(reportId) {
    this.showLoading();
    this.apiService.getAll('/report/getreports', { OperationId: 2, ReportId: reportId }).subscribe(response => {
      if (!(response as any).isSuccess)
        this.presentToast((response as any).message);
      else
        this.setFormValue(response.data[0])
      this.dismissLoading();
    })
  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

  showLoading() {
    if (!this.loading) {
      this.loading = this.loaderCtrl.create({
        content: 'Loading..'
      });
      this.loading.present();
    }
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  get reportErrorControl() {
    return this.reportForm.controls;
  }

  onReportSubmit() {
    this.isSubmitted = true;
    if (this.reportForm.valid) {
      this.showLoading();
      this.apiService.create('/report/submitreport', this.reportForm.value).subscribe(response => {
        if ((response as any).isSuccess) {
          this.isSubmitted = false;
          this.reportForm.reset();
          localStorage.removeItem('reportId');
          localStorage.removeItem('readonly');
          this.navCtrl.setRoot(HomePage);
          this.presentToast(response.message);
        }
        else
          this.presentToast(response.message);
        this.dismissLoading();
      })
    }
  }

  reportAction(action) {
    this.showLoading();
    this.apiService.create('/report/approvereport', { RoleId: this.user.RoleId, ReportId: this.reportForm.get('Id').value, userId: this.user.Id, isApproved: action == 'approve' ? true : false, Remarks: this.user.RoleId == '3' ? this.reportForm.value.CoordinatorRemarks : this.reportForm.value.SupervisorRemarks }).subscribe(response => {
      if ((response as any).isSuccess) {
        this.presentToast((response as any).message);
      }
      else
        this.presentToast((response as any).message);
      this.dismissLoading();
    })
  }

  setFormValue(response) {
    this.reportForm.patchValue({
      Id: response.Id,
      AppMonth: response.AppMonth,
      NoOfVillages: response.NoOfVillages,
      NoOfPersonHeard: response.NoOfPersonHeard,
      NoOfMen: response.NoOfMen,
      NoOfWomen: response.NoOfWomen,
      NoOfChildren: response.NoOfChildren,
      NoOfNewGroup: response.NoOfNewGroup,
      NoOfLevel1Leader: response.NoOfLevel1Leader,
      NoOfLevel2Leader: response.NoOfLevel2Leader,
      NoOfLevel3Leader: response.NoOfLevel3Leader,
      NoOfVolunteers: response.NoOfVolunteers,
      NoOfSocialProjects: response.NoOfSocialProjects,
      NoOfBeneficiaries: response.NoOfBeneficiaries,
      isGoodPoints: response.isGoodPoints,
      isConcernReport: response.isConcernReport,
      GoodPoints: response.GoodPoints,
      ConcernPoints: response.ConcernPoints,
      isPhotoShared: response.isPhotoShared,
      isVideoShared: response.isVideoShared,
      SupervisorRemarks: response.SupervisorRemarks == null ? '' : response.SupervisorRemarks,
      CoordinatorRemarks: response.CoordinatorRemarks == null ? '' : response.CoordinatorRemarks,
    })
    if (localStorage.getItem('readonly') && localStorage.getItem('readonly') != null && (localStorage.getItem('readonly') == 'true')) {
      this.isReadyOnly = true;
      this.reportForm.disable();
      let control: any;
      if (localStorage.getItem('roleId') == "3") {
        control = this.reportForm.get('CoordinatorRemarks');
        control.disabled ? control.enable() : control.disable();
      }
      else if (localStorage.getItem('roleId') == "4") {
        control = this.reportForm.get('SupervisorRemarks');
        control.disabled ? control.enable() : control.disable();
      }
    }

  }

  ngOnDestroy() {
    localStorage.removeItem('reportId');
    localStorage.removeItem('readonly');
  }

  getPersonHeard() {
    let number = parseInt(this.reportForm.value.NoOfMen) + parseInt(this.reportForm.value.NoOfWomen) + parseInt(this.reportForm.value.NoOfChildren);
    this.reportForm.patchValue({ NoOfPersonHeard: number });
  }
  openHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

  logout() {
    if (!this.alert) {
      this.alert = this.alertController.create({
        cssClass: 'my-custom-class',
        message: 'Do you want to <strong>logout</strong>!!!',
        enableBackdropDismiss: true,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              this.navCtrl.setRoot(HomePage, { animated: true, animationDirection: 'forward' });
            }
          }, {
            text: 'Okay',
            handler: () => {
              localStorage.removeItem('globalassist');
              this.navCtrl.setRoot(SigninPage, { animated: true, animationDirection: 'forward' });
            }
          }
        ]
      });
      this.alert.present();
    }
  }

  dismissAlert() {
    if (this.alert) {
      this.alert.dismiss();
      this.alert = null;
    }
  }

  openHistory() {
    this.navCtrl.setRoot(ReportHistoryPage);
  }
}
