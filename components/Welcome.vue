<template>
    <div
        class="custom-panel"
        ref="panel"
        @mousedown="startDrag"
        :style="{
            left: position.x + 'px',
            top: position.y + 'px',
            width: panelSize.width + 'px',
            height: panelSize.height + 'px',
        }">
        <div
            class="resize-handle top-left drag-handle"
            @mousedown="startDrag"></div>
        <div
            class="resize-handle top-right"
            @mousedown="startResize($event, 'top-right')"></div>
        <div
            class="resize-handle bottom-left"
            @mousedown="startResize($event, 'bottom-left')"></div>
        <div
            class="resize-handle bottom-right"
            @mousedown="startResize($event, 'bottom-right')"></div>

        <div
            class="resize-handle left"
            @mousedown="startResize($event, 'left')"></div>
        <div
            class="resize-handle right"
            @mousedown="startResize($event, 'right')"></div>
        <div
            class="resize-handle top"
            @mousedown="startResize($event, 'top')"></div>
        <div
            class="resize-handle bottom"
            @mousedown="startResize($event, 'bottom')"></div>

        <div class="title">
            <span class="title-icon">🌟</span>
            我要做计划AI插件
            <span class="title-icon">✨</span>
        </div>
        <Toast ref="toastRef" />

        <div v-if="rawResponse" class="responses-container">
            <AIResponse
                v-if="!isJsonResponse || rawResponse === 'waiting'"
                :message="rawResponse" />
            <DetailSections v-else :responseToRender="responseToRender" />
        </div>

        <div class="bottom-button">
            <button
                class="general-button analyze"
                @click="() => summerizeMonthPlan()">
                <i class="button-icon">📅</i>
                当月计划分析
            </button>
            <button
                class="general-button character"
                @click="() => depictCharacter()">
                <i class="button-icon">👤</i>
                个人形象刻画
            </button>
            <button
                class="general-button optimize"
                @click="() => optimizePlanToday()">
                <i class="button-icon">✨</i>
                当日计划优化
            </button>
            <button
                class="general-button optimize"
                @click="() => proposePlanTomorrow()">
                <i class="button-icon">🌈</i>
                明日计划建议
            </button>
            <button
                class="general-button optimize"
                @click="() => predictMyBehavior()">
                <i class="button-icon">🔮</i>
                我的行为预测
            </button>
            <button
                class="general-button optimize"
                @click="() => seekOldPlans()">
                <i class="button-icon">🕸️</i>
                陈旧计划寻迹
            </button>

            <!-- <button class="general-button test-api" @click="() => callAPI()">
                <i class="button-icon">🔍</i>
                测试API
            </button> -->
        </div>
    </div>
</template>

<script setup>
import { watch, ref, onBeforeUnmount } from "vue";
import { useDebounceFn } from "@vueuse/core";

import { ask } from "../entrypoints/background/index";
import * as prompts from "../utils/prompts";
import DetailSections from "./DetailSections.vue";
import AIResponse from "./AIResponse.vue";
import Toast from "./Toast.vue";

// 响应式数据，从content/index.js发来
const props = defineProps({
    allData: {
        type: Object,
        required: true,
    },
});
const allMonthPlans = ref(null);

// 实时更新响应式数据
watch(
    () => props.allData,
    (newData) => {
        allMonthPlans.value = newData?.allMonthPlans?.value;
        // console.log(allMonthPlans.value);
    },
    { deep: true }
);

// 双向绑定Toast
const toastRef = ref(null);

const rawResponse = ref("");
const isJsonResponse = ref(false);
const parsedResponse = ref(null);
const responseToRender = ref(null); // 封装parsedResponse，添加相应功能名
// 提供上下文支持
const historyDialogs = ref([]);

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
        // 添加上下文
        const userMessage = { role: "user", content: thisPrompt };
        historyDialogs.value.push(userMessage);
        historyDialogs.value.push(response.choices[0].message);
        isFirstCall = false;
        try {
            // 可json解析
            parsedResponse.value = JSON.parse(rawResponse.value);
            responseToRender.value = {
                func: func,
                res: parsedResponse.value,
            };
            console.log(responseToRender.value);
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
    const prompt = prompts.constructInitPrompt(
        prompts.contents.summerizeMonthPlan,
        allMonthPlans.value,
        isFirstCall
    );
    await callAPI("summerizeMonthPlan", prompt);
}, 1000);

const depictCharacter = useDebounceFn(async () => {
    if (isWaiting()) {
        toastRef.value.showToast("当前AI正在分析中，请耐心等待～", "error");
        return;
    }
    const prompt = prompts.constructInitPrompt(
        prompts.contents.depictCharacter,
        allMonthPlans.value,
        isFirstCall
    );
    await callAPI("depictCharacter", prompt);
}, 1000);

const optimizePlanToday = useDebounceFn(async () => {
    if (isWaiting()) {
        toastRef.value.showToast("当前AI正在分析中，请耐心等待～", "error");
        return;
    }
    const prompt = prompts.constructInitPrompt(
        prompts.contents.optimizePlanToday,
        allMonthPlans.value,
        isFirstCall
    );
    await callAPI("optimizePlanToday", prompt);
}, 1000);

