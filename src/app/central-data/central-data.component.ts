import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {first, map} from 'rxjs/operators';
import {LibreData} from './libre-data';
import {interval, Subscription, timer} from 'rxjs';
import {AddKHFormComponent} from '../add-khform/add-khform.component';
import {MatDialog} from '@angular/material/dialog';
import {environment} from '../../environments/environment';
import {Carbs} from '../add-khform/carbs';
import {AddInsulinComponent} from '../add-insulin/add-insulin.component';
import {Insulin} from '../add-insulin/insulin';


@Component({
  selector: 'app-central-data',
  templateUrl: './central-data.component.html',
  styleUrls: ['./central-data.component.css'],
  providers: [HttpClient]
})
export class CentralDataComponent implements OnInit, OnDestroy {
  libreData: LibreData;
  timerSubscription: Subscription;
  timerSeries: Subscription;
  timerLastCarbs: Subscription;
  timerLastInsulin: Subscription;
  status: string;
  queue: number[] = [];
  lastElements: LibreData[] = [];
  last5: LibreData;
  last10: LibreData;
  timeStatus: string;

  lastFood: Carbs[] = [];
  lastInsulin: Insulin[] = [];

  constructor(private httpClient: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.timerSubscription = timer(10, 10000).pipe(
      map(() => {
        this.loadData();
      })
    ).subscribe();

    this.timerSeries = timer(10, 60000).pipe(
      map(() => {
        this.loadLastElements();
      })
    ).subscribe();
    this.timerLastCarbs = timer(10, 60000).pipe(
      map(() => {
        this.loadLastCarbs();
      })
    ).subscribe();

    this.timerLastInsulin = timer(10, 600000).pipe(
      map(() => {
        this.loadLastInsulin();
      })
    ).subscribe();

   // this.libreData = {glucose: '172', timestamp: '1611348527475', serial: '3MH003PDJ9H'};


  }

  loadLastElements(): void {
    this.httpClient.get('http://env-4074176.jcloud-ver-jpc.ik-server.com/last-values/10')
      .pipe(
        first(),
        map( result => {
          this.lastElements = result as LibreData[];
          this.last10 = this.getLastValue(6);
          this.last5 = this.getLastValue(3);
        })
      )
      .subscribe(data => {},
        error => console.log('mmo: error:', error)) ;
  }

  getLastValue(position: number): LibreData {
    if (position > this.lastElements.length) {
      return;
    }
    const data = this.lastElements[position - 1];
    data.glucoseMmol = (Math.round(parseInt(data.glucose, 10) / 18 * 100) / 100).toString();
    data.date = new Date(data.timestamp);
    const mmol = Number(data.glucoseMmol);
    data.status = this.getStatus(mmol);

    return {... data};
  }

  loadData(): void {
    this.httpClient.get(environment.getServer + 'data')
      .pipe(
        first(),
        map( result => {
          console.log(result);
          this.libreData = result as LibreData;
          if (this.libreData.timestamp) {
            this.prepareLibreData();
          }
        })
      )
      .subscribe(data => {},
        error => console.log('mmo: error:', error)) ;
  }

  prepareLibreData(): void {
    this.libreData.glucoseMmol = (Math.round(parseInt(this.libreData.glucose, 10) / 18 * 100) / 100).toString();
    this.libreData.date = new Date(this.libreData.timestamp);
    const mmol = Number(this.libreData.glucoseMmol);
    this.status = this.getStatus(mmol);
    this.libreData.direction = this.getDirection();

    this.queue.push(mmol);
    if (this.queue.length > 5) {
      this.queue.shift();
    }

    if ((new Date().getTime() - 300000) >  Number(this.libreData.timestamp)) {
      this.timeStatus = 'red';
    } else {
      this.timeStatus = '';
    }
  }

  private getStatus(mmol: number): string {
    if (this.timeStatus === 'red') {
      return 'time-status-not-valid';
    }

    if (mmol > 9.5) {
      return  'red';
    } else if (mmol > 4.0 && mmol < 5.0) {
      return  'yellow';
    } else if (mmol >= 5 && mmol <= 9.5) {
      return  'green';
    } else {
      return 'red';
    }
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
    this.timerSeries.unsubscribe();
    this.timerLastCarbs.unsubscribe();
    this.timerLastInsulin.unsubscribe();
  }

  getDirection(): string {
    const change = Number(this.libreData.glucoseMmol) - Number(this.last5.glucoseMmol);
    if (change > 1.0) {
      return '↑↑';
    }

    if (change >= 0.5) {
      return '↑';
    }

    if (change < -1) {
       return '↓↓';
    }

    if (change <= -0.5) {
      return '↓';
    }

    return '';

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddKHFormComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      const dialogResult = result;
      console.log('result', dialogResult);
    });
  }

  openDialogInsulin(): void {
    const dialogRef = this.dialog.open(AddInsulinComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      const dialogResult = result;
      console.log('result', dialogResult);
    });
  }

  loadLastCarbs(): void {
    this.httpClient.get(environment.postServer + 'carbs/last')
      .pipe(
        first()
      )
      .subscribe(
      result => this.lastFood = result as Carbs[]
    );
  }
  loadLastInsulin(): void {
    this.httpClient.get(environment.postServer + 'insulin/last')
      .pipe(
        first()
      )
      .subscribe(
        result => this.lastInsulin = result as Insulin[]
      );
  }


}
