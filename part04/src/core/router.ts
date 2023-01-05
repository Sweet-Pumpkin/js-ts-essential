import { RouteInfo } from "../types";
import View from "./view";

// router
export default class Router {
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

        for (const routeInfo of this.routeTable) {
            if (routePath.indexOf(routeInfo.path) >= 0) {
                routeInfo.page.render();
                break;
            }
        }
    }
}