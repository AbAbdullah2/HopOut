export function formatTime(date) {
  const hour = date.getHours() % 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return (hour === 0 ? 12 : hour) + (minutes !== '00' ? ':' + minutes + ' ': '');
}

export function AMPM(date) {
  return date.getHours() >= 12 ? 'PM' : 'AM';
}

export function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  return (months[date.getMonth() + 1]) + ' ' + date.getDate();
}

export function formatEventDates(start, end) {
  const startString = formatDate(start) + ' at ' + formatTime(start) + ' ' + ((AMPM(start) === AMPM(end) && (formatDate(start) === formatDate(end))) ? '' : AMPM(start));
  const endString = (formatDate(end) === formatDate(start) ? ' - ' : ' - ' + formatDate(end) + ' at ') + formatTime(end) + ' ' + AMPM(end);
  return startString + endString;
}