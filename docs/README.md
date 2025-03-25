# DailyPlanExtension

## 环境配置

1. `npm install`安装依赖
2. `npm run dev`运行

-   技术栈：WXT + Vue 3 + TypeScript
-   建议开发 IDE：VSCode / Cursor

<br />

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

<br />

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
    <br />

## 文档更新时间

-   2025.03.21：陈奕名
-   2025.03.19 15:50：卜天
