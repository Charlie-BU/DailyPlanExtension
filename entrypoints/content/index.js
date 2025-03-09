import { createApp, ref } from "vue";
import Test from "@/components/Test.vue";
import * as getData from "./get-plans";
import { useDebounceFn } from "@vueuse/core/index.cjs";

export default defineContentScript({
    matches: ["*://*/*"],
    /* main 函数会在以下时机触发：
        当匹配的网页完成加载后（页面 DOM 构建完成时）
        当用户导航到匹配的新页面时
        当页面从历史记录中恢复时（比如用户点击浏览器的后退按钮）*/
    main(ctx) {
        const data = ref([]);
        // 防抖
        const updateData = useDebounceFn(() => {
            data.value = getData.getAllPlansThisMonth();
        }, 500);

        const observer = new MutationObserver(updateData);
        observer.observe(document.body, { childList: true, subtree: true });

        // console.log(data.value);
        // 组件挂载
        const ui = createIntegratedUi(ctx, {
            position: "inline",
            anchor: "body",
            onMount: (container) => {
                const app = createApp(Test, { testData: data }); // 传入数组值而不是ref对象
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
