import { createApp, ref } from "vue";
import Welcome from "@/components/Welcome.vue";
import * as getData from "./get-plans";
import { useDebounceFn } from "@vueuse/core/index.cjs";

export default defineContentScript({
    // matches: ["https://todos.woyaozuojihua.com/pc/*"],
    matches: ["*://*/*"],
    /* main 函数会在以下时机触发：
        当匹配的网页完成加载后（页面 DOM 构建完成时）
        当用户导航到匹配的新页面时
        当页面从历史记录中恢复时（比如用户点击浏览器的后退按钮）*/
    main(ctx) {
        // 检查当前URL是否匹配目标页面
        // 开发版本请注释掉
        // if (
        //     window.location.href !== "https://todos.woyaozuojihua.com/pc/#/view"
        // )
        //     return;

        const allMonthPlans = ref([]);
        // 防抖
        const updateData = useDebounceFn(() => {
            allMonthPlans.value = getData.getAllPlansThisMonth();
        }, 500);
        const observer = new MutationObserver(updateData);
        observer.observe(document.body, { childList: true, subtree: true });

        // 组件挂载
        const ui = createIntegratedUi(ctx, {
            position: "inline",
            anchor: "body",
            onMount: (container) => {
                const app = createApp(Welcome, {
                    allData: {
                        status: 200,
                        allMonthPlans: allMonthPlans,
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
