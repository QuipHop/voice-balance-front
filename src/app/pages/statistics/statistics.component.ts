import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { ChartData, ChartType, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [MatCard, BaseChartDirective],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnChanges {
  @Input() transactions: any[] = []; // Input for transactions

  incomeData!: ChartData<'bar'>;
  outcomeData!: ChartData<'bar'>;

  incomeChartLabels: string[] = [];
  outcomeChartLabels: string[] = [];

  incomeChartType: ChartType = 'bar';
  outcomeChartType: ChartType = 'bar';

  ngOnInit()
  {
    Chart.register(...registerables);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['transactions']) && this.transactions) {
      this.initStatistics();
    }
  }

  private initStatistics(): void {
    const income = this.aggregateData(this.transactions, 'доходи');
    const outcome = this.aggregateData(this.transactions, 'витрати');

    this.incomeChartLabels = income.labels;
    this.outcomeChartLabels = outcome.labels;

    this.incomeData = {
      labels: income.labels,
      datasets: [
        {
          label: 'Доходи',
          data: income.values,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    this.outcomeData = {
      labels: outcome.labels,
      datasets: [
        {
          label: 'Витрати',
          data: outcome.values,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  }

  private aggregateData(
    transactions: any[],
    type: string
  ): { labels: string[]; values: number[] } {
    const labels: string[] = [];
    const values: number[] = [];

    // Group transactions by category name
    const grouped = transactions
      .filter((tx) => tx.Category.Type.toLowerCase() === type.toLowerCase())
      .reduce((acc: any, tx: any) => {
        const categoryType = tx.Category.Type.toLowerCase() ;
        acc[categoryType] = (acc[categoryType] || 0) + tx.Amount;
        return acc;
      }, {});

    for (const category in grouped) {
      labels.push(category);
      values.push(grouped[category]);
    }

    return { labels, values };
  }
}
