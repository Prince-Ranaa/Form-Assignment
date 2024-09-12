import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Chart from 'chart.js/auto';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css']
})
export class TemperatureComponent {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  data: any[] = [];


  temperatureForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.temperatureForm = this.fb.group({
      datetime: ['', [Validators.required, this.dateValidator]],
      temperature: ['', [Validators.required, Validators.min(-50), Validators.max(50)]]
    });
  }

  // function to add data in the array 
  addData() {
    if (this.temperatureForm.valid) {
      this.data.push(this.temperatureForm.value);
      this.temperatureForm.reset();
      this.updateChart();
    } else {
      console.log('Form is invalid');
    }
  }


  // custom Date validator to check wheather the date is valid or not
  dateValidator(control: any) {
    const currentDate = new Date();
    const inputDate = new Date(control.value);
    return inputDate < currentDate ? null : { invalidDate: true };
  }

  chart: any;

  // this function creates chart using Chart.js that is displayed in the vide data tab 
  createChart(): void {
    if (this.chartCanvas && this.chartCanvas.nativeElement) {
      this.chartCanvas.nativeElement.width = 80;
      this.chartCanvas.nativeElement.height = 30;

      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: this.data.map(item => new Date(item.datetime).toLocaleString()),
          datasets: [
            {
              label: 'Temperature',
              data: this.data.map(item => item.temperature),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false,
              min: -50,
              max: 50,
              title: {
                display: true,
                text: 'Temperature (°C)'
              }
            },
            x: {
              offset: true,
              title: {
                display: true,
                text: 'Date & Time'
              }
            }
          }
        }
      });
    }
  }



  // updateChart Function 
  updateChart(): void {
    if (this.chart) {
      this.chart.data.labels = this.data.map(item => new Date(item.datetime).toLocaleString());
      this.chart.data.datasets[0].data = this.data.map(item => item.temperature);
      this.chart.update();
    }
  }

  // when the tabs changes the chart element is crewated/updated
  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 1) {
      if (!this.chart) {
        this.createChart();
      } else {
        this.updateChart();
      }
    }
  }

}
