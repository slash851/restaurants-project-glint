import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {SnotifyService} from 'ng-snotify';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
    isAuthenticated = false;

    constructor(
        private authService: AuthService,
        private cd: ChangeDetectorRef,
        private snotifyService: SnotifyService
    ) {
    }

    ngOnInit(): void {
        this.authService.authSubject.subscribe((resp: any) => {
            this.isAuthenticated = resp && resp.token;
        })


    }

    ngAfterViewInit(): void {
        // adjust navbar acording to the state of authentication of the user
        setTimeout(() => this.isAuthenticated = this.authService.isAuthenticated(), 0);
    }

    /**
     * call logout function
     */
    onLogout() {
        this.authService.logout();
        this.snotifyService.warning('You have been looged out', 'logout', {
            timeout: 5000,
        });
    }
}
