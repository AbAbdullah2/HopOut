export function formatTime(date) {
  const hour = date.getHours() % 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return (hour === 0 ? 12 : hour) + (minutes !== '00' ? ':' + minutes + ' ': '');
}

export function AMPM(date) {
  return date.getHours() >= 12 ? 'PM' : 'AM';
}

export function formatDate(date) {
  return (date.getMonth() + 1) + '/' + date.getDate();
}

export function formatEventDates(start, end) {
  const startString = formatDate(start) + ' ' + formatTime(start) + (AMPM(start) === AMPM(end) ? '' : AMPM(start));
  const endString = (formatDate(end) === formatDate(start) ? '-' : ' - ' + formatDate(end) + ' ') + formatTime(end) + ' ' + AMPM(end);
  return startString + endString;
}