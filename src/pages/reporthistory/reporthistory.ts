import { Component, Pipe, PipeTransform } from '@angular/core';
import { NavController, LoadingController, ToastController, MenuController, AlertController } from 'ionic-angular';
import { ApiService } from '../../providers/app.services';
import { HomePage } from '../home/home';
import { SendReportPage } from '../sendreport/sendreport';
import { SigninPage } from '../signin/signin';

@Pipe({ name: 'texttransform' })
@Component({
	selector: 'page-reporthistory',
	templateUrl: 'reporthistory.html'
})
export class ReportHistoryPage implements PipeTransform {
	public alert: any;
	ReportList: Array<any> = [];
	public loading: any;
	user: any = JSON.parse(localStorage.getItem('globalassist'));
	constructor(public menuCtrl: MenuController, public alertController: AlertController, public navCtrl: NavController, private loaderCtrl: LoadingController, private toastCtrl: ToastController, private apiService: ApiService) {
		this.showLoading();
		this.apiService.getAll('/report/getreports', { OperationId: 3, PostedBy: this.user.Id }).subscribe(response => {
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
		if (action == 'info') {
			localStorage.setItem('reportId', report.Id);
			localStorage.setItem("readonly", 'true');
		}
		else if (action == 'edit') {
			localStorage.setItem('reportId', report.Id);
			localStorage.setItem("readonly", 'false');
		}
		this.navCtrl.setRoot(SendReportPage)
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
							this.navCtrl.setRoot(ReportHistoryPage, { animated: true, animationDirection: 'forward' });
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
	openSendReport() {
		this.navCtrl.setRoot(SendReportPage)
	}
}
