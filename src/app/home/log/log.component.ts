import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { timeout } from 'rxjs';
import { CAR } from 'src/app/model/CAR';
import { RENT_LOG } from 'src/app/model/RENT_LOG';
import { CarService } from 'src/app/service/car.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  monthName: string[] = [
    "January","Febrary","March","April","May","June","July","Auguest","September","October","November","December"
  ];
  currentDate = new Date();
  currentYear: number;
  currentMonth: number;
  currentDay: number;

  totalDay: number = 0;
  totalWeek: number = 0;
  totalWeekday: (null | number)[][] = [];

  rentLogs: RENT_LOG[] = [];
  cars: CAR[] = [];
  formGroup!: FormGroup;

  constructor(private service: CarService, private formBuilder: FormBuilder) {
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonth = this.currentDate.getMonth() + 1;
    this.currentDay = this.currentDate.getDate();
  }

  ngOnInit(): void {
    this.initialFormGroup();
    this.getCar();
    this.cleanDateArray();
    this.refreshDate();
  }

  initialFormGroup() {
    this.formGroup = this.formBuilder.group({
      CAR: [{ value: '', disabled: false }, [Validators.required]]
    });
  }

  getCar(){
    this.service.getCar().pipe(timeout(4000)).subscribe({
      next: (res) =>{
        this.cars = res;
        console.log(res);
      },
      error: (e)=>{
        console.log(e);
        window.alert(`Oops! something went wrong, contact your IT specialist`);
      }
    })
  }

  onSubmit() {
    const CAR = this.formGroup.get('CAR')?.value;

    this.service.getRentLog(CAR.CAR_ID).pipe(timeout(4000)).subscribe({
      next: (res) =>{
        this.rentLogs = res;
      },
      error: (e)=>{
        console.log(e);
        window.alert(`Oops! something went wrong, contact your IT specialist`);
      }
    })
  }

  //獲取某年某月某日是星期幾
  dayStart(year: number, month: number): number {
    let tmpDate = new Date(year, month-1, 1);
    return (tmpDate.getDay());
  }

  //計算閏年, 獲取某月總天數
  daysMonth(year: number, month: number): number {
    const monthOlympic = [31,29,31,30,31,30,31,31,30,31,30,31];
    const monthNormal = [31,28,31,30,31,30,31,31,30,31,30,31];

    let tmp = year % 4;
    if (tmp == 0) {
      return (monthOlympic[month-1]);
    } else {
      return (monthNormal[month-1]);
    }
  }

  cleanDateArray(){
    // 獲取該月總天數
    this.totalDay = this.daysMonth(this.currentYear, this.currentMonth);
    console.log('current Year: ', this.currentYear);
    console.log('current Month: ', this.currentMonth);
    console.log('Total Day ', this.totalDay);

    //獲取該月總周數
    this.totalWeek = Math.ceil(this.totalDay/7) + 1;

    //創建最大周數日期陣列
    this.totalWeekday = [];

    for (let i=0; i<this.totalWeek; i++) {
      this.totalWeekday[i] = [];
      for (let j = 0; j < 7; j++) {
        this.totalWeekday[i][j] = null;
      }
    }
  }

  // 生成日期列表的數組
  refreshDate(){
    // 獲取該月第一天是星期幾
    const firstDay = this.dayStart(this.currentYear, this.currentMonth);

    let countDays = 0;
    for(let week=1; week<=this.totalWeek; week++){
      for(let date=1; date<=7; date++){
        if(date>=firstDay && week==1){ //從該月第一天是星期幾開始計數
          countDays += 1;
          this.totalWeekday[week-1][date-1] = countDays;
        }else if (week>1){
          countDays += 1;
          if(countDays <= this.totalDay){
            this.totalWeekday[week-1][date-1] = countDays;
          }else {
            break; // 超過該月總天數，停止填入日期
          }
        }
      }
    }

    // 若最後一週都是null就移除
    const lastRow = this.totalWeekday[this.totalWeekday.length - 1];
    if (lastRow.every((element) => element === null)) {
      this.totalWeekday.pop();
    }
  }

  previousMonth() {
    this.currentMonth -= 1;
    if (this.currentMonth < 1) {
      this.currentMonth = 12;
      this.currentYear -= 1;
    }
    this.cleanDateArray();
    this.refreshDate();
  }

  nextMonth() {
    this.currentMonth += 1;
    if (this.currentMonth > 12) {
      this.currentMonth = 1;
      this.currentYear += 1;
    }
    this.cleanDateArray();
    this.refreshDate();
  }

  isWithinDateRange(date: number | null): boolean {

    if(date === null){
      return false
    }

    const currentDate = new Date(this.currentYear, this.currentMonth - 1, date);
    currentDate.setHours(0, 0, 0, 0);

    for (const log of this.rentLogs) {
      const startDate = new Date(log.START_DATE);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(log.END_DATE);
      endDate.setHours(0, 0, 0, 0);

      if (currentDate >= startDate && currentDate <= endDate) {
        return true;
      }
    }
    return false;
  }

  isCurrentDate(date: number | null){
    if(this.currentMonth == this.currentDate.getMonth() + 1 && date == this.currentDay){
      return true;
    }
    return false;
  }
}
