/** AJAX */
const ajax = new XMLHttpRequest();

/** URL */
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
// @id => 마킹!
const CONTENTS_URL = 'https://api.hnpwa.com/v0/item/@id.json';

/** 탐색 & 선언 */
const container = document.getElementById('root');
const store = {
    currentPage: 1,
}

/** 함수 */
// Hacker News API 가져오는 함수
function getDataFnc(URL) {
    // open(1, 2, 3); => 1: string, 2: url, 3: boolean(비동기 or 동기 처리 유무)
    ajax.open('GET', URL, false);
    ajax.send();

    return JSON.parse(ajax.response);
}
// 뉴스 피드 출력 함수
function newsFeedFnc() {
    // 뉴스 목록 가져오기
    const newsFeed = getDataFnc(NEWS_URL);
    // 한 페이지 당 뉴스 목록
    const PAGE_ELS = 10;
    // 마지막 뉴스 목록 페이지 수
    const lastNewsFeed = newsFeed.length / PAGE_ELS;
    // 템플릿
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
    // 뉴스 목록
    const newsList = [];
    for (let i = (store.currentPage - 1) * PAGE_ELS; i < store.currentPage * PAGE_ELS; i++) {
        newsList.push(`
            <li>
                <a href="#/show/${newsFeed[i].id}">
                    ${newsFeed[i].title} (${newsFeed[i].comments_count})
                </a>
            </li>
        `);
    }

    // 템플릿 내용 대체
    // 뉴스 콘텐츠
    template = template.replace('{{__news_feed__}}', newsList.join(''));
    // 이전 페이지
    template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1);
    // 다음 페이지
    template = template.replace('{{__next_page__}}', store.currentPage < lastNewsFeed ? store.currentPage + 1 : lastNewsFeed);
    // 출력
    container.innerHTML = template;
}
// 뉴스 콘텐츠 출력 함수
function newsDetailFnc() {
    // 콘텐츠 아이디 추출 
    // '#/page/1234' or '#/show/1234'로 출력됨 => '#/page' 제거(substring)
    const id = location.hash.substring(7);
    // url의 마킹 '@id'를 replace() 메서드를 이용해 'id'로 변경
    const newsContent = getDataFnc(CONTENTS_URL.replace('@id', id));

    // 페이지 초기화 & 상세 콘텐츠 출력
    container.innerHTML = `
        <h1>${newsContent.title}</h1>
        <div>
            <a href="#/page/${store.currentPage}">목록으로</a>
        </div>
    `;
}
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