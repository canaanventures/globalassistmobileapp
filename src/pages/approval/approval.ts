import { Component, Pipe, PipeTransform } from '@angular/core';
import { NavController, LoadingController, ToastController, MenuController, AlertController } from 'ionic-angular';
import { ApiService } from '../../providers/app.services';
import { HomePage } from '../home/home';
import { SigninPage } from '../signin/signin';

@Pipe({ name: 'texttransform' })
@Component({
	selector: 'page-approval',
	templateUrl: 'approval.html'
})
export class ApprovalPage implements PipeTransform {
	public alert: any;
	ReportList: Array<any> = [];
	public loading: any;
	user: any = JSON.parse(localStorage.getItem('globalassist'));
	constructor(public menuCtrl: MenuController, public alertController: AlertController, public navCtrl: NavController, private loaderCtrl: LoadingController, private toastCtrl: ToastController, private apiService: ApiService) {
		this.showLoading();
		this.apiService.getAll('/report/getreports', { OperationId: this.user.RoleId == 3 ? 5 : this.user.RoleId == 2 ? 8 : 6, SupervisorId: this.user.Id, CoordinatorId: this.user.Id }).subscribe(response => {
			if (!(response as any).isSuccess)
				this.presentToast((response as any).message);
			else
				this.ReportList = response.data;
			this.dismissLoading();
		})
	}

	transform(value: string): string {
		const splittedText = value.split(' ');
		return `<span>${splittedText[0]}</span>
		<small>${splittedText[1]}</small>`;
	}

	presentToast(mess) {
		let toast = this.toastCtrl.create({
			message: mess,
			duration: 1000,
			position: 'bottom',
		});
		toast.present()
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

	Action(report, action) {
		this.showLoading();
		this.apiService.create('/report/approvereport', { RoleId: this.user.RoleId, ReportId: report.Id, isApproved: action == 'approve' ? true : false, Remarks: '', userId: this.user.Id }).subscribe(response => {
			if ((response as any).isSuccess) {
				this.presentToast((response as any).message);
				this.ReportList = response.data;
			}
			else
				this.presentToast((response as any).message);
			this.dismissLoading();
		})
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
							this.navCtrl.setRoot(ApprovalPage, { animated: true, animationDirection: 'forward' });
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
}
