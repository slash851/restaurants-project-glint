import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {SnotifyService} from 'ng-snotify';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    // todo: add repassword validator
    // todo: add spans with validators descriptions
    registerForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(5)]),
        rePassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });

    registeredSuccess = false;

    constructor(private apiService: ApiService,
                private spinner: NgxSpinnerService,
                private router: Router,
                private authService: AuthService,
                private snotifyService: SnotifyService) {
    }

    ngOnInit(): void {
    }

    /**
     * submit registration form
     */
    onSubmit() {
        this.spinner.show();
        this.apiService.register(this.registerForm.value).subscribe(() => {
            this.spinner.hide();
            this.snotifyService.success('Registration Successful', 'Registered', {
                timeout: 5000,
                buttons: [{text: 'Login to start using collections!'}]
            });
            this.registeredSuccess = true;

        }, (error => {
            this.spinner.hide();
            this.snotifyService.warning(error?.error?.message, 'Error', {
                timeout: 5000,
                buttons: [{text: 'Try again!'}]
            });
        }));
    }

}
