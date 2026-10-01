function createUnit(unitName) {
  const span = document.createElement('span');
  span.className = `countdown-unit countdown-${unitName}`;
  span.textContent = '00';
  return span;
}

function createSeparator() {
  const span = document.createElement('span');
  span.className = 'countdown-separator';
  span.textContent = ':';
  return span;
}

function setUnitValue(el, val) {
  if (el.textContent !== val) {
    el.classList.add('is-changing');
    el.textContent = val;
    // Force reflow to ensure the initial transform/opacity applies before animating back
    // eslint-disable-next-line no-unused-expressions
    el.offsetWidth;
    requestAnimationFrame(() => {
      el.classList.remove('is-changing');
    });
  }
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const headerRow = rows[0];
  const timerRow = rows[1];

  // 1. Assign classes to the Header Row structure
  headerRow.classList.add('countdown-header');

  const headerInner = headerRow.firstElementChild;
  if (headerInner) {
    headerInner.classList.add('countdown-header-inner');
    const headerP = headerInner.querySelector('p');
    if (headerP) {
      headerP.classList.add('countdown-header-text');
    }
  }

  // 2. Assign classes to the Timer Row wrapper
  timerRow.classList.add('countdown-timer');

  // Grab the authored date (handles "december 1 , 00 : 22 : 04 : 56" and standard dates)
  const targetDateString = timerRow.textContent.trim();
  const currentYear = new Date().getFullYear();
  const datePart = targetDateString.split(',')[0].trim();

  let targetDate = new Date(targetDateString).getTime();
  if (Number.isNaN(targetDate)) {
    targetDate = new Date(`${datePart} ${currentYear}`).getTime();
  }
  if (targetDate < Date.now() && !/\b20\d\d\b/.test(targetDateString)) {
    targetDate = new Date(`${datePart} ${currentYear + 1}`).getTime();
  }

  // Create a clean element for the timer display and add the inner class
  const timerDisplay = document.createElement('div');
  timerDisplay.classList.add('countdown-timer-inner');
  timerDisplay.setAttribute('role', 'timer');

  const daysUnit = createUnit('days');
  const hoursUnit = createUnit('hours');
  const minutesUnit = createUnit('minutes');
  const secondsUnit = createUnit('seconds');

  timerDisplay.append(
    daysUnit,
    createSeparator(),
    hoursUnit,
    createSeparator(),
    minutesUnit,
    createSeparator(),
    secondsUnit,
  );

  timerRow.innerHTML = '';
  timerRow.append(timerDisplay);

  // Fallback if the author types an invalid date
  if (Number.isNaN(targetDate)) {
    setUnitValue(daysUnit, '00');
    setUnitValue(hoursUnit, '00');
    setUnitValue(minutesUnit, '00');
    setUnitValue(secondsUnit, '00');
    // eslint-disable-next-line no-console
    console.error('Countdown block requires a valid date string in the second row.');
    return;
  }

  let interval;

  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Stop at zero
    if (distance <= 0) {
      setUnitValue(daysUnit, '00');
      setUnitValue(hoursUnit, '00');
      setUnitValue(minutesUnit, '00');
      setUnitValue(secondsUnit, '00');
      if (interval) clearInterval(interval);
      return;
    }

    // Calculate time units and pad with leading zeros
    const days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((distance % (1000 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');

    setUnitValue(daysUnit, days);
    setUnitValue(hoursUnit, hours);
    setUnitValue(minutesUnit, minutes);
    setUnitValue(secondsUnit, seconds);

    timerDisplay.setAttribute('aria-label', `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
  };

  updateTimer(); // Call immediately to prevent a 1-second blank flash
  interval = setInterval(updateTimer, 1000);
}


