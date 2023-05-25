<!-- client app -->

cd desktop/chat-app && npm run dev

<!-- server app -->

cd desktop/chat-app/socket && npm run dev

<!-- extract links, hashes, mentions, emails, urls -->

https://linkify.js.org/docs/linkifyjs.html

https://dev.to/lydiahallie/cs-visualized-cors-5b8h

https://dribbble.com/shots/18021022-Medical-CRM-Dashboard-Video-Call-with-Doctor

# https://www.npmjs.com/package/linkify-html

# https://www.npmjs.com/package/link-preview-js

# https://linkify.js.org/docs/plugin-mention.html

# https://www.npmjs.com/package/open-graph-scraper

{
(async function getOGS(url) {
const options = { url };
const res = await ogs(options);
const data = await res.result;
console.log(data);
})('https://www.npmjs.com/package/better-image-optimizer-next');
}

ogSiteName: 'YouTube',
ogUrl: 'https://www.youtube.com/watch?v=zqeqdepYkcw',
ogTitle: 'Comedian makes a CHEEKY dig at Amanda Holden! | Auditions | BGT 2023',
ogDescription: "Funny-man, Bennet Kavanagh, makes a tuneful tease at Amanda and has Simon Cowell in absolute stitches!See more from Britain's Got Talent at http://itv.com/BG...",
ogDate
ogType: 'article',
ogUrl: 'https://www.bbc.com/news/entertainment-arts-65585413',
ogImage: [
{
height: '720',
url: 'https://i.ytimg.com/vi/zqeqdepYkcw/maxresdefault.jpg',
width: '1280',
type: 'jpg'
}
],

image url might not be absolute path. so we need to check if it is absolute path or not.

siteName: 'YouTube',[]
url: 'https://www.youtube.com/watch?v=zqeqdepYkcw',[]
title: 'Comedian makes a CHEEKY dig at Amanda Holden! | Auditions | BGT 2023',[]
description: "Funny-man, Bennet Kavanagh, makes a tuneful tease at Amanda and has Simon Cowell in absolute stitches!See more from Britain's Got Talent at http://itv.com/BG..."[]
date: '2021-03-03T16:00:00.000Z',[]
type: 'article',[]
image:{
url: 'https://i.ytimg.com/vi/zqeqdepYkcw/maxresdefault.jpg',
width: '1280',
height: '720'
type: 'jpg'
}[]

_/
/_

🔗 https://www.youtube.com/watch?v=zqeqdepYkcw
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Fusce aliquam nisi ut felis euismod fringilla. Integer
mollis placerat eleifend. Nam semper auctor ipsum, a dapibus
nulla efficitur et.

    https://i.ytimg.com/vi/zqeqdepYkcw/maxresdefault.jpg
    Youtube
    Comedian makes a CHEEKY dig at Amanda Holden! | Auditions | BGT 2023
    Funny-man, Bennet Kavanagh, makes a tuneful tease at Amanda and has Simon Cowell in absolute stitches!See more from Britain's Got Talent at http://itv.com/BG...

    Video | 📅 2 months ago

link:{
siteName: 'YouTube',
url: 'https://www.youtube.com/watch?v=zqeqdepYkcw',
title: 'Comedian makes a CHEEKY dig at Amanda Holden! | Auditions | BGT 2023',
description: "Comedian makes a CHEEKY dig at Amanda Holden! | Auditions | BGT 2023
Funny-man, Bennet Kavanagh, makes a tuneful tease at Amanda and has Simon Cowell in absolute stitches!See more from Britain's Got Talent at http://itv.com/BG...",
type: 'video',
date: '2021-03-03T16:00:00.000Z',
image:{
url: 'https://i.ytimg.com/vi/zqeqdepYkcw/maxresdefault.jpg',
width: '1280',
height: '720'
type: 'jpg'
}
}
\*/

let handler = function (target, prop, receiver) {

console.log(target, prop, receiver);

return Reflect.get(...arguments);

    }
