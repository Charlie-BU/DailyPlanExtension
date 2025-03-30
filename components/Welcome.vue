<template>
    <div
        class="custom-panel"
        ref="panel"
        @mousedown="startDrag"
        :style="{
            left: position.x + 'px',
            top: position.y + 'px',
            backgroundImage: 'url(' + bgImg + ')',
        }">
        <div
            class="resize-handle top-left drag-handle"
            @mousedown="startDrag"></div>
        <div class="top-title">
            <div
                class="title"
                :style="{
                    backgroundImage: 'url(' + titleImg + ')',
                }"></div>
        </div>
        <Toast ref="toastRef" />

        <transition name="fade-slide">
            <div v-if="currFunc" class="func-title">
                <span>{{ currFunc }}</span>
            </div>
        </transition>

        <transition name="fade-slide">
            <div v-if="rawResponse" class="responses-container">
                <AIResponse
                    v-if="!isJsonResponse || rawResponse === 'waiting'"
                    :message="rawResponse" />
                <DetailSections v-else :responseToRender="responseToRender" />
            </div>
        </transition>

        <div>
            <PieChart v-if="chartData" :chartData="chartData" />
        </div>

        <div class="bottom-button">
            <button
                class="general-button"
                :style="{
                    backgroundImage: 'url(' + buttons[0] + ')',
                    marginLeft: '-16px',
                    marginRight: '3px',
                }"
                @click="() => summerizeMonthPlan()">
                <p class="btn-text" style="margin-top: -8px">当月计划分析</p>
            </button>
            <button
                class="general-button"
                :style="{
                    backgroundImage: 'url(' + buttons[1] + ')',
                    marginTop: '-3px',
                    marginRight: '-6px',
                }"
                @click="() => depictCharacter()">
                <p class="btn-text">个人形象刻画</p>
            </button>

            <button
                class="general-button"
                :style="{
                    backgroundImage: 'url(' + buttons[2] + ')',
                }"
                @click="() => optimizePlanToday()">
                <p class="btn-text" style="margin-top: -8px">当日计划优化</p>
            </button>
            <button
                class="general-button"
                :style="{
                    backgroundImage: 'url(' + buttons[3] + ')',
                    marginTop: '-3px',
                }"
                @click="() => proposePlanTomorrow()">
                <p class="btn-text">明日计划建议</p>
            </button>

            <button
                class="general-button"
                :style="{
                    backgroundImage: 'url(' + buttons[4] + ')',
                }"
                @click="() => predictMyBehavior()">
                <p class="btn-text">我的行为预测</p>
            </button>
            <button
                class="general-button"
                :style="{
                    backgroundImage: 'url(' + buttons[5] + ')',
                }"
                @click="() => seekOldPlans()">
                <p class="btn-text" style="margin-top: 2px">陈旧计划寻迹</p>
            </button>
        </div>
    </div>
</template>

<script setup>
import { watch, ref, onMounted, onBeforeUnmount } from "vue";
import { useDebounceFn } from "@vueuse/core";

import { ask } from "../entrypoints/background/index";
import * as prompts from "../utils/prompts";
import DetailSections from "./DetailSections.vue";
import AIResponse from "./AIResponse.vue";
import Toast from "./Toast.vue";
import PieChart from "./PieChart.vue";

// assets导入
import bgImg from "../assets/images/background.png";
import titleImg from "../assets/images/title.png";
// 批量导入全部按钮
const images = import.meta.glob("../assets/images/button/*.png", {
    eager: true,
});
const buttons = ref(Object.values(images).map((mod) => mod.default));

// 响应式数据，从content/index.js发来
const props = defineProps({
    allData: {
        type: Object,
        required: true,
    },
});

const allMonthPlans = props.allData.allMonthPlans; // 不能初始化为ref(null)，否则async/await风格不能触发watch，无法更新值

// 实时更新响应式数据
watch(
    () => props.allData,
    (newData) => {
        allMonthPlans.value = newData?.allMonthPlans?.value;
        // console.log(allMonthPlans.value);
    },
    { deep: true }
);

// 这个方案被废弃了：初始化等待时间过久，极大降低用户体验
// onMounted(() => {
//     setTimeout(async () => {
//         // 先把当月所有计划交给大模型
//         const prompt = prompts.constructInitPrompt(
//             "",
//             allMonthPlans.value,
//             isFirstCall
//         );
//         const response = await ask(prompt, [], "text");
//         isFirstCall = false;
//         console.log(response);
//     }, 2000);
// });

// console.log(allMonthPlans.value);

// 双向绑定Toast
const toastRef = ref(null);

const currFunc = ref("");

const rawResponse = ref("");
const isJsonResponse = ref(false);
const parsedResponse = ref(null);
const responseToRender = ref(null); // 封装parsedResponse，添加相应功能名
// 提供上下文支持
const historyDialogs = ref([]);

