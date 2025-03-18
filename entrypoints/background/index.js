import { ofetch } from "ofetch";
import { modelName, apiKey, baseURL } from "../../utils/config";
import * as prompts from "../../utils/prompts";

export default defineBackground(() => {
    // 处理来自 popup 和 content script 的消息
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
        async () => {};
    });
});

export const ask = async (content, historyDialogs = []) => {
    try {
        const response = await ofetch(`${baseURL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: modelName,
                messages: [
                    {
                        role: "system",
                        content: prompts.contents.systemInitPrompt,
                    },
                    ...historyDialogs,
                    { role: "user", content: content },
                ],
                temperature: 0.3,
                stream: false, // 由于消息传递的限制，暂时不支持流式响应
                // 返回JSON
                response_format: { type: "json_object" },
            }),
        });
        return response;
    } catch (error) {
        console.error("Stream request failed:", error);
        throw new Error(error.message || "Stream request failed");
    }
};
