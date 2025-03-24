<template>
    <div
        class="custom-panel"
        ref="panel"
        @mousedown="startDrag"
        :style="{ left: position.x + 'px', top: position.y + 'px' }">
        <div class="drag-handle">拖拽区域</div>
        <div class="drag-handle" style="cursor: pointer" @click="hide = !hide">
            {{ hide ? "显示" : "隐藏" }}
        </div>
        <h3>当月计划：{{ testData.value.length }}个</h3>
        <div v-if="!hide" v-for="(plan, index) in testData.value" :key="index">
            <p>
                <strong>{{ index + 1 }}. </strong>
                {{ plan.plansFinished || "未找到" }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { defineProps, watch, ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
    testData: {
        type: Object,
        required: true,
    },
});
// watch(
//     () => props.testData.value,
//     (newData) => {
//         console.log("Updated data:", newData);
//     },
//     { deep: true }
// );

const hide = ref(true);

const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const panel = ref(null);

const startDrag = (e) => {
    // 只允许从拖拽区域开始拖拽
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

    const newX = e.clientX - dragOffset.value.x;
    const newY = e.clientY - dragOffset.value.y;

    // 确保面板不会被拖出视口
    const maxX = window.innerWidth - panel.value.offsetWidth;
    const maxY = window.innerHeight - panel.value.offsetHeight;

    position.value = {
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY),
    };
};

const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
};

// 组件卸载时清理事件监听
onBeforeUnmount(() => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
});
</script>

<style scoped>
.custom-panel {
    position: fixed;
    width: 20%;
    background: linear-gradient(135deg, #02e6cf 0%, #feb47b 100%);
    max-height: 100vh;
    overflow-y: auto;
    padding: 10px;
    box-sizing: border-box;
    z-index: 999;
    user-select: none;
}

.drag-handle {
    background-color: #afc2e4;
    padding: 5px;
    margin-bottom: 10px;
    cursor: move;
    text-align: center;
    border-radius: 4px;
}

.drag-handle:hover {
    background-color: #999;
}
</style>
