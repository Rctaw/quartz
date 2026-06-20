import { QuartzComponent, QuartzComponentConstructor } from "./types"

const ScheduleWidget: QuartzComponent = ({ fileData }) => {
  if (!fileData.frontmatter?.isSchedule) {
    return null
  }

  const events = (fileData.frontmatter.events || []) as Array<{
    date: string
    time?: string // 问号代表该字段是可选的，防止有的行程没写地点而报错
    title: string
    type: string
    venue?: string
  }>

  const initYear = parseInt(fileData.frontmatter.scheduleYear) || new Date().getFullYear()
  const initMonth = parseInt(fileData.frontmatter.scheduleMonth) || (new Date().getMonth() + 1)

  // 1. 生成年份网格项
  const yearOptions = []
  for (let y = initYear - 10; y <= initYear + 1; y++) {
    yearOptions.push(
      <label className="grid-item">
        <input type="radio" name="schedule-year" value={y} defaultChecked={y === initYear} />
        <span>{y}</span>
      </label>
    )
  }

  // 2. 生成月份网格项
  const monthOptions = []
  for (let m = 1; m <= 12; m++) {
    monthOptions.push(
      <label className="grid-item">
        <input type="radio" name="schedule-month" value={m} defaultChecked={m === initMonth} />
        <span>{String(m).padStart(2, '0')}</span>
      </label>
    )
  }

  // 服务端预先计算并渲染初始月份
  const firstDay = new Date(initYear, initMonth - 1, 1).getDay()
  const daysInMonth = new Date(initYear, initMonth, 0).getDate()
  const staticCells = []

  for (let i = 0; i < firstDay; i++) {
    staticCells.push(<div className="day-cell pad-day"></div>)
  }

for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${initYear}-${String(initMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dayEvents = events.filter(e => e.date === dateStr)
    const hasEvent = dayEvents.length > 0
    
    // 动态提取这一天的所有行程类型
    let typeClasses = ""
    if (hasEvent) {
      const types = Array.from(new Set(dayEvents.map(e => e.type?.toLowerCase()).filter(Boolean)))
      typeClasses = types.map(t => ` has-type-${t}`).join('')
    }

    staticCells.push(
      <div className={`day-cell${hasEvent ? ' has-event' : ''}${typeClasses}`} data-date={dateStr}>
        <span className="day-text">{d}</span>
      </div>
    )
  }

  return (
    <div 
      className="custom-schedule-dashboard" 
      data-events={JSON.stringify(events)}
      data-init-year={initYear}
      data-init-month={initMonth}
    >
      <div className="calendar-wrapper">
        {/* 控制头部结构清洗与统一 */}
        <div className="calendar-nav-header">
          <details className="grid-popover-details">
            <summary className="popover-trigger capsule-btn">
              <span id="current-date-display">{initYear} . {String(initMonth).padStart(2, '0')}</span>
            </summary>
            <div className="popover-content">
              <div className="popover-section">
                <div className="section-title">YEAR</div>
                <div className="grid-layout years-grid">{yearOptions}</div>
              </div>
              <div className="popover-section">
                <div className="section-title">MONTH</div>
                <div className="grid-layout months-grid">{monthOptions}</div>
              </div>
            </div>
          </details>
          <button className="reset-today-btn capsule-btn">TODAY</button>
        </div>
        
        <div className="grid-table">
          <div className="week-header">
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>
          <div className="days-body">
            {staticCells}
          </div>
        </div>
      </div>

      <div className="list-wrapper">
        <h3 className="list-indicator">UPCOMING</h3>
        <div className="cards-stack">
          {events
            .slice()
            .sort((a, b) => {
              // 1. 先比较日期 (如: 2024-03-15)
              if (a.date !== b.date) {
                return a.date.localeCompare(b.date);
              }
              // 2. 如果同一天，再比较具体时间 (如: 14:20)
              const timeA = a.time || "";
              const timeB = b.time || "";
              return timeA.localeCompare(timeB);
            })
            .map((evt) => (
            <div className="widget-card" data-date={evt.date}>
              {/* 只要定义了 type，就生成标签，直接把 type 变成大写显示 */}
              {evt.type && (
                <span className={`badge-tag tag-${evt.type.toLowerCase()}`}>
                  {evt.type.toUpperCase() /* 其他类型（如 festival）直接自动转大写显示（FESTIVAL）*/} 
                </span>
              )}
              <div className="card-inner">
                <strong className="card-title">{evt.title}</strong>
                <span className="card-meta">{evt.date.replace(/-/g, '.')} {evt.time ? `· ${evt.time}` : ''}
               </span>
               {evt.venue && (
                    <span className="card-venue">📍 {evt.venue}</span>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

ScheduleWidget.afterDOMLoaded = `
  (function() {
    function setupScheduleDashboard() {
      const dashboard = document.querySelector('.custom-schedule-dashboard');
      if (!dashboard) return;

      const events = JSON.parse(dashboard.getAttribute('data-events') || '[]');
      const daysBody = dashboard.querySelector('.days-body');
      const resetBtn = dashboard.querySelector('.reset-today-btn');
      const allCards = dashboard.querySelectorAll('.widget-card');
      const displayLabel = dashboard.querySelector('#current-date-display');
      const popoverDetails = dashboard.querySelector('.grid-popover-details');

      let currentYear = parseInt(dashboard.getAttribute('data-init-year')) || new Date().getFullYear();
      let currentMonth = parseInt(dashboard.getAttribute('data-init-month')) || (new Date().getMonth() + 1);
      let currentActiveDate = null;

      function onDatePanelChange() {
        const checkedYear = dashboard.querySelector('input[name="schedule-year"]:checked');
        const checkedMonth = dashboard.querySelector('input[name="schedule-month"]:checked');
        
        if (checkedYear && checkedMonth) {
          currentYear = parseInt(checkedYear.value);
          currentMonth = parseInt(checkedMonth.value);
          currentActiveDate = null;
          
          if (displayLabel) {
            displayLabel.textContent = currentYear + ' . ' + String(currentMonth).padStart(2, '0');
          }
          
          refreshGrid(currentYear, currentMonth);
          filterCardsByMonth(currentYear, currentMonth);
        }
      }

      dashboard.querySelectorAll('input[name="schedule-year"], input[name="schedule-month"]').forEach(radio => {
        radio.addEventListener('change', onDatePanelChange);
      });

      dashboard.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('click', () => {
          setTimeout(() => { 
            if (popoverDetails) popoverDetails.removeAttribute('open'); 
          }, 150);
        });
      });

      function refreshGrid(y, m) {
        const fragment = document.createDocumentFragment();
        const firstDay = new Date(y, m - 1, 1).getDay();
        const daysInMonth = new Date(y, m, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
          const pad = document.createElement('div');
          pad.className = 'day-cell pad-day';
          fragment.appendChild(pad);
        }

          for (let d = 1; d <= daysInMonth; d++) {
          const dateStr = y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
          const dayEvents = events.filter(e => e.date === dateStr);
          const isEvent = dayEvents.length > 0;
          
          let typeClasses = '';
          if (isEvent) {
            const types = [];
            dayEvents.forEach(e => {
              if (e.type) {
                const t = e.type.toLowerCase();
                if (!types.includes(t)) types.push(t);
              }
            });
            typeClasses = types.map(t => ' has-type-' + t).join('');
          }
          
          const cell = document.createElement('div');
          // 拼接上算出来的 typeClasses
          cell.className = 'day-cell' + (isEvent ? ' has-event' : '') + typeClasses;
          cell.setAttribute('data-date', dateStr);
          cell.innerHTML = '<span class="day-text">' + d + '</span>';
          

          if (currentActiveDate === dateStr) {
            cell.classList.add('selected-highlight');
          }

          if (isEvent) {
            cell.addEventListener('click', function() {
              if (currentActiveDate === dateStr) {
                currentActiveDate = null;
                cell.classList.remove('selected-highlight');
                filterCardsByMonth(y, m);
              } else {
                dashboard.querySelectorAll('.day-cell.has-event').forEach(c => c.classList.remove('selected-highlight'));
                currentActiveDate = dateStr;
                cell.classList.add('selected-highlight');
                filterCardsBySingleDate(dateStr);
              }
            });
          }
          fragment.appendChild(cell);
        }
        daysBody.innerHTML = '';
        daysBody.appendChild(fragment);
      }

      function filterCardsBySingleDate(dateStr) {
        const indicator = dashboard.querySelector('.list-indicator');
        if (indicator) {
          indicator.textContent = 'ON THIS DAY';
          // 【核心改动】：动态添加状态类名
          indicator.classList.add('is-single-day'); 
        }
        allCards.forEach(card => {
          card.style.display = (card.getAttribute('data-date') === dateStr) ? 'flex' : 'none';
        });
      }

      function filterCardsByMonth(year, month) {
        const indicator = dashboard.querySelector('.list-indicator');
        const prefix = year + '-' + String(month).padStart(2, '0');
        if (indicator) {
          indicator.textContent = 'UPCOMING IN ' + year + '.' + String(month).padStart(2, '0');
        indicator.classList.remove('is-single-day');
         }    
    
        let hasVisibleCards = false;
        allCards.forEach(card => {
          if (card.getAttribute('data-date').startsWith(prefix)) {
            card.style.display = 'flex';
            hasVisibleCards = true;
          } else {
            card.style.display = 'none';
          }
        });

        let emptyState = dashboard.querySelector('.empty-state-text');
        if (!hasVisibleCards) {
          if (!emptyState) {
            emptyState = document.createElement('p');
            emptyState.className = 'empty-state-text';
            emptyState.style.color = 'var(--gray)';
            emptyState.style.fontSize = '0.9rem';
            emptyState.style.fontStyle = 'italic';
            emptyState.textContent = 'No schedules found for this month.';
            const stack = dashboard.querySelector('.cards-stack');
            if (stack) stack.appendChild(emptyState);
          }
        } else if (emptyState) {
          emptyState.remove();
        }
      }

      function bindStaticClickListeners() {
        dashboard.querySelectorAll('.day-cell.has-event').forEach(cell => {
          const dateStr = cell.getAttribute('data-date');
          cell.addEventListener('click', function() {
            if (currentActiveDate === dateStr) {
              currentActiveDate = null;
              cell.classList.remove('selected-highlight');
              filterCardsByMonth(currentYear, currentMonth);
            } else {
              dashboard.querySelectorAll('.day-cell.has-event').forEach(c => c.classList.remove('selected-highlight'));
              currentActiveDate = dateStr;
              cell.classList.add('selected-highlight');
              filterCardsBySingleDate(dateStr);
            }
          });
        });
      }

      resetBtn.onclick = function() {
        const today = new Date();
        currentYear = today.getFullYear();
        currentMonth = today.getMonth() + 1;
        currentActiveDate = null;
        
        const radioYear = dashboard.querySelector('input[name="schedule-year"][value="' + currentYear + '"]');
        const radioMonth = dashboard.querySelector('input[name="schedule-month"][value="' + currentMonth + '"]');
        if (radioYear) radioYear.checked = true;
        if (radioMonth) radioMonth.checked = true;

        if (displayLabel) {
          displayLabel.textContent = currentYear + ' . ' + String(currentMonth).padStart(2, '0');
        }

        refreshGrid(currentYear, currentMonth);
        filterCardsByMonth(currentYear, currentMonth);
      };

      filterCardsByMonth(currentYear, currentMonth);
      bindStaticClickListeners();
    }

    document.addEventListener("nav", setupScheduleDashboard);
    setupScheduleDashboard();
  })();
`

export default (() => ScheduleWidget) satisfies QuartzComponentConstructor