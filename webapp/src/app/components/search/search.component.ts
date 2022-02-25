import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {SnotifyService} from 'ng-snotify';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {ICollection} from '../../models/collection.model';
import {AuthService} from '../../services/auth.service';


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

    displayedColumns: string[] = ['name', 'remove'];
    searchDataSource = []
    collectionsDataSource: ICollection[] = []

    searchForm = new FormGroup({
        name: new FormControl(''),
        day: new FormControl(''),
        openAt: new FormControl(''),
    });
    dayList: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    isAuthenticated = false;

    constructor(public apiService: ApiService,
                public spinner: NgxSpinnerService,
                public dialog: MatDialog,
                public authService: AuthService,
                public snotifyService: SnotifyService) {
    }

    ngOnInit(): void {
        this.getCollections();
    }

    /**
     * serarch for the restaurant
     */
    onSubmit() {
        let searchValues = this.searchForm.value;
        this.spinner.show();
        this.apiService.getListOfRestaurants(searchValues).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.searchDataSource = response;
            }, () => {
                this.spinner.hide();
                this.snotifyService.warning('Ups! Looks like there is an issue with server', 'Error', {
                    timeout: 5000,
                    buttons: [{text: 'Try again!'}]
                });
            }
        )
    }

    /**
     * get list of user collections
     */
    getCollections() {
        this.isAuthenticated = this.authService.isAuthenticated();
        if (this.isAuthenticated) {
            this.apiService.getListUserCollections().subscribe(
                (response: any) => {
                    this.spinner.hide();
                    this.collectionsDataSource = response;
                });
        }
    }


    /**
     * add restaurant to collection
     * @param restaurantId
     * @param collectionId
     */
    addToCollection(restaurantId: number, collectionId: number) {
        this.spinner.show();
        this.apiService.addItemToCollection(restaurantId, collectionId).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.snotifyService.success(`Restaurant added to your collection!`, 'You got it!', {
                    timeout: 5000,
                    buttons: [{text: 'Try again!'}]
                });
            }, (err: Error) => {
                console.log(err);
                this.spinner.hide();
                this.snotifyService.warning('Ups! Looks like there is an issue with server', 'Error', {
                    timeout: 5000,
                    buttons: [{text: 'Try again!'}]
                });
            }
        )
    }
}
