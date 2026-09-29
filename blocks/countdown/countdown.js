export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const headerRow = rows[0];
  const timerRow = rows[1];

  headerRow.classList.add('countdown-header');
  timerRow.classList.add('countdown-timer');

  // Grab the authored date (handles "december 1 , 00 : 22 : 04 : 56" and standard dates)
  const targetDateString = timerRow.textContent.trim();
  const currentYear = new Date().getFullYear();
  const datePart = targetDateString.split(',')[0].trim();
  
  let targetDate = new Date(targetDateString).getTime();
  if (isNaN(targetDate)) {
    targetDate = new Date(`${datePart} ${currentYear}`).getTime();
  }
  if (targetDate < Date.now() && !/\b20\d\d\b/.test(targetDateString)) {
    targetDate = new Date(`${datePart} ${currentYear + 1}`).getTime();
  }

  // Create a clean element for the timer display
  const timerDisplay = document.createElement('div');
  timerRow.innerHTML = '';
  timerRow.append(timerDisplay);

  // Fallback if the author types an invalid date
  if (isNaN(targetDate)) {
    timerDisplay.textContent = '00 : 00 : 00 : 00';
    console.error('Countdown block requires a valid date string in the second row.');
    return;
  }

  let interval;

  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Stop at zero
    if (distance <= 0) {
      timerDisplay.textContent = '00 : 00 : 00 : 00';
      if (interval) clearInterval(interval);
      return;
    }

    // Calculate time units and pad with leading zeros
    const days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');

    timerDisplay.textContent = `${days} : ${hours} : ${minutes} : ${seconds}`;
  };

  updateTimer(); // Call immediately to prevent a 1-second blank flash
  interval = setInterval(updateTimer, 1000);
}