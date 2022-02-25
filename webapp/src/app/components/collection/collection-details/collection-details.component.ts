import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {SnotifyService} from 'ng-snotify';


@Component({
    selector: 'app-collection-details',
    templateUrl: './collection-details.component.html',
    styleUrls: ['./collection-details.component.scss']
})
export class CollectionDetailsComponent implements OnInit {
    displayedColumns: string[] = ['name', 'remove'];
    dataSource = [];

    private _collection!: any;

    @Input() set collection(value: any) {
        this._collection = value;
        this.getDetails(this._collection.id);

    }

    get collection(): any {
        return this._collection;
    }

    constructor(public apiService: ApiService,
                public spinner: NgxSpinnerService,
                private cd: ChangeDetectorRef,
                public snotifyService: SnotifyService) {
    }

    ngOnInit(): void {
    }

    getDetails(id: number) {
        this.spinner.show();
        this.apiService.getItemsFromCollection(id).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.dataSource = response;
                this.cd.markForCheck();
            }, (err) => {
                console.log(err);
                this.spinner.hide();
                this.snotifyService.warning('Ups! Looks like there is an issue with server', 'Error', {
                    timeout: 5000,
                    buttons: [{text: 'Try again!'}]
                });
            }
        )
    }

    removeFromCollection(restaurantId: number, collectionId: number) {
        this.apiService.removeItemFromCollection(restaurantId, collectionId).subscribe(
            (response: any) => {
                this.spinner.hide();
                this.snotifyService.success('Restaurant was removed from the collection', 'Tiding finished!', {
                    timeout: 5000,
                });
                this.getDetails(this._collection.id)
            }, (err) => {
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