// 向饼图子组件传参
const chartData = ref(null);
// const testPieChart = () => {
//     chartData.value = [
//         { value: 1048, name: "搜索引擎" },
//         { value: 735, name: "直接访问" },
//         { value: 580, name: "电子邮件" },
//         { value: 484, name: "联盟广告" },
//         { value: 300, name: "视频广告" },
//     ];
// };

// 添加节流控制
// TODO：是否需要封装throttle放到utils.ts？
const lastCallTime = ref(0);
const MIN_INTERVAL = 2000;
const tooFrequent = () => {
    const now = Date.now();
    if (now - lastCallTime.value < MIN_INTERVAL) {
        rawResponse.value = "请稍等片刻再试...";
        return true;
    }
    lastCallTime.value = now;
    return false;
};

let isFirstCall = true; // 当前组件首次渲染 / 刷新后是否首次调用 API
const callAPI = async (
    func = "testAPI",
    thisPrompt = prompts.contents.test
) => {
    // 节流
    if (tooFrequent()) return;

    // 制造加载样式
    rawResponse.value = "waiting";
    try {
        const response = await ask(thisPrompt, historyDialogs.value);
        rawResponse.value = response.choices[0].message.content;
        isFirstCall = false;
        // 添加上下文
        const userMessage = { role: "user", content: thisPrompt };
        historyDialogs.value.push(userMessage);
        historyDialogs.value.push(response.choices[0].message);
        try {
            // 可json解析
            parsedResponse.value = JSON.parse(rawResponse.value);
            responseToRender.value = {
                func: func,
                res: parsedResponse.value,
            };
            isJsonResponse.value = true;
        } catch (e) {
            // 非json
            isJsonResponse.value = false;
        }
    } catch (error) {
        console.error("API调用出错:", error);
        rawResponse.value = "抱歉，请稍后再试。";
        isJsonResponse.value = false;
    }
};

// 有请求正在执行，需等待当前请求结束再发起下一次请求
const isWaiting = () => {
    return rawResponse.value === "waiting";
};

const summerizeMonthPlan = useDebounceFn(async () => {
    if (isWaiting()) {
        toastRef.value.showToast("当前AI正在分析中，请耐心等待～", "error");
        return;
    }
    currFunc.value = "当月计划分析";
    const prompt = prompts.constructInitPrompt(
        prompts.contents.summerizeMonthPlan,
        allMonthPlans.value,
        "",
        isFirstCall
    );
    await callAPI("summerizeMonthPlan", prompt);
}, 1000);

const depictCharacter = useDebounceFn(async () => {
    if (isWaiting()) {
        toastRef.value.showToast("当前AI正在分析中，请耐心等待～", "error");
        return;
    }
    currFunc.value = "个人形象刻画";
    const prompt = prompts.constructInitPrompt(
        prompts.contents.depictCharacter,
        allMonthPlans.value,
        "",
        isFirstCall
    );
    await callAPI("depictCharacter", prompt);
}, 1000);

const optimizePlanToday = useDebounceFn(async () => {
    if (isWaiting()) {
        toastRef.value.showToast("当前AI正在分析中，请耐心等待～", "error");
        return;
    }
    currFunc.value = "当日计划优化";

    const date = new Date();
    const planToday = allMonthPlans.value.filter(
        (each) => each.day === Number(date.getDate())
    )[0];
    const extraPlanData = `今日（${planToday.date}）计划如下：${planToday.plansUnfinished},${planToday.plansFinished}`;
    const prompt = prompts.constructInitPrompt(
        prompts.contents.optimizePlanToday,
        allMonthPlans.value,
        extraPlanData,
        isFirstCall
    );
    // console.log(prompt);
    await callAPI("optimizePlanToday", prompt);
}, 1000);

const proposePlanTomorrow = useDebounceFn(async () => {
    if (isWaiting()) {
        toastRef.value.showToast("当前AI正在分析中，请耐心等待～", "error");
        return;
    }
    currFunc.value = "明日计划建议";

    const date = new Date();
    const planToday = allMonthPlans.value.filter(
        (each) => each.day === Number(date.getDate())
    )[0];
    const extraPlanData = `这是我今日的计划：\n未完成：${planToday.plansUnfinished}\n已完成：${planToday.plansFinished}`;
    const prompt = prompts.constructInitPrompt(
        prompts.contents.proposePlanTomorrow,
        allMonthPlans.value,
        extraPlanData,
        isFirstCall
    );
    await callAPI("proposePlanTomorrow", prompt);
}, 1000);

const predictMyBehavior = useDebounceFn(async () => {
    if (isWaiting()) {
        toastRef.value.showToast("当前AI正在分析中，请耐心等待～", "error");
        return;
    }
    currFunc.value = "我的行为预测";
    const prompt = prompts.constructInitPrompt(
        prompts.contents.predictMyBehavior,
        allMonthPlans.value,
        "",
        isFirstCall
    );
    await callAPI("predictMyBehavior", prompt);
}, 1000);

