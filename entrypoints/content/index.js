import { createApp, ref } from "vue";
import { useDebounceFn } from "@vueuse/core/index.cjs";

import Welcome from "@/components/Welcome.vue";
import * as woyaozuojihua from "./get-plan-data/woyaozuojihua";
import * as anydo from "./get-plan-data/anydo";
import { validPlatforms } from "../../utils/config";

// 判断当前URL是否在生效URL列表中
const isValidURL = (currURL) => {
    const matchedPlatform = validPlatforms.find((each) =>
        currURL.startsWith(each.URL)
    );
    return matchedPlatform ? matchedPlatform.name : null;
};

export default defineContentScript({
    matches: ["*://*/*"],
    /* main 函数会在以下时机触发：
        当匹配的网页完成加载后（页面 DOM 构建完成时）
        当用户导航到匹配的新页面时
        当页面从历史记录中恢复时（比如用户点击浏览器的后退按钮）*/
    async main(ctx) {
        const currPlatform = isValidURL(window.location.href);
        if (!currPlatform) return;

        const allMonthPlans = ref([]);

        if (currPlatform === "woyaozuojihua") {
            const updateData = useDebounceFn(() => {
                allMonthPlans.value = woyaozuojihua.getAllPlansThisMonth();
            }, 500);
            const observer = new MutationObserver(updateData);
            observer.observe(document.body, { childList: true, subtree: true });
        } else if (currPlatform === "anydo") {
            const tasks = await anydo.getAllTasks();
            allMonthPlans.value = tasks;
        }
        const ui = createIntegratedUi(ctx, {
            position: "inline",
            anchor: "body",
            onMount: async (container) => {
                const app = createApp(Welcome, {
                    allData: {
                        status: 200,
                        allMonthPlans: allMonthPlans, // ref 数据
                    },
                });
                app.mount(container);
                return app;
            },
            onRemove: (app) => {
                if (app) {
                    app.unmount();
                }
            },
        });
        ui.mount();
    },
});
