import { QuartzComponent, QuartzComponentConstructor } from "./types"

const ScheduleWidget: QuartzComponent = ({ fileData }) => {
  if (!fileData.frontmatter?.isSchedule) {
    return null
  }

  const events = (fileData.frontmatter.events || []) as Array<{
    date: string
    time?: string
    title: string
    type: string
  }>

  const initYear = parseInt(fileData.frontmatter.scheduleYear) || new Date().getFullYear()
  const initMonth = parseInt(fileData.frontmatter.scheduleMonth) || (new Date().getMonth() + 1)

  // 构建年份下拉菜单（前后浮动3年）
  const yearOptions = []
  for (let y = initYear - 3; y <= initYear + 3; y++) {
    yearOptions.push(<option value={y} selected={y === initYear}>{y}</option>)
  }

  // 服务端预先计算并渲染初始月份，防止首次载入时页面塌陷错位
  const firstDay = new Date(initYear, initMonth - 1, 1).getDay()
  const daysInMonth = new Date(initYear, initMonth, 0).getDate()
  const staticCells = []

  // 1. 严格填充上月空白格子，确保星期完全对齐
  for (let i = 0; i < firstDay; i++) {
    staticCells.push(<div class="day-cell pad-day"></div>)
  }

  // 2. 生成带事件标记的日期格子
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${initYear}-${String(initMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const hasEvent = events.some(e => e.date === dateStr)
    staticCells.push(
      <div class={`day-cell${hasEvent ? ' has-event' : ''}`} data-date={dateStr}>
        <span class="day-text">{d}</span>
      </div>
    )
  }

  return (
    <div 
      class="custom-schedule-dashboard" 
      data-events={JSON.stringify(events)}
      data-init-year={initYear}
      data-init-month={initMonth}
    >
      <div class="calendar-wrapper">
        <div class="calendar-nav-header">
          <div class="selector-group">
            <select class="schedule-select year-select">
              {yearOptions}
            </select>
            <select class="schedule-select month-select">
              {[...Array(12).keys()].map(m => (
                <option value={m + 1} selected={m + 1 === initMonth}>
                  {String(m + 1).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
          <button class="reset-today-btn">TODAY</button>
        </div>
        
        <div class="grid-table">
          <div class="week-header">
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>
          <div class="days-body">
            {staticCells}
          </div>
        </div>
      </div>

      <div class="list-wrapper">
        <h3 class="list-indicator">UPCOMING</h3>
        <div class="cards-stack">
          {events.map((evt) => (
            <div class="widget-card" data-date={evt.date}>
              {/* 对齐您 CSS 中的标签判断逻辑 */}
              <span class={`badge-tag tag-${evt.type}`}>
                {evt.type === 'concert' ? 'LIVE' : evt.type === 'album' ? 'ALBUM' : ''}
              </span>
              <div class="card-inner">
                <strong class="card-title">{evt.title}</strong>
                <span class="card-meta">{evt.date.replace(/-/g, '.')} {evt.time ? `· ${evt.time}` : ''}</span>
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
      let currentYear = parseInt(dashboard.getAttribute('data-init-year'));
      let currentMonth = parseInt(dashboard.getAttribute('data-init-month'));

      const daysBody = dashboard.querySelector('.days-body');
      const yearSelect = dashboard.querySelector('.year-select');
      const monthSelect = dashboard.querySelector('.month-select');
      const resetBtn = dashboard.querySelector('.reset-today-btn');
      const allCards = dashboard.querySelectorAll('.widget-card');
      
      let currentActiveDate = null;

      // 动态切换年月时的重绘网格逻辑
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
          const isEvent = events.some(e => e.date === dateStr);
          
          const cell = document.createElement('div');
          cell.className = 'day-cell' + (isEvent ? ' has-event' : '');
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
        indicator.textContent = 'ON THIS DAY';
        allCards.forEach(card => {
          card.style.display = (card.getAttribute('data-date') === dateStr) ? 'flex' : 'none';
        });
      }

      function filterCardsByMonth(year, month) {
        const indicator = dashboard.querySelector('.list-indicator');
        const prefix = year + '-' + String(month).padStart(2, '0');
        indicator.textContent = 'UPCOMING IN ' + year + '.' + String(month).padStart(2, '0');
        
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
            dashboard.querySelector('.cards-stack').appendChild(emptyState);
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

      yearSelect.onchange = function() {
        currentYear = parseInt(yearSelect.value);
        currentActiveDate = null;
        refreshGrid(currentYear, currentMonth);
        filterCardsByMonth(currentYear, currentMonth);
      };

      monthSelect.onchange = function() {
        currentMonth = parseInt(monthSelect.value);
        currentActiveDate = null;
        refreshGrid(currentYear, currentMonth);
        filterCardsByMonth(currentYear, currentMonth);
      };

      resetBtn.onclick = function() {
        const today = new Date();
        currentYear = today.getFullYear();
        currentMonth = today.getMonth() + 1;
        currentActiveDate = null;
        yearSelect.value = currentYear;
        monthSelect.value = currentMonth;
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