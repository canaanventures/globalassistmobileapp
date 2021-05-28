import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NavController, LoadingController, ToastController, MenuController, Events } from 'ionic-angular';
import { ApiService } from '../../providers/app.services';
import { HomePage } from '../home/home';

@Component({
	selector: 'page-signin',
	templateUrl: 'signin.html'
})
export class SigninPage {
	sign: string = "signin";
	signInForm: FormGroup;
	public loading: any;
	isSignInSubmitted: boolean = false;

	constructor(public menuCtrl: MenuController, public events: Events, public navCtrl: NavController, private loaderCtrl: LoadingController, public formBuilder: FormBuilder, private toastCtrl: ToastController, private apiService: ApiService) {
		this.signInForm = this.formBuilder.group({
			UserEmail: ['', [Validators.required]],
			Password: ['', [Validators.required]]
		});
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

	submitSignInForm() {
		this.isSignInSubmitted = true;
		if (this.signInForm.valid) {
			this.showLoading();
			this.apiService.getAll('/auth/login', this.signInForm.value).subscribe((response) => {
				if (response.isSuccess) {
					if (response.data[0].RoleId == 4 || response.data[0].RoleId == 5) {
						this.events.publish('user:signin', JSON.stringify(response.data[0]));
						localStorage.setItem('globalassist', JSON.stringify(response.data[0]));
						sessionStorage.setItem('roleId', response.data[0].RoleId);
						this.presentToast(response.message);
						this.navCtrl.setRoot(HomePage);
					}
					else
						this.presentToast('Please try to login in web');
					this.dismissLoading();
				}
				else {
					this.dismissLoading();
					this.presentToast(response.message);
				}
			}, (err) => {
				this.dismissLoading();
			})
		}
		else {
			this.dismissLoading();
		}
	}
}