const seekOldPlans = useDebounceFn(async () => {
    if (isWaiting()) {
        toastRef.value.showToast("当前AI正在分析中，请耐心等待～", "error");
        return;
    }
    currFunc.value = "陈旧计划寻迹";
    const prompt = prompts.constructInitPrompt(
        prompts.contents.seekOldPlans,
        allMonthPlans.value,
        "",
        isFirstCall
    );
    await callAPI("seekOldPlans", prompt);
}, 1000);

// 拖拽 / 尺寸改变相关逻辑
const position = ref({ x: 100, y: 100 });
const panelSize = ref({ width: 400, height: 300 });
const isDragging = ref(false);
const isResizing = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const resizeDirection = ref(null);
const panel = ref(null);

const startDrag = (e) => {
    if (!e.target.closest(".drag-handle")) return;
    isDragging.value = true;
    dragOffset.value = {
        x: e.clientX - position.value.x,
        y: e.clientY - position.value.y,
    };
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
};

const onDrag = (e) => {
    if (!isDragging.value) return;
    position.value = {
        x: e.clientX - dragOffset.value.x,
        y: e.clientY - dragOffset.value.y,
    };
};

const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
};

onBeforeUnmount(() => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
});
</script>

<style lang="scss" scoped>
.custom-panel {
    position: absolute; /* 背景图居中 */
    background: linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 100%) no-repeat
        center;

    background-size: cover; //背景图会缩放以覆盖整个容器，可能会裁剪部分图像
    background-position: center;
    background-repeat: no-repeat; /* 或 repeat */
    // 初始宽高
    width: 390px;
    height: 580px;
    // 最小宽高
    min-width: 235px;
    min-height: 114px;
    // 最大宽高
    max-width: 1200px;
    max-height: 800px;
    padding: 0 20px;
    box-sizing: border-box;

    z-index: 999;
    user-select: none;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow-x: hidden;
    resize: both;
    // 隐藏滚动条
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE & Edge */

    // 子组件排列
    // display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    }
}

.custom-panel::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
}

.resize-handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background: transparent;
    cursor: pointer;
}

.resize-handle:hover {
    background: rgba(0, 0, 0, 0.2);
}

.drag-handle {
    cursor: move !important;
    background: rgba(0, 0, 0, 0.2);
    width: 30px;
    height: 30px;
}

.top-left {
    top: -5px;
    left: -5px;
    cursor: move;
}

.title {
    width: 100%;
    max-width: 800px;
    height: 178px;
    text-align: center; /* 如果需要让文本也居中 */
    background: no-repeat center;

    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 20px;
    padding: 10px;
    border-radius: 15px;
    background-repeat: no-repeat;
    gap: 8px;

    .title-icon {
        font-size: 24px;
        animation: bounce 2s infinite;
    }
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}
.fade-slide-enter-to {
    opacity: 1;
    transform: translateY(0);
}
.fade-slide-enter-active {
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

/* 离开动画 */
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
.fade-slide-leave-active {
    transition: opacity 0.4s ease-in, transform 0.4s ease-in;
}

.func-title {
    background: no-repeat center;
    width: 100%;
    align-items: center;
    padding: 12px 24px;
    border-radius: 12px;
    background: transparent;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    text-align: center;
}

.func-title span {
    font-size: 17px;
    font-weight: bold;
    letter-spacing: 0.5px;
    background: linear-gradient(90deg, #8989e8, #cf7dff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.general-button {
    width: 165px;
    height: 88px;
    background: no-repeat center;
    margin-bottom: 12px;
    text-align: center;
    border-radius: 15px;
    border: none;
    color: #2c3e50;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;

    &:active {
        transform: translateY(0);
    }

    .button-icon {
        font-style: normal;
    }

    .btn-text {
        margin-left: 55px;
        font-size: 16px;
        font-weight: bold;
        background: linear-gradient(90deg, #8989e8, #cf7dff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        // color: #1e3a5f;
        // text-shadow: 1px 1px 3px rgba(99, 83, 83, 0.7);
        transition: color 0.3s ease-in-out;
    }
}

.top-title {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    flex-direction: row;
    justify-content: center;
}

.bottom-button {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
    flex-direction: row;
    justify-content: center;
}

.responses-container {
    margin: 20px 0;
    max-height: 300px;
    width: 100%;
    overflow-y: auto;
    padding: 15px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    backdrop-filter: blur(5px);
    animation: slideIn 0.3s ease-out;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;

        &:hover {
            background: rgba(255, 255, 255, 0.4);
        }
    }
}

@keyframes bounce {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// 添加响应式设计
@media (max-width: 480px) {
    .custom-panel {
        width: 90%;
        max-width: none;
    }

    .general-button {
        width: 100%;
        margin-right: 0;
    }
}
</style>
