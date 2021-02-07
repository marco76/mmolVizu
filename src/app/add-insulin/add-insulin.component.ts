import {Component, Inject, OnInit} from '@angular/core';
import {Carbs} from '../add-khform/carbs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Insulin} from './insulin';

@Component({
  selector: 'app-add-insulin',
  templateUrl: './add-insulin.component.html',
  styleUrls: ['./add-insulin.component.css']
})
export class AddInsulinComponent implements OnInit {

  units: number;
  lastInsulin: Insulin[] = [];

  constructor( public dialogRef: MatDialogRef<AddInsulinComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any, public httpClient: HttpClient) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }


  onSaveDose(): void {
    const insulin: Insulin = {dateTime: new Date(), description: '', quantity: this.units};
    this.httpClient.post(environment.postServer + 'insulin', insulin)
      .subscribe(
        result => console.log('saved: ' + result)
      );
    this.dialogRef.close();
  }

}
