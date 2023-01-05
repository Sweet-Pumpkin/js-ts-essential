import View from "../core/view";
import { NewsFeedApi } from "../core/api";
import { NewsFeed } from "../types";
import { NEWS_URL } from "../config";

// 템플릿
const template: string = `
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

// 뉴스 피드 출력 클래스
export default class NewsFeedView extends View {
    // 선언
    private api: NewsFeedApi;
    private feeds: NewsFeed[];

    // 생성
    constructor(containerId: string) {
        super(containerId, template);
        this.api = new NewsFeedApi(NEWS_URL);
        // 뉴스 목록 가져오기
        this.feeds = window.store.feeds;
    
        // 최소 실행
        if (this.feeds.length === 0) {
            this.feeds = window.store.feeds = this.api.getData();
            this.makeFeeds();
        }
    }

    render(): void {
        // 한 페이지 당 뉴스 목록
        const PAGE_ELS = 10;
        // 마지막 뉴스 목록 페이지 수
        const lastNewsFeed = this.feeds.length / PAGE_ELS;
        window.store.currentPage = Number(location.hash.substring(7) || 1);
        for (let i = (window.store.currentPage - 1) * PAGE_ELS; i < window.store.currentPage * PAGE_ELS; i++) {
            const { id, title, comments_count, user, points, time_ago, read } = this.feeds[i]
            this.addHTML(`
                <div class="p-6 ${read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
                    <div class="xflex">
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
        this.setTemplateData('prev_page', String(window.store.currentPage > 1 ? window.store.currentPage - 1 : 1));
        // 다음 페이지
        this.setTemplateData('next_page', String(window.store.currentPage < lastNewsFeed ? window.store.currentPage + 1 : lastNewsFeed));
        // 출력
        this.updateView();
    }

    // read 데이터 추가
    private makeFeeds(): void {
        for (let i = 0; i < this.feeds.length; i++) {
            this.feeds[i].read = false;
        }
    }
}