import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {first, map} from 'rxjs/operators';
import {LibreData} from './libre-data';
import {Subscription, timer} from 'rxjs';
import {AddKHFormComponent} from '../add-khform/add-khform.component';
import {MatDialog} from '@angular/material/dialog';
import {environment} from '../../environments/environment';
import {Carbs} from '../add-khform/carbs';
import {AddInsulinComponent} from '../add-insulin/add-insulin.component';
import {Insulin} from '../add-insulin/insulin';
import {InsulinResult} from './insulinResult';


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
  totalInsulin: number;
  activeInsulin: Insulin[] = [];
  last5: LibreData;
  last10: LibreData;
  timeStatus: string;
  direction: string;

  lastFood: Carbs[] = [];
  lastInsulin: Insulin[] = [];

  dataForChart: number[] = [];
  xAxisData = [];
  options: any;

  constructor(private httpClient: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    const xAxisData = [];

    /**
    for (let i = 0; i < 100; i++) {
      xAxisData.push( + i);
      data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
    }
**/
    this.timerSubscription = timer(10, 10000).pipe(
      map(() => {
        this.loadData();
      })
    ).subscribe();

    this.timerSeries = timer(10, 60000).pipe(
      map(() => {
       this.loadLastElements();
       this.loadActiveInsulin();
      })
    ).subscribe();
    /*
    this.timerLastCarbs = timer(10, 60000).pipe(
      map(() => {
        this.loadLastCarbs();
      })
    ).subscribe();
     */

    this.timerLastInsulin = timer(10, 600000).pipe(
      map(() => {
        this.loadLastInsulin();
      })
    ).subscribe();

   // this.libreData = {glucose: '172', timestamp: '1611348527475', serial: '3MH003PDJ9H'};
  }

  updateChart(): void {
    this.options = {
      tooltip: {},
      grid: {
        containLabel: true,
        left: 10
      },
      xAxis: {
        data: this.xAxisData,
        silent: true,
        splitLine: {
          show: false,
        },
        show: false,
      },
      yAxis: {
        min: Math.min(... this.dataForChart),
        max: Math.max(... this.dataForChart),
        axisLabel: {
          fontSize: 20
        },
        axisLine: {
          show: false,
          lineStyle: {
          }
        },
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: '',
          type: 'line',
          smooth: true,
          data: this.dataForChart,
          animationDelay: (idx) => idx * 10,
          lineStyle: {
            width: 5
          }
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };
  }

  loadActiveInsulin(): void {
    this.httpClient.get('https://env-4074176.jcloud-ver-jpc.ik-server.com/insulin/active')
      .pipe(
        first(),
        map( result => {
          let queryResult = result as InsulinResult;
          this.totalInsulin = queryResult.totalInsulin;
          this.activeInsulin = queryResult.insulin;
        })
      )
      .subscribe(data => {},
        error => console.log('mmo: error:', error)) ;
  }

  loadLastElements(): void {
    this.httpClient.get('https://env-4074176.jcloud-ver-jpc.ik-server.com/last-values/15')
      .pipe(
        first(),
        map( result => {
          this.lastElements = result as LibreData[];
          this.last10 = this.getLastValue(6);
          this.last5 = this.getLastValue(3);
          const lastElementsForCharts = this.lastElements.reverse();
          this.dataForChart =
            lastElementsForCharts.map( element => (Math.round(parseInt(element.glucose, 10) / 18 * 100) / 100));
          this.xAxisData = [];
          lastElementsForCharts.forEach(element => {
            const date = new Date(Number.parseInt(element.timestamp, 10));
            this.xAxisData.push(date.getHours() + ':' + date.getMinutes());
          });

          this.updateChart();

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
    this.httpClient.get(environment.getServer + 'data-direction')
      .pipe(
        first(),
        map( result => {
          this.libreData = (result as any).libreData as LibreData;
          this.direction = (result as any).direction;
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
    if (this.queue.length > 10) {
      this.queue.shift();
    }

    // after 5 minutes without signal show an alert
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

    if (mmol >= 9.3) {
      return  'red';
    } else if (mmol >= 8.4) {
      return  'yellow';
    } else if (mmol >= 4.6) {
      return  'green';
    } else if (mmol >= 4.2) {
        return  'yellow';
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

  getArrow(): string {
    switch (this.direction) {
      case '3UP': return  '↑↑';
      case '2UP': return '↑';
      case 'UP': return '↑';
      case 'DOWN': return '↓';
      case 'UNDEFINED': return '';
      case '2DOWN': return '↓';
      case '3DOWN': return '↓↓';
      case 'FLAT': return '';
    }
  }

  getDirection(): string {
    const change = Number(this.libreData.glucoseMmol) - Number(this.last5.glucoseMmol);
    if (change > 30) {
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
      result => {
        this.lastFood = result as Carbs[];
      }
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
