// 换模型只需要改这里
let selectModelId = 0;

const modelList = [
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
];

export const modelName = modelList[selectModelId].name;
export const baseURL = modelList[selectModelId].baseURL;
export const apiKey = modelList[selectModelId].apiKey;
