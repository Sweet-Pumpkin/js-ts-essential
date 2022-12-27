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