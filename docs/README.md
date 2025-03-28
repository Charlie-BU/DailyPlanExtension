# DailyPlanExtension

## 环境配置

1. `npm install`安装依赖
2. `npm run dev`运行

-   技术栈：WXT + Vue 3 + TypeScript
-   建议开发 IDE：VSCode / Cursor

## Components 组件

### 1. [Welcome.vue](./components/Welcome.vue)

入口组件，包含各功能入口。

### 2. [AIResponse.vue](./components/AIResponse.vue)

AI 文本型响应的显示组件。每条响应文本分别被渲染为气泡框。

### 3. [DetailSections.vue](./components/DetailSections.vue)

AI json 型响应的通用显示组件。每个对象被渲染为以键名为标题，值为正文的气泡框。
TODO：基于各个功能分别设计各自组件，以本组件为或模版继承。

### 4. [Toast.vue](./components/Toast.vue)

自定义提示 Toast。通过在副组件调用内部函数 showToast 实现。有`default`、`success`、`error`三种样式。
具体实现方式：

```vue
<template>
    <Toast ref="toastRef" />
</template>

<script setup>
import { ref } from "vue";
const toastRef = ref(null);
toastRef.value.showToast("请耐心等待～", "error");
</script>
```

### 4. [PieChart.vue](./components/PieChart.vue)

图形组件（饼图）封装在 PieChart.vue 中，通过父组件向子组件传参，使用方法如下：

```vue
<template>
    <PieChart :chartData="chartData" />
</template>

<script setup>
import PieChart from "./PieChart.vue";
const chartData = ref([
    { value: 1048, name: "搜索引擎" },
    { value: 735, name: "直接访问" },
    { value: 580, name: "电子邮件" },
    { value: 484, name: "联盟广告" },
    { value: 300, name: "视频广告" },
]);
</script>
```

