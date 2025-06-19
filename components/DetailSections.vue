<template>
    <div
        v-for="(value, key) in responseToRender.res"
        :key="key"
        class="analysis-card">
        <h3>
            {{ utils.getNameAndIcon(responseToRender.func, key).icon }}
            {{ utils.getNameAndIcon(responseToRender.func, key).name }}
        </h3>
        <div class="content">
            <!-- { 键: xx% } 饼图渲染 -->
            <template
                v-if="
                    Array.isArray(value) &&
                    value.length > 0 &&
                    typeof value[0] === 'object' &&
                    (utils.parsePercentage(Object.values(value[0])[0]) ||
                        utils.parsePercentage(Object.values(value[0])[1]))
                ">
                <div class="pie-chart">
                    <PieChart
                        :chartData="
                            value.map((each) => {
                                const [name, value] = Object.values(each);
                                return { name, value };
                            })
                        " />
                </div>
            </template>
            <!-- 对象数组：渲染表格 -->
            <template
                v-else-if="
                    Array.isArray(value) &&
                    value.length > 0 &&
                    typeof value[0] === 'object'
                ">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th
                                v-for="(col, index) in Object.keys(value[0])"
                                :key="index"
                                style="text-align: center">
                                {{ col }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, rowIndex) in value" :key="rowIndex">
                            <td
                                v-for="(col, colIndex) in Object.keys(row)"
                                :key="colIndex"
                                style="text-align: center; position: relative"
                                @mouseenter="
                                    hoverCell = `${rowIndex}-${colIndex}`
                                "
                                @mouseleave="hoverCell = null">
                                {{ row[col] }}
                                <span
                                    v-if="
                                        hoverCell === `${rowIndex}-${colIndex}`
                                    "
                                    @click="copyToClipboard(row[col])">
                                    {{ copyState ? "✓" : "📋" }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>

            <!-- 可枚举对象：渲染表格 -->
            <template
                v-else-if="
                    value &&
                    typeof value === 'object' &&
                    Object.keys(value).length
                ">
                <table class="data-table">
                    <tbody>
                        <tr
                            v-for="[key, val] in Object.entries(value)"
                            :key="key">
                            <td
                                class="object-key-col"
                                style="text-align: center">
                                {{ key }}
                            </td>
                            <td
                                style="text-align: center"
                                @mouseenter="hoverCell = val"
                                @mouseleave="hoverCell = null">
                                {{ val }}
                                <span
                                    v-if="hoverCell === val"
                                    @click="copyToClipboard(val)">
                                    {{ copyState ? "✓" : "📋" }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>

            <template v-else>
                <div
                    @mouseenter="hoverCell = value"
                    @mouseleave="hoverCell = null">
                    {{ value }}
                    <span
                        v-if="hoverCell === value"
                        @click="copyToClipboard(value)">
                        {{ copyState ? "✓" : "📋" }}
                    </span>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import PieChart from "./PieChart.vue";
import * as utils from "../utils/utils";

// 传入对象格式：{
//     func: 功能名,
//     res: {
//         字段1: 值1,
//         字段2: 值2,
//         ...
//     }
// }
const props = defineProps({
    responseToRender: {
        type: Object,
        required: true,
    },
});

const copyState = ref(false);

// 移入复制事件
const hoverCell = ref(null);

const copyToClipboard = (text) => {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            copyState.value = true;
            setTimeout(() => {
                copyState.value = false;
            }, 1000);
        })
        .catch((err) => {
            console.error("复制失败: ", err);
        });
};
</script>

<style lang="scss" scoped>
.analysis-card {
    background: transparent;
    border-radius: 16px;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    color: #2c3e50;
    overflow: hidden;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    }

    h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 17px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .content {
        font-size: 15px;
        color: #34495e;
        line-height: 1.5;
        overflow-x: auto; /* 让表格超出时可滚动 */
        max-width: 100%;
    }
}

.pie-chart {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 表格样式 */
.data-table {
    width: 100%;
    // table-layout: fixed; /* 让单元格宽度固定 */
    min-width: 600px; /* 让表格不会太窄 */
    border-collapse: collapse;
    margin-top: 8px;
}

.data-table th,
.data-table td {
    border: 1px solid #ddd;
    padding: 8px;
    word-wrap: break-word;
    overflow: hidden;
}

.data-table th {
    white-space: nowrap;
    font-weight: bold;
}

.object-key-col {
    text-align: center;
    font-weight: bold;
    white-space: nowrap;
}

.copy-icon {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: gray;
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.copy-icon:hover {
    opacity: 1;
}
</style>
