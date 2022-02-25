import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {SnotifyService} from 'ng-snotify';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
    collections: any;
    displayedColumns: string[] = ['name', 'details', 'remove'];
    dataSource = [];

    collectionForm = new FormGroup({
        collectionName: new FormControl('', [Validators.required]),
    });
    selectedCollection: number = 0;

    constructor(public apiService: ApiService,
                public spinner: NgxSpinnerService,
                private cd: ChangeDetectorRef,
                public snotifyService: SnotifyService) {
    }

    ngOnInit(): void {
        this.getCollections();
    }

    /**
     * get all users collections
     */
    getCollections() {
        this.spinner.show();
        this.apiService.getListUserCollections().subscribe(
            (response: any) => {
                this.spinner.hide();
                this.collections = response;
                this.dataSource = response;
                this.cd.markForCheck();
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
     * add new collection to user list
     */
    onSubmit() {
        if (this.collectionForm.get('collectionName')) {
            this.apiService.addCollection(this.collectionForm.get('collectionName')!.value).subscribe(() => {
                    this.collectionForm.reset();
                    this.snotifyService.success('Collection added successfully', 'Added', {
                        timeout: 5000,
                        buttons: [{text: 'Well done!'}]
                    });
                    this.getCollections();
                }, ((error: any) => {
                    console.log(error)
                })
            )
        }

    }

    /**
     * removing item from collection
     * @param id
     */
    removeFromCollection(id: any) {
        this.spinner.show();
        this.apiService.removeCollection(id).subscribe(() => {
            this.snotifyService.success('Collection removed successfully', 'Removed', {
                timeout: 5000,
                buttons: [{text: 'Well done!'}]
            });
            this.getCollections();
            this.spinner.hide();
            this.cd.markForCheck();
        }, ((error: any) => {
            console.log(error)
            this.spinner.hide();
            this.cd.markForCheck();
        }))

    }

    /**
     * set current collection
     * @param id
     */
    setCollection(id: any) {
        this.selectedCollection = id
    }
}
