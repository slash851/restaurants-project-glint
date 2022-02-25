import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {SnotifyService} from 'ng-snotify';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import IAuthModel from '../../models/auth.response.model';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });

    constructor(private apiService: ApiService,
                private spinner: NgxSpinnerService,
                private router: Router,
                private authService: AuthService,
                private snotifyService: SnotifyService) {
    }

    ngOnInit(): void {
    }

    /**
     * login user
     */
    onSubmit() {
        this.spinner.show();
        this.apiService.login(this.loginForm.value).subscribe((response: IAuthModel) => {
            this.spinner.hide();
            this.authService.authSubject.next(response);
            this.router.navigate(['/collections']);
        }, (error => {
            this.spinner.hide();
            const errorMessage = error.status === 403 ? 'Ups! Looks like you put incorrect login or password!' : 'Internal server error.'
            this.snotifyService.warning(errorMessage, 'Error', {
                timeout: 5000,
                buttons: [{text: 'Try again!'}]
            });
        }));
    }
}
