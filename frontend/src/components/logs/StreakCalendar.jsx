import './StreakCalendar.css';

export default function StreakCalendar({ logs }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build a map of date -> count
  const countMap = {};
  logs.forEach(log => {
    const day = log.created_at.slice(0, 10);
    countMap[day] = (countMap[day] || 0) + 1;
  });

  // Generate last 365 days
  const days = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ key, count: countMap[key] || 0, date: d });
  }

  // Split into weeks (columns)
  const weeks = [];
  let week = [];
  // Pad start so first day aligns to correct weekday
  const firstDay = days[0].date.getDay();
  for (let i = 0; i < firstDay; i++) week.push(null);
  days.forEach(day => {
    week.push(day);
    if (week.length === 7) { weeks.push(week); week = []; }
  });
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const getLevel = (count) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 3;
    return 4;
  };

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const totalLogs = logs.length;
  const activeDays = Object.keys(countMap).length;

  return (
    <div className="streak-wrapper">
      <div className="streak-header">
        <span className="streak-title">Activity</span>
        <span className="streak-summary">{totalLogs} logs across {activeDays} days</span>
      </div>

      <div className="calendar-scroll">
        <div className="calendar-grid">
          {weeks.map((week, wi) => (
            <div key={wi} className="calendar-week">
              {week.map((day, di) => (
                day ? (
                  <div
                    key={di}
                    className={`cal-day level-${getLevel(day.count)}`}
                    title={`${day.key}: ${day.count} log${day.count !== 1 ? 's' : ''}`}
                  />
                ) : (
                  <div key={di} className="cal-day level-empty" />
                )
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="streak-legend">
        <span className="legend-label">Less</span>
        <div className="cal-day level-0" />
        <div className="cal-day level-1" />
        <div className="cal-day level-2" />
        <div className="cal-day level-3" />
        <div className="cal-day level-4" />
        <span className="legend-label">More</span>
      </div>
    </div>
  );
}
