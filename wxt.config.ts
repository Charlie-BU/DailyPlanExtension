import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
    extensionApi: "chrome",
    modules: ["@wxt-dev/module-vue"],
    manifest: {
        name: "Daily Plan Extension",
        description: "A browser extension for daily planning",
        version: "1.0.0",
        permissions: [
            "storage", // 用于存储数据
            "activeTab", // 访问当前标签页
            "notifications", // 发送通知
        ],
        host_permissions: [
            "https://api.moonshot.cn/*", // 允许访问 Moonshot API
        ],
    },
});
