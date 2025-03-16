import { ofetch } from "ofetch";
import { apiKey, baseURL } from "../../utils/config";

export default defineBackground(() => {
    // 处理来自 popup 和 content script 的消息
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
        async () => {};
    });
});

export const ask = async (content) => {
    try {
        const response = await ofetch(`${baseURL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                // model: "moonshot-v1-8k",     // Kimi
                // model: "deepseek-chat",      // DeepSeek V3
                model: "deepseek-reasoner", // DeepSeek R1
                messages: [
                    {
                        role: "system",
                        content:
                            "你是一位分析用户日常计划的强大AI，请直接回答用户问题，不要多说其他内容。",
                    },
                    { role: "user", content: content },
                ],
                temperature: 0.3,
                stream: false, // 由于消息传递的限制，暂时不支持流式响应
            }),
        });
        return response;
    } catch (error) {
        console.error("Stream request failed:", error);
        throw new Error(error.message || "Stream request failed");
    }
};
