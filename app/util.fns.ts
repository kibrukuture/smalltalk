import { formatDistanceToNow, format } from 'date-fns';

export function formatAmPm(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  return format(date, 'h:mm a');
}

export function distanceToNow(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function getColorFromName(name: string) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  const colors = [
    '#FF6633', // Red + Yellow
    '#FFB399', // Red + Yellow + Blue
    '#FF33FF', // Red + Blue
    '#FFFF99', // Yellow + Blue
    '#00B3E6', // Blue + Cyan
    '#E6B333', // Yellow + Red + Blue
    '#3366E6', // Cyan + Blue
    '#999966', // Yellow + Red
    '#99FF99', // Yellow + Cyan
    '#B34D4D', // Red + Brown
    '#80B300', // Yellow + Brown

    '#FFCC00', // Red + Yellow + Green
    '#FF9999', // Red + Yellow + Red
    '#FF3366', // Red + Blue + Green
    '#66FFCC', // Cyan + Green + Yellow
    '#00E6FF', // Cyan + Blue + Magenta
    '#E600FF', // Red + Blue + Magenta
    '#3399CC', // Blue + Green + Magenta
    '#99CCFF', // Cyan + Magenta + Blue
    '#CC9999', // Red + Yellow + Blue + Green
    '#CC6666', // Red + Brown + Brown
    '#990000', // Red + Brown

    '#CC00CC', // Red + Magenta
    '#CC0099', // Red + Magenta + Yellow
    '#9900FF', // Red + Magenta + Blue
    '#00CC99', // Green + Magenta + Yellow
    '#00FFE6', // Cyan + Magenta + Blue
    '#6600CC', // Red + Brown + Magenta
    '#6600FF', // Red + Brown + Blue
    '#0099CC', // Green + Magenta + Blue
    '#99CC66', // Cyan + Magenta + Brown
    '#6666CC', // Brown + Magenta + Blue

    '#9999CC', // Cyan + Magenta + Blue + Green
    '#6699CC', // Cyan + Magenta + Blue + Brown
    '#CC9966', // Red + Magenta + Brown + Blue
    '#CC6699', // Red + Magenta + Brown + Yellow
    '#9933CC', // Red + Blue + Magenta + Green
    '#3399CC', // Blue + Green + Magenta + Cyan
    '#33CC99', // Blue + Magenta + Cyan + Yellow
    '#99CC33', // Cyan + Magenta + Blue + Red
    '#CC9933', // Red + Magenta + Brown + Blue
    '#66CC66', // Brown + Magenta + Cyan + Blue

    '#CC66CC', // Red + Magenta + Brown + Blue + Green
    '#996699', // Red + Brown + Brown + Yellow
    '#666666', // Brown + Brown + Brown,
    '#FF9966', // Red + Yellow + Magenta
    '#FFCC33', // Red + Yellow + Cyan
    '#FF6699', // Red + Blue + Magenta
    '#FF33CC', // Red + Blue + Cyan
    '#FFFF33', // Yellow + Blue + Magenta
    '#FFFFCC', // Yellow + Blue + Cyan
    '#00FF66', // Blue + Yellow + Green
    '#00FFE6', // Blue + Cyan + Green
    '#00E699', // Cyan + Blue + Magenta
    '#00B333', // Cyan + Red + Brown

    '#CC9900', // Red + Magenta + Brown
    '#CCCC00', // Red + Cyan + Brown
    '#99CC00', // Yellow + Magenta + Brown
    '#999900', // Yellow + Cyan + Brown
    '#33CC66', // Blue + Magenta + Yellow
    '#3399CC', // Blue + Magenta + Cyan
    '#6666FF', // Brown + Blue + Magenta
    '#6633FF', // Brown + Red + Magenta
    '#6600CC', // Brown + Red + Cyan
    '#80B34D', // Yellow + Brown + Red

    '#FF0033', // Red + Yellow + Red
    '#FF3300', // Red + Blue + Red
    '#00FF00', // Yellow + Blue + Green
    '#009900', // Green + Yellow + Brown
    '#0000FF', // Blue + Cyan + Blue
    '#0000CC', // Blue + Magenta + Blue
    '#000099', // Blue + Green + Blue
    '#800000', // Red + Brown + Brown
    '#4D4D4D', // Brown + Brown + Brown
    '#333333', // Brown + Brown + Brown
    '#FFCC99', // Red + Yellow + Cyan + Magenta
    '#FF99CC', // Red + Yellow + Blue + Magenta
    '#FF66CC', // Red + Blue + Green + Magenta
    '#FF3399', // Red + Blue + Yellow + Magenta
    '#FFFFCC', // Yellow + Blue + Cyan + Magenta
    '#FFFF99', // Yellow + Blue + Yellow + Magenta
    '#00FFE6', // Blue + Cyan + Green + Magenta
    '#00E6CC', // Cyan + Blue + Blue + Magenta
    '#00B366', // Cyan + Red + Blue + Green
    '#0099FF', // Green + Yellow + Blue + Magenta

    '#CC99FF', // Red + Magenta + Cyan + Blue
    '#CCCC99', // Red + Cyan + Cyan + Magenta
    '#99CCFF', // Yellow + Magenta + Cyan + Blue
    '#9999FF', // Yellow + Cyan + Cyan + Magenta
    '#33CC99', // Blue + Magenta + Yellow + Cyan
    '#3399CC', // Blue + Magenta + Cyan + Blue
    '#6666FF', // Brown + Blue + Cyan + Magenta
    '#6633CC', // Brown + Red + Cyan + Magenta
    '#6600FF', // Brown + Red + Blue + Magenta
    '#80B3FF', // Yellow + Brown + Cyan + Blue

    '#FF0099', // Red + Yellow + Green + Magenta
    '#FF3366', // Red + Blue + Green + Magenta
    '#00FF66', // Blue + Yellow + Green + Magenta
    '#009966', // Green + Yellow + Green + Magenta
    '#0000FF', // Blue + Cyan + Blue + Magenta
    '#0000CC', // Blue + Magenta + Blue + Magenta
    '#000099', // Blue + Green + Blue + Magenta
    '#800099', // Red + Brown + Green + Magenta
    '#4D4D99', // Brown + Brown + Green + Magenta
    '#333399', // Brown + Brown + Brown + Magenta
  ];
  return colors[sum % colors.length];
}

// check if user is logged in

export async function isLoggedIn() {
  const logInToken = localStorage.getItem('logInToken');
  const res = await fetch('http://localhost:4040/api/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${logInToken}`,
    },
  });
  const { status } = await res.json();
  if (status === 'error') {
    // remove token
    return false;
  } else {
    return true;
  }
}

export function checkUsernameValidity(username: string) {
  let pattern = /^[a-zA-Z][a-zA-Z0-9_]{5,29}$/;
  return pattern.test(username);
}

export function checkPasswordValidity(password: string) {
  let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$#!%*?&]{8,}$/;
  return pattern.test(password);
}

// get initials if no avatars.
export function getInitials(name: string) {
  if (name.split(' ').length > 1) {
    const [first, last] = name.split(' ');
    return first[0] + last[0];
  } else {
    return name.slice(0, 2);
  }
}

function playSoundEffect(type: string) {
  document.removeEventListener('click', () => playSoundEffect(type)); //remove event listener

  const audio = new Audio('/sound-effects/notification.wav');
  audio.play();
}
