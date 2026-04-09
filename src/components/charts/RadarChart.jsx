import { useEffect, useRef } from 'react';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarChart({ aspects, teamName }) {
  const canvasRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (!canvasRef.current || !aspects) return;
    if (chartRef.current) chartRef.current.destroy();

    const labels = Object.keys(aspects);
    const data = Object.values(aspects);

    chartRef.current = new Chart(canvasRef.current, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: teamName,
          data,
          backgroundColor: 'rgba(169,151,255,0.15)',
          borderColor: 'rgba(169,151,255,0.8)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(216,145,255,1)',
          pointBorderColor: 'rgba(37,37,48,1)',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: { duration: 1000, easing: 'easeInOutQuart' },
        scales: {
          r: {
            min: 0,
            max: 100,
            grid: { color: 'rgba(72,71,80,0.3)' },
            angleLines: { color: 'rgba(72,71,80,0.3)' },
            pointLabels: { color: '#acaab5', font: { family: 'Manrope', size: 11 } },
            ticks: { display: false, stepSize: 25 },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(25,25,34,0.95)',
            titleColor: '#efecf8',
            bodyColor: '#acaab5',
            borderColor: 'rgba(72,71,80,0.4)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 10,
          },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [aspects, teamName]);

  return <canvas ref={canvasRef} style={{ maxHeight: '220px' }} />;
}
