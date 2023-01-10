import View from "../core/view";
import { NewsDetailApi } from "../core/api";
import { NewsComment, NewsStore } from "../types";
import { CONTENTS_URL } from "../config";

// 템플릿
const template = `
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

// 뉴스 콘텐츠 출력 클래스
export default class NewsDetailView extends View {
    private store: NewsStore;

    constructor(containerId: string, store: NewsStore) {        
        super(containerId, template);
        this.store = store;
    }

    render = (id: string): void => {
        // url의 마킹 '@id'를 replace() 메서드를 이용해 'id'로 변경
        const api = new NewsDetailApi(CONTENTS_URL.replace('@id', id));
        const { title, content, comments } = api.getData();
    
        this.store.makeRead(Number(id));
        // 페이지 초기화 & 상세 콘텐츠 출력
        this.setTemplateData('currentPage', this.store.currentPage.toString());
        this.setTemplateData('title', title);
        this.setTemplateData('content', content);
        this.setTemplateData('comments', this.makeComment(comments));
    
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