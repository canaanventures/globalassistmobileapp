import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from '../../providers/app.services';
import { SendReportPage } from '../sendreport/sendreport';
import * as moment from 'moment';
import { ApprovalPage } from '../approval/approval';
import { SigninPage } from '../signin/signin';
import { ReportHistoryPage } from '../reporthistory/reporthistory';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  greetings: any;
  profileForm: FormGroup;
  public loading: any;
  public alert: any;
  isSubmitted: boolean = false;
  user: any = JSON.parse(localStorage.getItem('globalassist'));
  constructor(public formBuilder: FormBuilder, public alertController: AlertController, public navCtrl: NavController, private loaderCtrl: LoadingController, private toastCtrl: ToastController, private apiService: ApiService) {
    this.profileForm = this.formBuilder.group({
      Id: [0, [Validators.required]],
      Salutations: ["Mr.", [Validators.required]],
      FirstName: ["", [Validators.required]],
      LastName: ["", [Validators.required]],
      EmailId: ["", [Validators.required]],
      PhoneNo: ["", [Validators.required]],
      Rolename: ["", [Validators.required]],
      RoleId: ["", [Validators.required]],
      Address: ["", []],
      State: ["", []],
      Country: ["", []],
      Pincode: ["", []],
      isActive: [false, [Validators.required]],
      OrgName: ["", []],
      OrgId: ["", []],
      SupervisorId: ["", []],
      Supervisor: ["", []],
      CoordinatorId: ["", []],
      Coordinator: ["", []],
      userId: [this.user.Id, [Validators.required]]
    })
    this.setFormValue(this.user)
    this.greeting();
  }

  greeting() {
    const hour = moment().hour();
    this.greetings = 'Good morning';
    if (hour > 16) {
      this.greetings = "Good evening";
    }

    if (hour > 11) {
      this.greetings = "Good afternoon";
    }
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

  get profileErrorControl() {
    return this.profileForm.controls;
  }

  setFormValue(data) {
    this.profileForm.patchValue({
      Id: data.Id,
      Salutations: data.Salutations,
      FirstName: data.FirstName,
      LastName: data.LastName,
      EmailId: data.EmailId,
      PhoneNo: data.PhoneNo,
      RoleId: data.RoleId,
      isActive: data.isActive,
      Rolename: data.Rolename
    });
    if (this.user.RoleId != 1) {
      this.profileForm.patchValue({
        OrgId: data.OrgId,
        OrgName: data.OrgName,
        Address: data.Address,
        State: data.State,
        Country: data.Country,
        Pincode: data.Pincode,
        CoordinatorId: data.CoordinatorId,
        SupervisorId: data.SupervisorId,
        Supervisor: data.Supervisor,
        Coordinator: data.Coordinator
      })
    }
  }

  onProfileSubmit() {
    this.isSubmitted = true;
    if (this.profileForm.valid) {
      this.showLoading();
      this.apiService.create('/user/addusers', this.profileForm.value).subscribe(response => {
        if ((response as any).isSuccess) {
          sessionStorage.setItem('globalassist', JSON.stringify(response.data[0]));
          sessionStorage.setItem('roleId', response.data[0].RoleId);
          this.presentToast('Profile updated');
        }
        else
          this.presentToast('Failed to update profile');
        this.dismissLoading();
      })
    }
  }

  openApproval() {
    this.navCtrl.push(ApprovalPage);
  }

  openSendReport() {
    this.navCtrl.setRoot(SendReportPage);
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
