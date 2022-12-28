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

#### 4. location 객체
[참고 링크](https://ffoorreeuunn.tistory.com/167)
- 문서의 주소와 관련된 객체로 window 객체의 프로퍼티.
- 이 객체로 윈도우 문서의 url을 변경, 문서의 위치와 관련해 다양한 정보를 얻을 수 있음.

#### 5. DOM API => 문자열로 바꾸기 
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