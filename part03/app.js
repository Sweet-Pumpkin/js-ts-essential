/** AJAX */
const ajax = new XMLHttpRequest();

/** URL */
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
// @id => 마킹!
const CONTENTS_URL = 'https://api.hnpwa.com/v0/item/@id.json';

/** 함수 */
// GET Hacker News API
function getData(URL) {
    // open(1, 2, 3); => 1: string, 2: url, 3: boolean(비동기 or 동기 처리 유무)
    ajax.open('GET', URL, false);
    ajax.send();

    return JSON.parse(ajax.response);
}

/** 탐색 & 선언 */
// html 요소
const container = document.getElementById('root');
// 뉴스 목록 가져오기
const newsFeed = getData(NEWS_URL);
// elements
const content = document.createElement('div');
const ul = document.createElement('ul');

/** hash change */
// a.href에 입력한 주소가 바뀔때마다 이벤트 실행
window.addEventListener('hashchange', function() {
    // 콘텐츠 아이디 추출 
    // '#1234'로 출력됨 => '#' 제거(substring)
    const id = location.hash.substring(1);
    // url의 마킹 '@id'를 replace() 메서드를 이용해 'id'로 변경
    const newsContent = getData(CONTENTS_URL.replace('@id', id));

    // 뉴스 타이틀 출력
    const title = document.createElement('h1');
    title.innerHTML = newsContent.title;
    content.appendChild(title);
});

/** 출력 */
for (let i = 0; i < 10; i++) {
    // 임시 태그
    const div = document.createElement('div');
    
    div.innerHTML = `
        <li>
            <a href="#${newsFeed[i].id}">
                ${newsFeed[i].title} (${newsFeed[i].comments_count})
            </a>
        </li>
    `

    // div요소는 필요없으므로 자식 태그 'li' 태그부터 사용
    ul.appendChild(div.children[0]);
}

container.appendChild(ul);
container.appendChild(content);