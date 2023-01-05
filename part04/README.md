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
## 2. TypeScript Migration
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

#### 5. 인터페이스
- type alias는 `=`를 사용
- type interface는 `=` 사용하지 않음
```
type Store = {

}

interface Store {

}
```
- type alias는 `&`
- type interface는 `extends` 사용
```
type NewsDetail = News & {
    comments: NewsComment[];
}

interface NewsDetail extends News {
    comments: NewsComment[];
}
```

#### 5. readonly
- 타입에 대한 설명 중 하나
- readonly를 지정하면 값을 바꾸지 못함.

#### 6. class
- class는 최초 초기화 과정이 필요
- constructor(생성자)로 초기화
```
class Api {
    url: string;
    ajax: XMLHttpRequest;

    constructor(url: string) {
        this.url= url;
        this.ajax = new XMLHttpRequest();
    }

    // protected => 지시어를 외부에 노출 x
    protected getRequest<AjaxResponse>(): AjaxResponse {
        this.ajax.open('GET', this.url, false);
        this.ajax.send();

        return JSON.parse(this.ajax.response);
    }
}

class NewsFeedApi extends Api {
    getData(): NewsFeed[] {
        return this.getRequest<NewsFeed[]>();
    }
}

class NewsDetailApi extends Api {
    getData(): NewsDetail {
        return this.getRequest<NewsDetail>();
    }
}

function newsFeedFnc(): void {
    const api = new NewsFeedApi(NEWS_URL);

    if (newsFeed.length === 0) {
        newsFeed = store.feeds = makeFeeds(api.getData());
    }
}

function newsDetailFnc(): void {
    const id = location.hash.substring(7);
    const api = new NewsDetailApi(CONTENTS_URL.replace('@id', id));
    const newsContent = api.getData();
}
```

#### 7. mixin
- `class`의 `extends` 기능을 이용하지 않고 단독 객체처럼 사용
- 필요할 경우 `class`를 합성해서 확장해 사용
- 기존 `class`는 다수의 `extends` 불가하나, `mixin` 기법은 가능
```
/** MIXIN FNC */
// typescript 공식 문서 참조
function applyApiMixins(targetClass: any, baseClasses: any[]): void {
    baseClasses.forEach(baseClass => {
        Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
            const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);
            
            if (descriptor) {
                Object.defineProperty(targetClass, name, descriptor);
            }
        });
    })
}

/** CLASS */
class Api {
    getRequest<AjaxResponse>(url: string): AjaxResponse {
        const ajax = new XMLHttpRequest();
        ajax.open('GET', url, false);
        ajax.send();

        return JSON.parse(ajax.response);
    }
}

class NewsFeedApi {
    getData(): NewsFeed[] {
        return this.getRequest<NewsFeed[]>(NEWS_URL);
    }
}

class NewsDetailApi {
    getData(id: string): NewsDetail {
        return this.getRequest<NewsDetail>(CONTENTS_URL.replace('@id', id));
    }
}

// 합성될 class를 typescript 컴파일러에 알려주기
interface NewsFeedApi extends Api {};
interface NewsDetailApi extends Api {};

// Mixin 실행
applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);
```
#### 8. View class
- 상위 클래스의 인자를 하위 클래스에서 사용할때 `super()`를 사용해야 함.
```
class View {
    containerId: string;
}

class NewsFeedView {
    super(containerId);
}
```
- 하위 클래스에게 메서드를 강제하기 위한 마킹을 추상 메서드(abstract)라고 한다.
- 자식 메서드는 반드시 부모가 강제한 추상 메서드를 반드시 구현해야함.
```
abstract class View {
    abstract render();
}

class child {
    render();
}
```

#### 9. 전역 스토어
- 어느 파일에서든 사용할 수 있게 
```
const store: Store = {
    currentPage: 1,
    feeds: [],
}

declare global {
    interface Window {
        store: Store;
    }
}

window.store = store;
```