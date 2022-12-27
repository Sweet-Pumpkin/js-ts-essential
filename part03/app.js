const ajax = new XMLHttpRequest();
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';

/** Hacker News API */
// open(1, 2, 3); => 1: string, 2: url, 3: boolean(비동기 or 동기 처리 유무)
ajax.open('GET', NEWS_URL, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);

/** 탐색 & 선언 */
const root = document.getElementById('root');
const ul = document.createElement('ul');


/** 출력 */
root.appendChild(ul);
for (let i = 0; i < 10; i++) {
    const li = document.createElement('li');
    ul.appendChild(li);
    li.innerText = newsFeed[i].title;
}
