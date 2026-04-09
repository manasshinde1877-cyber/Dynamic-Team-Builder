import { useEffect, useRef, useMemo } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const COLORS = [
  'rgba(216,145,255,0.85)', 'rgba(255,104,168,0.85)', 'rgba(169,151,255,0.85)',
  'rgba(208,125,255,0.85)', 'rgba(255,172,200,0.85)', 'rgba(180,164,255,0.85)',
  'rgba(207,121,255,0.85)', 'rgba(255,136,184,0.85)', 'rgba(156,135,254,0.85)',
  'rgba(226,181,255,0.85)',
];

export default function SkillPieChart({ participants }) {
  const canvasRef = useRef();
  const chartRef = useRef();

  const skillCounts = useMemo(() => {
    const counts = {};
    participants.forEach((p) =>
      p.skills.forEach((s) => { counts[s.name] = (counts[s.name] || 0) + 1; })
    );
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [participants]);

  useEffect(() => {
    if (!canvasRef.current || skillCounts.length === 0) return;
    if (chartRef.current) chartRef.current.destroy();

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: skillCounts.map(([k]) => k),
        datasets: [{
          data: skillCounts.map(([, v]) => v),
          backgroundColor: skillCounts.map((_, i) => COLORS[i % COLORS.length]),
          borderWidth: 0,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '65%',
        animation: { animateRotate: true, duration: 1200, easing: 'easeInOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(25,25,34,0.95)',
            titleColor: '#efecf8',
            bodyColor: '#acaab5',
            borderColor: 'rgba(72,71,80,0.4)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 12,
            callbacks: {
              label: (ctx) =>
                ` ${ctx.parsed} participant${ctx.parsed > 1 ? 's' : ''}  (${Math.round((ctx.parsed / participants.length) * 100)}%)`,
            },
          },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [skillCounts, participants.length]);

  return (
    <div>
      <div className="pie-wrap">
        <canvas ref={canvasRef} style={{ maxHeight: '220px' }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none',
        }}>
          <div className="font-headline" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--on-surface)' }}>
            {skillCounts.length}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Skills
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
        {skillCounts.map(([skill, count], i) => (
          <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {skill}
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--on-surface)', fontFamily: 'Space Grotesk' }}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
