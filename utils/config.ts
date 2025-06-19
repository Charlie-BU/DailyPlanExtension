// 换模型只需要改这里
let selectModelId: number = 0;

type Model = {
    id: number;
    name: string;
    baseURL: string;
    apiKey: string;
};

const modelList: Model[] = [
    // DeekSeek V3
    {
        id: 0,
        name: "deepseek-chat",
        baseURL: "https://api.deepseek.com",
        apiKey: "sk-917f533af78f4b35a8a7512740a36e46",
    },
    // DeepSeek R1
    {
        id: 1,
        name: "deepseek-reasoner",
        baseURL: "https://api.deepseek.com",
        apiKey: "sk-917f533af78f4b35a8a7512740a36e46",
    },
    // Kimi
    {
        id: 2,
        name: "moonshot-v1-8k",
        baseURL: "https://api.moonshot.cn/v1",
        apiKey: "sk-7CQBQ5uCT767S4mVLoxtgMdVJFM2hNoyCYDRIeOVfrOq8vOo",
    },
    // 讯飞星火
    {
        id: 3,
        name: "generalv3.5",
        baseURL: "https://spark-api-open.xf-yun.com/v1",
        apiKey: "ZLMgkyWVGakPAxbhMpLN:zMuoYriXIAKLcYnzDGvq",
    },
    // Llama
    {
        id: 4,
        name: "Atom-7B-Chat",
        baseURL: "https://api.atomecho.cn/v1",
        apiKey: "sk-4c80521296058cd8161b2fb50b4a2b4e",
    },
    // 千问plus
    {
        id: 5,
        name: "qwen-plus",
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        apiKey: "sk-737dabf3742d4bec8f7e0500eb5cb5a3",
    },
];

const selectedModel: Model =
    modelList.find((model) => model.id === selectModelId) ?? modelList[0];

export const modelName: string = selectedModel.name;
export const baseURL: string = selectedModel.baseURL;
export const apiKey: string = selectedModel.apiKey;

// 平台配置
type Platform = {
    name: string;
    URL: string;
    URLForMatch?: string;
    description: string;
    icon: string;
};

import woyaozuojihuaIcon from "@/assets/favicons/woyaozuojihua.png";
import anydoIcon from "@/assets/favicons/anydo.png";
import mondayIcon from "@/assets/favicons/monday.png";
export const allPlatforms: Platform[] = [
    {
        name: "我要做计划",
        URL: "https://todos.woyaozuojihua.com/pc/#/view",
        description: "简洁高效的中文计划管理工具",
        icon: woyaozuojihuaIcon,
    },
    {
        name: "Any.do",
        URL: "https://app.any.do/calendar",
        description: "国际化的任务与日历管理工具",
        icon: anydoIcon,
    },
    {
        name: "Monday",
        URL: "https://monday.com",
        URLForMatch: "monday.com/boards/",
        description: "专业的项目与团队协作平台",
        icon: mondayIcon,
    },
];
