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
    `
    // 뉴스 목록
    const newsList = [];
    for (let i = (store.currentPage - 1) * PAGE_ELS; i < store.currentPage * PAGE_ELS; i++) {
        newsList.push(`
            <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
                <div class="flex">
                    <div class="flex-auto">
                        <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
                    </div>
                    <div class="text-center text-sm">
                        <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
                    </div>
                </div>
                <div class="flex mt-3">
                    <div class="grid grid-cols-3 text-sm text-gray-500">
                        <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
                        <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
                        <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
                    </div>  
                </div>
            </div>
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
                            <a href="#/page/${store.currentPage}" class="text-gray-500">
                                <i class="fa fa-times"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="h-full border rounded-xl bg-white m-6 p-4 ">
                <h2>${newsContent.title}</h2>
                <div class="text-gray-400 h-20">
                    ${newsContent.content}
                </div>

                {{__comments__}}

            </div>
        </div>
    `

    function makeComment(comments, called = 0) {
        const commentString = [];
    
        for(let i = 0; i < comments.length; i++) {
          commentString.push(`
            <div style="padding-left: ${called * 40}px;" class="mt-4">
              <div class="text-gray-400">
                <i class="fa fa-sort-up mr-2"></i>
                <strong>${comments[i].user}</strong> ${comments[i].time_ago}
              </div>
              <p class="text-gray-700">${comments[i].content}</p>
            </div>      
          `);
            
          if (comments[i].comments.length > 0) {
            // 재귀호출
            commentString.push(makeComment(comments[i].comments, called + 1));
          }
        }
    
        return commentString.join('');
      }
    
    // 페이지 초기화 & 상세 콘텐츠 출력
    container.innerHTML = template.replace('{{__comments__}}', makeComment(newsContent.comments));
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