import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Carbs} from './carbs';

@Component({
  selector: 'app-add-khform',
  templateUrl: './add-khform.component.html',
  styleUrls: ['./add-khform.component.css']
})
export class AddKHFormComponent implements OnInit {

  kh: number;
  lastFood: Carbs[] = [];

  constructor( public dialogRef: MatDialogRef<AddKHFormComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any, public httpClient: HttpClient) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }


  onSaveFood(food: string, kh: number): void {
    const carbs: Carbs = {dateTime: new Date(), description: food, quantity: kh};
    this.httpClient.post(environment.postServer + 'carbs', carbs)
      .subscribe(
        result => console.log('saved: ' + result)
      );
    this.dialogRef.close();
  }

  onSaveCustomFood(): void {
    const carbs: Carbs = {dateTime: new Date(), description: 'Meal', quantity: this.kh};
    this.httpClient.post(environment.postServer + 'carbs', carbs)
      .subscribe(
        result => console.log('saved: ' + result)
      );
    this.dialogRef.close();
  }
}
