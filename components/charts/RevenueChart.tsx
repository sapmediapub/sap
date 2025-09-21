import React, { useEffect, useRef } from 'react';

// Make Chart.js available from the window object
declare const Chart: any;

interface RevenueChartProps {
  data: {
    labels: string[]; // e.g., ['Jan 2024', 'Feb 2024']
    values: number[]; // e.g., [100, 200]
  };
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<any>(null); // To hold the chart instance

  useEffect(() => {
    if (chartRef.current && data && typeof Chart !== 'undefined') {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: [{
              label: 'Monthly Revenue',
              data: data.values,
              fill: true,
              backgroundColor: 'rgba(79, 70, 229, 0.2)', // Indigo with opacity
              borderColor: 'rgba(99, 102, 241, 1)', // Indigo
              pointBackgroundColor: 'rgba(99, 102, 241, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#9CA3AF', // text-gray-400
                  callback: function(value: number) {
                    return '$' + value;
                  }
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'transparent'
                }
              },
              x: {
                ticks: {
                  color: '#9CA3AF' // text-gray-400
                },
                grid: {
                  display: false
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: '#1F2937', // bg-gray-800
                titleColor: '#F9FAFB', // text-gray-50
                bodyColor: '#D1D5DB', // text-gray-300
                callbacks: {
                  label: function(context: any) {
                    return `Revenue: $${context.parsed.y.toFixed(2)}`;
                  }
                }
              }
            }
          }
        });
      }
    }

    // Cleanup function to destroy the chart on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]); // Rerender chart when data changes

  return (
    <div className="relative h-72">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default RevenueChart;
