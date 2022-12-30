## Hacker News Client App with TypeScript

### 1. 시작하기
#### 1. js파일 ts로 변경
#### 2. tsconfig.json 파일 생성
```
{
    "compilerOptions": {
        "strict": true, // typescript 기능을 얼마나 엄격하게 할 것인지
        "target": "ES5", // 컴파일 된 파일의 문법 체계 설정
        "module": "CommonJS", // 컴파일 된 파일의 문법 체계 설정
        "alwaysStrict": true,
        "noImplicitAny": true, // any 타입을 쓰지 못 하도록
        "noImplicitThis": true,
        "sourceMap": true, // /dist의 .map 파일을 생성하도록
        "downlevelIteration": true,
    }
}
```
## 2. 타입 작성
#### 1. rest client
- vscode extension 
- api 호출을 에디터 상에서 볼 수 있게 해줌
```
hn.http
###
GET /** URL */ HTTP/1.1
```
- send request 버튼 클릭
#### 2. type alias 중복 처리
```
type News = {
    id: number;
    time_ago: string;
    title: string;
    url: string;
    user: string;
    content: string;
}
type NewsFeed = News & {
    comments_count: number;
    points: number;
    read?: boolean;
}
```
- 중복되는 부분을 따로 모아 타입 별칭을 만든 뒤, 필요한 곳에 만든 타입 별칭과 `&`입력
#### 3. 제네릭
- 입력이 n개의 유형일때, 출력도 n개의 유형인 것을 정의
- 호출하는 쪽의 함수명과 `()` 사이에 `<>`와 그 안에 유형을 명시, 출력하는 쪽의 함수명과 `()` 사이에 `<>`와 그 안에 타입을 명시
```
// 호출
function getDataFnc<AjaxResponse>(url: string): AjaxResponse {
    ajax.open('GET', url, false);
    ajax.send();

    return JSON.parse(ajax.response);
}

// 출력
function newsFeedFnc() {
    let newsFeed: NewsFeed[] = store.feeds;
    if (newsFeed.length === 0) {
        newsFeed = store.feeds = makeFeeds(getDataFnc<NewsFeed[]>(NEWS_URL));
    }
}
function newsDetailFnc() {
    const id = location.hash.substring(7);
    const newsContent = getDataFnc<NewsDetail[]>(CONTENTS_URL.replace('@id', id));
}
```
#### 4. 함수의 리턴 값이 없을때
- `void`를 쓴다