[echarts 官网](https://echarts.apache.org/examples/zh/index.html#chart-type)

## Utils 工具

### 1. 模型配置与模型切换 [config.ts](./utils/config.ts)

-   封装导出各模型模型名、baseURL、apiKey，便于 API 调用。
-   更换当前模型只需修改`selectModelId`为对应模型 id

### 2. 提示词内容与相关函数 [prompts.ts](./utils/prompts.ts)

-   构建提示词：将各功能 prompt 与当月全部计划拼接（若为当前组件首次渲染 / 刷新后首次调用 API，否则不再重复拼接计划内容）

    ```ts
    constructInitPrompt(
        extraWords: string,
        allMonthPlans: MonthPlan[],
        isFirstCall: boolean = true
    )
    ```

-   提示词对象 contents：产品中全部功能所需 prompt。键名为功能，值为 prompt。

    ```ts
    contents: Record<string, string> = {
        systemInitPrompt: `你是由计划分析专家、数据科学家和心理学家组成的智能体，负责对用户计划数据进行多维度分析。`,
        test: `你是什么模型？请以json格式回答。`,
    };
    ```

-   现行提示词风格（示例）：
    ```
    今天是2025年3月19日，请综合之前和之后的计划内容对我今天（2025年3月19日）的计划进行分析（请分析今日所有计划，无需关注已完成或未完成）。
    json条目包括：
    1. planQuality：今日计划是否稍显杂乱无章？如果是，请给予建议（并非优先级，而是计划内容是否合理或欠妥，如何修改）并加以人性化鼓励；如果不是，请加以赞扬；
    2. priorityOrder：请给出今日所有计划（已完成和未完成都有）最合理的优先级排序方式，并指出建议用时以及建议在一天中完成的时间段，返回一个数组，，数组元素为对象，包含计划内容、优先级、建议完成时段、建议用时，按计划优先级从高到低排序；
    3. classification：分为工作型和休闲型。给出平衡建议：若工作型远多于休闲型，则提醒适时休息，安排休息时间并建议休息内容；若休闲型远多于工作型，则给出相应建议，提醒不要懈怠等；
    4. adherence：分析过去坚持的某些计划今日仍有坚持。若有，请给予赞扬；若没有，请适当提醒并给出建议；
    请以各条目为键名，生成相应内容纯文本为值，返回json格式方便我解析。
    ```
    有优化空间

### 3. 工具函数 [utils.ts](./utils/utils.ts)

-   获取 json 条目渲染标题与图标
    ```ts
    getNameAndIcon(key: string): NameAndIcon | {}
    ```

## 数据爬取与抓包方式

各平台数据爬取逻辑均封装在 entrypoints/content/get-plan-data 目录，以各平台名为文件名。

数据对象封装格式：

```js
allMonthPlans: {
    date: "2025年3月25日",
    day: 25,
    lunar: "廿六",      // 可选
    plansFinished: [
        "我要做计划浏览器插件软著材料准备",
        "静安hang out",
        "用户交互技术ppt+视频",
        "我要做计划浏览器插件开发",
        "看《难哄》/《阴阳侦探》"
    ],
    plansUnfinished: [
        "旅行全能王小程序开发",
        "TOEFL听力",
        "跑步1.2km",
        "7:00-7:10起床",
        "TOEFL口语"
    ],
}
```

### 【我要做计划】

基准页：https://todos.woyaozuojihua.com/pc/#/view

> 由于我要做计划网站对计划增删改查的相关请求报文负载被加密，并且源码进行了 js 混淆，难以通过 js 逆向获取原始报文模拟请求，故直接通过页面 DOM 元素爬取计划内容、封装对象。

#### 1. 数据爬取、清洗与封装

-   月份 DOM 元素选择器：`querySelector(".current-date")`
-   计划表格 td 元素选择器：`querySelectorAll("#app .el-calendar__body table tbody td.current")`
-   td 中日期元素选择器：`querySelector("div > div > div.date-title > div.day > div.checked")`
-   td 中农历元素选择器：`querySelector("div > div > div.date-title > div.lunar")`
-   td 中计划元素选择器：`querySelectorAll("div > div > div.date-lists > div.list")`
-   遍历 td 元素，拿到日期字符串、农历信息字符串、已完成计划数组、未完成计划数组（通过样式类`.complete`区分），封装为对象

### 【Any.do】

基准页：https://app.any.do/calendar

> 已通过抓包发现该页面对于计划的增删改查相关接口的报文字段获取、封装及处理方式，拟通过 ofetch 模拟请求获取相关数据，并基于 AI 建议自动化增删计划。

#### 1. http 请求分析

大多数获取数据（计划、用户信息等）的请求都为 GET 请求，但认证方式有所不同：

-   部分较为简单的请求直接在 Header 中添加私密键值对`x-anydo-auth: [your-auth]`即可完成认证
-   安全性要求较高的请求需提前通过`fetch`接口获取`accessToken`，在 Header 添加 Bearer Token 认证

#### 2. 接口

##### 获取用户 id、name 及 accessToken

-   接口 URL：https://sm-prod4.any.do/me/calendar_providers/fetch
-   请求方式：GET
-   认证：Header 中添加私密键值对`x-anydo-auth: [your-auth]`
-   `x-anydo-auth`位置：`localStorage.auth`
-   响应示例：
    ```json
    [
        {
            "id": "9212xxxxxxxxxx",
            "provider": "google",
            "name": "xxxxxxx",
            "accessToken": "ya29.a0AeXxxxxxxxxxx",
            "config": null,
            "externalId": "112016xxxxxxxxx"
        }
    ]
    ```

##### 获取 events（暂时无用）

-   接口 URL：https://www.googleapis.com/calendar/v3/calendars/${name}/events
-   请求方式：GET
-   认证：Header 中添加 Bearer Token
-   Bearer Token 获取方式：上面`accessToken`
-   响应示例：
    ```json
    {
        "kind": "calendar#events",
        "etag": "\"p33fv5bkaxxxxxo0o\"",
        "summary": "1594751xxxxxxxxx",
        "description": "",
        "updated": "2025-03-25T08:15:02.699Z",
        "timeZone": "UTC",
        "accessRole": "owner",
        "defaultReminders": [
            {
                "method": "popup",
                "minutes": 30
            }
        ],
        "nextSyncToken": "CN_yrorlpIxxxxxxxxAIo24mI4AI=",
        "items": [
            {
                "kind": "calendar#event",
                "etag": "\"348xxxxxxx230\"",
                "id": "8qdf5qe4abxxxxx75s",
                "status": "confirmed",
                "htmlLink": "https://www.google.com/calendar/event?eid=OHFkZjVxZTRhYms4dW51Z3ZsY29tazI3NXMgMTU5NDc1MxxxxxxxxxQG0",
                "created": "2025-03-25T02:46:25.000Z",
                "updated": "2025-03-25T02:46:25.343Z",
                "summary": "TOEFL复习",
                "creator": {
                    "email": "159xxxxxxxxxx",
                    "self": true
                },
                "organizer": {
                    "email": "159xxxxxxxxxx",
                    "self": true
                },
                "start": {
                    "date": "2025-03-27"
                },
                "end": {
                    "date": "2025-03-28"
                },
                "iCalUID": "8qdf5qe4abkxxxxxxxm",
                "sequence": 0,
                "reminders": {
                    "useDefault": false,
                    "overrides": [
                        {
                            "method": "popup",
                            "minutes": 30
                        }
                    ]
                },
                "eventType": "default"
            }
        ]
    }
    ```

##### 获取 task_id

-   接口 URL：https://sm-prod4.any.do/api/v14/me/bg_sync
-   请求方式：GET
-   认证：Header 中添加私密键值对`x-anydo-auth: [your-auth]`
-   `x-anydo-auth`位置：`localStorage.auth`
-   响应示例：

    ```json
    {
        "task_id": "4be4dxxxxx8-972-7c719xxxxxxx",
        "total_timeout": 60,
        "polling_interval": 1
    }
    ```

##### 获取 tasks

-   接口 URL：https://sm-prod4.any.do/me/bg_sync_result/${task_id}
-   请求方式：GET
-   认证：Header 中添加私密键值对`x-anydo-auth: [your-auth]`
-   `x-anydo-auth`位置：`localStorage.auth`
-   响应示例：

    ```json
    {
        "models": {
            "attachment": {
                "statusCode": 0,
                "items": []
            },
            "groceryCard": {
                "statusCode": 0,
                "items": []
            },
            "cardChecklist": {
                "statusCode": 0,
                "items": []
            },
            "user": {
                "statusCode": 0,
                "items": [
                    // 字段无关且过于复杂，这里不显示
                ]
            },
            "cardAttachment": {
                "statusCode": 0,
                "items": []
            },
            "task": {
                "statusCode": 0,
                "items": [
                    {
                        "id": "r0mxxxxxxE50XsSt3",
                        "note": "",
                        "alert": {
                            "type": "OFFSET",
                            "offset": 0,
                            "customTime": 0,
                            "repeatDays": null,
                            "repeatEndsOn": null,
                            "repeatEndType": "REPEAT_END_NEVER",
                            "repeatInterval": null,
                            "repeatStartsOn": null,
                            "repeatMonthType": null,
                            "repeatNextOccurrence": null,
                            "repeatEndsAfterOccurrences": null
                        },
                        "title": "玩游戏",
                        "labels": null,
                        "shared": false,
                        "status": "UNCHECKED",
                        "dueDate": 1743123600000,
                        "latitude": null,
                        "position": "7ffc",
                        "priority": "Normal",
                        "subTasks": [],
                        "longitude": null,
                        "assignedTo": "1594751xxxxxxxxl.com",
                        "categoryId": "U5IMcJAL5z9rWsOvQsh8v4mX",
                        "creationDate": 1742889618000,
                        "globalTaskId": "r0mUWDgUhbQm98zPE50XsSt3",
                        "participants": [],
                        "lastUpdateDate": 1742890329334,
                        "noteUpdateTime": 1742889617633,
                        "alertUpdateTime": 1742889617635,
                        "repeatingMethod": "TASK_REPEAT_OFF",
                        "titleUpdateTime": 1742889617633,
                        "labelsUpdateTime": null,
                        "statusUpdateTime": 1742890329334,
                        "dueDateUpdateTime": 1742889617633,
                        "chatConversationId": null,
                        "parentGlobalTaskId": null,
                        "positionUpdateTime": 1742890329334,
                        "priorityUpdateTime": 1742889617634,
                        "globalSharedGroupId": null,
                        "assignedToUpdateTime": 1742889625353,
                        "categoryIdUpdateTime": 1742889617632,
                        "chatConversationIdUpdateTime": null
                    },
                    {
                        "id": "DLROTAxxxxHocXwC",
                        "note": "",
                        "alert": null,
                        "title": "吃饭",
                        "labels": null,
                        "shared": false,
                        "status": "UNCHECKED",
                        "dueDate": 0,
                        "latitude": null,
                        "position": "7ff8",
                        "priority": "Normal",
                        "subTasks": [],
                        "longitude": null,
                        "assignedTo": "1594751xxxxxxxxl.com",
                        "categoryId": "U5IMcJAL5z9rWsOvQsh8v4mX",
                        "creationDate": 1742890380000,
                        "globalTaskId": "DLROTAJwvZpBS90Y7eHocXwC",
                        "participants": [],
                        "lastUpdateDate": 1742890380093,
                        "noteUpdateTime": 1742890380093,
                        "alertUpdateTime": null,
                        "repeatingMethod": "TASK_REPEAT_OFF",
                        "titleUpdateTime": 1742890380093,
                        "labelsUpdateTime": null,
                        "statusUpdateTime": 1742890380093,
                        "dueDateUpdateTime": 1742890380093,
                        "chatConversationId": null,
                        "parentGlobalTaskId": null,
                        "positionUpdateTime": 1742890380093,
                        "priorityUpdateTime": 1742890380093,
                        "globalSharedGroupId": null,
                        "assignedToUpdateTime": null,
                        "categoryIdUpdateTime": 1742890380091,
                        "chatConversationIdUpdateTime": null
                    }
                ]
            },
            "userCustomView": {
                "statusCode": 0,
                "items": []
            },
            "card": {
                "statusCode": 0,
                "items": []
            },
            "groceryBoard": {
                "statusCode": 0,
                "items": []
            },
            "customFieldValue": {
                "statusCode": 0,
                "items": []
            },
            "grocerySection": {
                "statusCode": 0,
                "items": []
            },
            "sharedMember": {
                "statusCode": 0,
                "items": []
            },
            "category": {
                // 字段无关且过于复杂，这里不显示
            },
            "customField": {
                "statusCode": 0,
                "items": []
            },
            "section": {
                "statusCode": 0,
                "items": []
            },
            "space": {
                "statusCode": 0,
                "items": []
            },
            "tag": {
                "statusCode": 0,
                "items": []
            },
            "board": {
                "statusCode": 0,
                "items": []
            },
            "myDayEntry": {
                "statusCode": 0,
                "items": []
            },
            "checklistItem": {
                "statusCode": 0,
                "items": []
            },
            "label": {
                "statusCode": 0,
                "items": [
                    {
                        "id": "vREueQYxxxxx==",
                        "name": "Priority",
                        "color": "#f9d21f",
                        "isDeleted": false,
                        "isPredefined": true,
                        "lastUpdateDate": 1742870691475
                    }
                ]
            }
        },
        "lastUpdateDate": 1742891365288,
        "userInfo": {
            "id": "9mLPmwxxxxxlu_Q==",
            "name": "Charlie. BU",
            "currentUserSpaces": []
        }
    }
    ```

## 文档更新时间

-   2025.03.25：卜天
-   2025.03.21：陈奕名
-   2025.03.19：卜天
