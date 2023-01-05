/** View class */
// 공통 클래스
export default abstract class View {
    // 선언
    private template: string;
    private renderTemplate: string;
    private container: HTMLElement;
    private htmlList: string[];

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
    protected updateView(): void {
        this.container.innerHTML = this.renderTemplate;
        this.renderTemplate = this.template;
    } 

    // pushing HTML elements
    protected addHTML(htmlString: string): void {
        this.htmlList.push(htmlString);
    }

    // joining HTML elements
    protected getHTML(): string {
        const snapshot = this.htmlList.join('');
        this.clearHTMLList();
        return snapshot;
    }

    // replacing template data
    protected setTemplateData(key: string, value: string): void {
        this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
    }  

    // clearing HTML elements
    private clearHTMLList(): void {
        this.htmlList = [];
    }

    // 추상 메서드 하위 클래스에게 강제 시키기 위해 마킹하는 것
    abstract render(): void; 
}