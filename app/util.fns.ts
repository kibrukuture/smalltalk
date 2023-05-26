import { formatDistanceToNow, format } from 'date-fns';
import { Message, Room } from './ChatContext';

export function formatAmPm(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  return format(date, 'h:mm a');
}

export function distanceToNow(timestamp: string | number | Date) {
  if (!timestamp) return 'Date Unknown';
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

// new message, renew local rooms.
export const addNewMessage = (roomId: string, message: Message, setRooms: (rooms: Map<string, Room>) => void) => {
  setRooms((prev) => {
    const newRoom = new Map<string, Room>(prev);
    const newMessages = newRoom.get(roomId)!.messages.concat(message);
    newRoom.get(roomId)!.messages = newMessages;
    return newRoom;
  });
};

export function getFileTypeColors(fileType: string) {
  const fileColors: {
    [key: string]: string[];
  } = {
    pdf: ['#FF5722', '#F44336'],
    doc: ['#2196F3', '#1976D2'],
    txt: ['#FF9800', '#FFC107'],
    png: ['#4CAF50', '#8BC34A'],
    jpg: ['#FFEB3B', '#FFC107'],
    mp3: ['#9C27B0', '#673AB7'],
    mp4: ['#E91E63', '#C2185B'],
    xls: ['#00BCD4', '#009688'],
    ppt: ['#3F51B5', '#303F9F'],
    zip: ['#795548', '#607D8B'],
    css: ['#FFEB3B', '#FFC107'],
    html: ['#E91E63', '#C2185B'],
    js: ['#4CAF50', '#8BC34A'],
    svg: ['#9C27B0', '#673AB7'],
    json: ['#FF5722', '#F44336'],
    xml: ['#2196F3', '#1976D2'],
    gif: ['#FF9800', '#FFC107'],
    exe: ['#3F51B5', '#303F9F'],
    pptx: ['#795548', '#607D8B'],
    csv: ['#00BCD4', '#009688'],
    javascript: ['#FFEB3B', '#FFC107'],
    sql: ['#FF9800', '#FFC107'],
    rar: ['#FF5722', '#F44336'],
    tar: ['#2196F3', '#1976D2'],
    tgz: ['#E91E63', '#C2185B'],
    tif: ['#4CAF50', '#8BC34A'],
    tiff: ['#9C27B0', '#673AB7'],
    wav: ['#2196F3', '#1976D2'],
    xlsx: ['#4CAF50', '#8BC34A'],
    php: ['#FF5722', '#F44336'],
    java: ['#2196F3', '#1976D2'],
    py: ['#FF9800', '#FFC107'],
    c: ['#795548', '#607D8B'],
    cpp: ['#00BCD4', '#009688'],
    h: ['#FFEB3B', '#FFC107'],
    hpp: ['#E91E63', '#C2185B'],
    cs: ['#4CAF50', '#8BC34A'],
    cshtml: ['#9C27B0', '#673AB7'],
    vb: ['#FF5722', '#F44336'],
    vbhtml: ['#2196F3', '#1976D2'],
    csproj: ['#FF9800', '#FFC107'],
    sln: ['#3F51B5', '#303F9F'],
    fs: ['#795548', '#607D8B'],
    fsproj: ['#00BCD4', '#009688'],
    fsx: ['#E91E63', '#C2185B'],
    fsxproj: ['#4CAF50', '#8BC34A'],
    plain: ['#FFEB3B', '#FFC107'],
  };

  if (fileType in fileColors) {
    return fileColors[fileType];
  } else {
    // Generate random colors for unsupported file types
    const randomColor1 = '#' + Math.floor(Math.random() * 16777215).toString(16);
    const randomColor2 = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return [randomColor1, randomColor2];
  }
}

export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const milliseconds = Math.floor((remainingSeconds % 1) * 1000);

  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = remainingSeconds < 10 ? `0${Math.floor(remainingSeconds)}` : `${Math.floor(remainingSeconds)}`;
  const formattedMilliseconds = milliseconds < 100 ? `0${milliseconds}` : milliseconds < 10 ? `00${milliseconds}` : `${milliseconds}`;

  let timeString = '';
  if (hours > 0) {
    timeString = `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
  } else if (minutes > 0) {
    timeString = `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
  } else {
    timeString = `${formattedSeconds}.${formattedMilliseconds}`;
  }

  return timeString;
}

export function abbreviateName(longerName: string) {
  const fileExtensionMapping: {
    [key: string]: string;
  } = {
    javascript: 'js',
    text: 'txt',
    python: 'py',
    html: 'html',
    csv: 'csv',
    xml: 'xml',
    json: 'json',
    doc: 'doc',
    docx: 'docx',
    xls: 'xls',
    xlsx: 'xlsx',
    ppt: 'ppt',
    pptx: 'pptx',
    pdf: 'pdf',
    jpg: 'jpg',
    png: 'png',
    gif: 'gif',
    bmp: 'bmp',
    mp3: 'mp3',
    wav: 'wav',
    php: 'php',
    java: 'java',
    css: 'css',
    sass: 'sass',
    scss: 'scss',
    rb: 'rb',
    go: 'go',
    exe: 'exe',
    zip: 'zip',
    rar: 'rar',
    sh: 'sh',
    txt: 'txt',
    ini: 'ini',
    log: 'log',
    svg: 'svg',
    jsx: 'jsx',
    ts: 'ts',
    cpp: 'cpp',
    h: 'h',
    md: 'md',
    sql: 'sql',
    plain: 'txt',
    'x-zip-compressed': 'zip',
    'x-zip': 'zip',
    'x-rar-compressed': 'rar',
    'x-rar': 'rar',
    'x-7z-compressed': '7z',
    'x-7z': '7z',
    'x-tar': 'tar',
    'x-gzip': 'gz',
    'x-bzip2': 'bz2',
    'x-bzip': 'bz',
    'x-xz': 'xz',
    'x-lzip': 'lz',
    'x-lzma': 'lzma',
    'x-lzop': 'lzo',
    'x-lrzip': 'lrz',
    'x-lz4': 'lz4',
    'x-zstandard': 'zst',
    'x-java-archive': 'jar',
    'x-sharedlib': 'so',
    'x-object': 'o',
    'x-executable': 'exe',
    'x-ms-dos-executable': 'exe',
    'x-mach-binary': 'exe',
    'x-archive': 'a',
    'x-deb': 'deb',
    'x-rpm': 'rpm',
    'x-msi': 'msi',
    'x-appimage': 'appimage',
    'x-nintendo-nes-rom': 'nes',
    'x-nintendo-snes-rom': 'sfc',
    'x-nintendo-64-rom': 'n64',
    'x-nintendo-gamecube-rom': 'iso',
    'x-nintendo-wii-rom': 'iso',
    'x-sega-genesis-rom': 'smd',
    mp3: 'mp3',
  };
  return fileExtensionMapping[longerName.toLocaleLowerCase().trim()] || longerName;
}

export function formatFileSize(size: number) {
  if (size < 1024) {
    return size + ' bytes';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
}

// /api/opengraphscrapper
export async function scrapWebsite(url: string) {
  const response = await fetch(`http://localhost:4040/api/opengraphscrapper/?url=${url}`, {
    method: 'GET',
  });
  const data = await response.json();
  return data;
}
