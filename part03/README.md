## Hacker News Client App

### 1. API 소개
- [Hacker News PWA](https://hnpwa.com/)
- [Hacker News Github](https://github.com/tastejs/hacker-news-pwas)

### 2. 시작하기
#### 1. parcel로 index.html 파일 실행하기
```
parcel index.html
```

#### 2. XMLHttpRequest
[MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
```
const ajax = XMLHttpRequest();
ajax.open('GET', 'URL', 'Boolean');
ajax.send();
JSON.parse(ajax.response);
```

### 3. 로직
#### 1. location 객체
[참고 링크](https://ffoorreeuunn.tistory.com/167)
- 문서의 주소와 관련된 객체로 window 객체의 프로퍼티.
- 이 객체로 윈도우 문서의 url을 변경, 문서의 위치와 관련해 다양한 정보를 얻을 수 있음.

#### 2. DOM API => 문자열로 바꾸기 
##### DOM API
```
for (let i = 0; i < 10 i++) {
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.href = `#${newsFeed[i].id}`;
    a.innerHTML = `${newsFeed[i].title (${newsFeed[i].comments_count})}`;

    li.appendChild(a);
    ul.appendChild(li);
} 
```

##### 문자열1
```
for (let i = 0; i < 10 i++) {
    const div = document.createElement('div');

    div.innerHTML = `
        <li>
            <a href="#${newFeed[i].id}">
                ${newsFeed[i].title (${newsFeed[i].comments_count})}             
            </a>
        </li>
    `

    ul.appendChild(div.children[0]);
}
```

##### 문자열2
```
const newsList = [];
newsList.push('<ul>');
for (let i = 0; i < 10; i++) {
    
    newsList.push(`
        <li>
            <a href="#${newsFeed[i].id}">
                ${newsFeed[i].title} (${newsFeed[i].comments_count})
            </a>
        </li>
    `);
}
newsList.push('</ul>');
container.innerHTML = newsList.join('');
```

#### 3. router
```
// 라우터 함수
function routerFnc() {
    const routePath = location.hash;

    if (routePath === '') {
        // 해시 값이 없을 경우 => 목록
        newsFeedFnc();
    } else if (routePath.indexOf('#/page/') >= 0) {
        // 해시 값에 '#/page/'가 0보다 클 때 => 목록 페이지
        store.currentPage = Number(routePath.substring(7));
        newsFeedFnc();
    } else {
        // 해시 값이 있을 경우 => 콘텐츠
        newsDetailFnc();
    }
}

/** ADD EVENT */
// hashchange: a.href에 입력한 주소가 바뀔때마다 이벤트 실행
window.addEventListener('hashchange', routerFnc);

/** 라우터 실행 */
routerFnc();
```

#### 4. 페이징
```
const store = {
    currentPage: 1,
}

// 한 페이지 당 뉴스 목록
const PAGE_ELS = 10;
// 마지막 뉴스 목록 페이지 수
const lastNewsFeed = newsFeed.length / PAGE_ELS;

for (let i = (store.currentPage - 1) * PAGE_ELS; i < store.currentPage * PAGE_ELS; i++) {
    /** 생략 */
}

// 네비게이션
newsList.push(`
    <div>
        <a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전 페이지</a>
        <a href="#/page/${store.currentPage <  lastNewsFeed ? store.currentPage + 1 : lastNewsFeed}">다음 페이지</a>
    </div>
`);
```

#### 5. 템플릿
```
let template = `
    <div>
        <h1>Hackers News</h1>
        <ul>
            {{__news_feed__}}
        </ul>
        <div>
            <a href="#/page/{{__prev_page__}}">이전 페이지</a>
            <a href="#/page/{{__next_page__}}">다음 페이지</a>
        </div>
    </div>
`

// 템플릿 내용 대체
// 뉴스 콘텐츠
template = template.replace('{{__news_feed__}}', newsList.join(''));
// 이전 페이지
template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1);
// 다음 페이지
template = template.replace('{{__next_page__}}', store.currentPage < lastNewsFeed ? store.currentPage + 1 : lastNewsFeed);
// 출력
container.innerHTML = template;
```

### 4. tailwind
#### 1. tailwind cdn
```
<script src="https://cdn.tailwindcss.com"></script>
```

### 5. fontawesome
[cdnjs](https://cdnjs.com/)
```
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
```