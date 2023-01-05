/** TYPE ALIAS */
interface Store {
    currentPage: number;
    feeds: NewsFeed[];
}
interface News {
    readonly id: number;
    readonly time_ago: string;
    readonly title: string;
    readonly url: string;
    readonly user: string;
    readonly content: string;
}
interface NewsFeed extends News {
    readonly comments_count: number;
    readonly points: number;
    read?: boolean;
}
interface NewsComment extends News {
    readonly comments: NewsComment[];
    readonly level: number;
}
interface NewsDetail extends News {
    readonly comments: NewsComment[];
}
interface RouteInfo {
    path: string;
    page: View;
}

/** AJAX */
const ajax: XMLHttpRequest = new XMLHttpRequest();
    
/** URL */
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
// @id => 마킹!
const CONTENTS_URL = 'https://api.hnpwa.com/v0/item/@id.json';

/** 탐색 & 선언 */
const container: HTMLElement | null = document.getElementById('root');
const store: Store = {
    currentPage: 1,
    feeds: [],
}

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
    ajax: XMLHttpRequest;
    url: string;
  
    constructor(url: string) {
      this.ajax = new XMLHttpRequest();
      this.url = url;
    }
  
    getRequest<AjaxResponse>(): AjaxResponse {
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

// 합성될 class를 typescript 컴파일러에 알려주기
// interface NewsFeedApi extends Api {};
// interface NewsDetailApi extends Api {};

// Mixin 실행
applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

/** View class */
// 공통 클래스
abstract class View {
    // 선언
    template: string;
    renderTemplate: string;
    container: HTMLElement;
    htmlList: string[];

    // 생성
    constructor(containerId: string, template: string) {
        const containerEl = document.getElementById(containerId);
 
        if (!containerEl) {
            throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다.';
        }

        // 초기화
        this.container = containerEl;
        this.template = template;
        this.htmlList = [];
        this.renderTemplate = template;
    }

    // TypeScript 문법 상 null container가 null 값이 아닐 경우 설정
    updateView(): void {
        this.container.innerHTML = this.renderTemplate;
        this.renderTemplate = this.template;
    } 

    // pushing HTML elements
    addHTML(htmlString: string): void {
        this.htmlList.push(htmlString);
    }

    // joining HTML elements
    getHTML(): string {
        const snapshot = this.htmlList.join('');
        this.clearHTMLList();
        return snapshot;
    }

    // replacing template data
    setTemplateData(key: string, value: string): void {
        this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
    }  

    // clearing HTML elements
    clearHTMLList(): void {
        this.htmlList = [];
    }

    // 추상 메서드 하위 클래스에게 강제 시키기 위해 마킹하는 것
    abstract render(): void; 
}
// router
class Router {
    routeTable: RouteInfo[];
    defaultRoute: RouteInfo | null;

    constructor() {
        /** ADD EVENT */
        // hashchange: a.href에 입력한 주소가 바뀔때마다 이벤트 실행
        window.addEventListener('hashchange', this.route.bind(this));
        
        this.defaultRoute = null;
        this.routeTable = [];
    }

    // 초기 페이지
    setDefaultPage(page: View): void {
        this.defaultRoute = {path: '', page};
    }

    // 페이지 path 입력 
    addRoutePath(path: string, page: View): void {
        this.routeTable.push({
            path,
            page,
        })
    }

    route() {
        const routePath = location.hash;

        if (routePath === '' && this.defaultRoute) {
            this.defaultRoute.page.render();
        }

        for(const routeInfo of this.routeTable) {
            if (routePath.indexOf(routeInfo.path) >= 0) {
                routeInfo.page.render();
                break;
              }
        }
    }
}

// 뉴스 피드 출력 클래스
class NewsFeedView extends View {
    // 선언
    api: NewsFeedApi;
    feeds: NewsFeed[];

    // 생성
    constructor(containerId: string) {
        // 템플릿
        let template: string = `
            <div class="bg-gray-600 min-h-screen">
                <div class="bg-white text-xl">
                    <div class="mx-auto px-4">
                        <div class="flex justify-between items-center py-6">
                            <div class="flex justify-start">
                                <h1 class="font-extrabold">Hacker News</h1>
                            </div>
                            <div class="items-center justify-end">
                                <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                                    Previous
                                </a>
                                <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                                    Next
                                </a>
                            </div>
                        </div> 
                    </div>
                </div>
                <div class="p-4 text-2xl text-gray-700">
                    {{__news_feed__}}        
                </div>
            </div>
        `;

        super(containerId, template);

        this.api = new NewsFeedApi(NEWS_URL);
        // 뉴스 목록 가져오기
        this.feeds = store.feeds;
    
        // 최소 실행
        if (this.feeds.length === 0) {
            this.feeds = store.feeds = this.api.getData();
            this.makeFeeds();
        }
    }

    render(): void {
        // 한 페이지 당 뉴스 목록
        const PAGE_ELS = 10;
        // 마지막 뉴스 목록 페이지 수
        const lastNewsFeed = this.feeds.length / PAGE_ELS;
        
        for (let i = (store.currentPage - 1) * PAGE_ELS; i < store.currentPage * PAGE_ELS; i++) {
            const { id, title, comments_count, user, points, time_ago, read } = this.feeds[i]
            this.addHTML(`
                <div class="p-6 ${read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
                    <div class="flex">
                        <div class="flex-auto">
                            <a href="#/show/${id}">${title}</a>  
                        </div>
                        <div class="text-center text-sm">
                            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
                        </div>
                    </div>
                    <div class="flex mt-3">
                        <div class="grid grid-cols-3 text-sm text-gray-500">
                            <div><i class="fas fa-user mr-1"></i>${user}</div>
                            <div><i class="fas fa-heart mr-1"></i>${points}</div>
                            <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
                        </div>  
                    </div>
                </div>
            `);
        }
    
        // 템플릿 내용 대체
        // 뉴스 콘텐츠
        this.setTemplateData('news_feed', this.getHTML());
        // 이전 페이지
        this.setTemplateData('prev_page', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
        // 다음 페이지
        this.setTemplateData('next_page', String(store.currentPage < lastNewsFeed ? store.currentPage + 1 : lastNewsFeed));
        // 출력
        this.updateView();
    }

    // read 데이터 추가
    makeFeeds(): void {
        for (let i = 0; i < this.feeds.length; i++) {
            this.feeds[i].read = false;
        }
    }
}

// 뉴스 콘텐츠 출력 클래스
class NewsDetailView extends View {
    constructor(containerId: string) {
        // 템플릿
        let template = `
            <div class="bg-gray-600 min-h-screen pb-8">
                <div class="bg-white text-xl">
                    <div class="mx-auto px-4">
                        <div class="flex justify-between items-center py-6">
                            <div class="flex justify-start">
                                <h1 class="font-extrabold">Hacker News</h1>
                            </div>
                            <div class="items-center justify-end">
                                <a href="#/page/{{__currentPage__}}" class="text-gray-500">
                                    <i class="fa fa-times"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="h-full border rounded-xl bg-white m-6 p-4 ">
                    <h2>{{__title__}}</h2>
                    <div class="text-gray-400 h-20">
                        {{__content__}}
                    </div>

                    {{__comments__}}

                </div>
            </div>
        `

        super(containerId, template);
    }

    render(): void {
        // 콘텐츠 아이디 추출 
        // '#/page/1234' or '#/show/1234'로 출력됨 => '#/page' 제거(substring)
        const id = location.hash.substring(7);
        // url의 마킹 '@id'를 replace() 메서드를 이용해 'id'로 변경
        const api = new NewsDetailApi(CONTENTS_URL.replace('@id', id));
        const newsDetail: NewsDetail = api.getData();
        // 읽음 표시 
        for (let i = 0; i < store.feeds.length; i++) {
            if (store.feeds[i].id === Number(id)) {
                store.feeds[i].read = true;
                break;
            }
        }    
        // 페이지 초기화 & 상세 콘텐츠 출력
        this.setTemplateData('comments', this.makeComment(newsDetail.comments));
        this.setTemplateData('currentPage', String(store.currentPage));
        this.setTemplateData('title', newsDetail.title);
        this.setTemplateData('content', newsDetail.content);
        this.updateView();
    }

    // 댓글 출력 함수
    makeComment(comments: NewsComment[]): string {
        for(let i = 0; i < comments.length; i++) {
            const comment: NewsComment = comments[i];

            this.addHTML(`
            <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
                <div class="text-gray-400">
                <i class="fa fa-sort-up mr-2"></i>
                <strong>${comment.user}</strong> ${comment.time_ago}
                </div>
                <p class="text-gray-700">${comment.content}</p>
            </div>      
            `);
            
            // 대댓글
            if (comment.comments.length > 0) {
            // 재귀호출
            this.addHTML(this.makeComment(comment.comments));
            }
        }
        return this.getHTML();
    }
}

/** 함수 */
// 라우터 함수
function routerFnc(): void {
    
}

/** 라우터 실행 */
const router: Router = new Router();
const newsFeedView = new NewsFeedView('root');
const newsDetailView = new NewsDetailView('root');

router.setDefaultPage(newsFeedView);
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsFeedView);

router.route();