const proposePlanTomorrow = useDebounceFn(async () => {
    if (isWaiting()) {
        toastRef.value.showToast("当前AI正在分析中，请耐心等待～", "error");
        return;
    }
    const prompt = prompts.constructInitPrompt(
        prompts.contents.proposePlanTomorrow,
        allMonthPlans.value,
        isFirstCall
    );
    await callAPI("proposePlanTomorrow", prompt);
}, 1000);

const predictMyBehavior = useDebounceFn(async () => {
    if (isWaiting()) {
        toastRef.value.showToast("当前AI正在分析中，请耐心等待～", "error");
        return;
    }
    const prompt = prompts.constructInitPrompt(
        prompts.contents.predictMyBehavior,
        allMonthPlans.value,
        isFirstCall
    );
    await callAPI("predictMyBehavior", prompt);
}, 1000);

const seekOldPlans = useDebounceFn(async () => {
    if (isWaiting()) {
        toastRef.value.showToast("当前AI正在分析中，请耐心等待～", "error");
        return;
    }
    const prompt = prompts.constructInitPrompt(
        prompts.contents.seekOldPlans,
        allMonthPlans.value,
        isFirstCall
    );
    await callAPI("seekOldPlans", prompt);
}, 1000);

// 拖拽 / 改变尺寸相关逻辑
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

// 拖拽调整大小
const startResize = (e, direction) => {
    isResizing.value = true;
    resizeDirection.value = direction;
    dragOffset.value = { x: e.clientX, y: e.clientY };

    document.addEventListener("mousemove", onResize);
    document.addEventListener("mouseup", stopResize);

    e.stopPropagation();
};

const onResize = (e) => {
    if (!isResizing.value) return;

    const dx = e.clientX - dragOffset.value.x;
    const dy = e.clientY - dragOffset.value.y;
    let newWidth = panelSize.value.width;
    let newHeight = panelSize.value.height;
    let newX = position.value.x;
    let newY = position.value.y;

    switch (resizeDirection.value) {
        case "right":
            newWidth = Math.max(200, panelSize.value.width + dx);
            break;
        case "left":
            newWidth = Math.max(200, panelSize.value.width - dx);
            newX = position.value.x + dx;
            break;
        case "bottom":
            newHeight = Math.max(150, panelSize.value.height + dy);
            break;
        case "top":
            newHeight = Math.max(150, panelSize.value.height - dy);
            newY = position.value.y + dy;
            break;
        case "top-left":
            newWidth = Math.max(200, panelSize.value.width - dx);
            newHeight = Math.max(150, panelSize.value.height - dy);
            newX = position.value.x + dx;
            newY = position.value.y + dy;
            break;
        case "top-right":
            newWidth = Math.max(200, panelSize.value.width + dx);
            newHeight = Math.max(150, panelSize.value.height - dy);
            newY = position.value.y + dy;
            break;
        case "bottom-left":
            newWidth = Math.max(200, panelSize.value.width - dx);
            newHeight = Math.max(150, panelSize.value.height + dy);
            newX = position.value.x + dx;
            break;
        case "bottom-right":
            newWidth = Math.max(200, panelSize.value.width + dx);
            newHeight = Math.max(150, panelSize.value.height + dy);
            break;
    }

    panelSize.value = { width: newWidth, height: newHeight };
    position.value = { x: newX, y: newY };

    dragOffset.value = { x: e.clientX, y: e.clientY };
};

const stopResize = () => {
    isResizing.value = false;
    document.removeEventListener("mousemove", onResize);
    document.removeEventListener("mouseup", stopResize);
};

onBeforeUnmount(() => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("mousemove", onResize);
    document.removeEventListener("mouseup", stopResize);
});
</script>

<style lang="scss" scoped>
.custom-panel {
    position: absolute;
    background: linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 100%);
    max-height: 100vh;
    min-width: 235px;
    min-height: 114px;
    width: auto;
    height: auto;
    padding: 20px;
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
.top-right {
    top: -5px;
    right: -5px;
    cursor: nesw-resize;
}
.bottom-left {
    bottom: -5px;
    left: -5px;
    cursor: nesw-resize;
}
.bottom-right {
    bottom: -5px;
    right: -5px;
    cursor: nwse-resize;
}

.left {
    top: 50%;
    left: -5px;
    height: 100%;
    transform: translateY(-50%);
    cursor: ew-resize;
}
.right {
    top: 50%;
    right: -5px;
    height: 100%;
    transform: translateY(-50%);
    cursor: ew-resize;
}
.top {
    left: 50%;
    top: -5px;
    width: 100%;
    transform: translateX(-50%);
    cursor: ns-resize;
}
.bottom {
    left: 50%;
    bottom: -5px;
    width: 100%;
    transform: translateX(-50%);
    cursor: ns-resize;
}

.title {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 20px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .title-icon {
        font-size: 24px;
        animation: bounce 2s infinite;
    }
}

.general-button {
    background: rgba(255, 255, 255, 0.25);
    padding: 12px 20px;
    margin-bottom: 12px;
    margin-right: 10px;
    text-align: center;
    border-radius: 15px;
    border: none;
    color: #2c3e50;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    &:active {
        transform: translateY(0);
    }

    .button-icon {
        font-style: normal;
    }
}

.bottom-button {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
}

.responses-container {
    margin: 20px 0;
    max-height: 300px;
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
