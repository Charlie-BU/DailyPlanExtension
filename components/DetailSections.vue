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
            <!-- 对象数组：渲染表格 -->
            <template
                v-if="
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
                                style="text-align: center">
                                {{ row[col] }}
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
                    <!-- <thead>
                            <tr>
                                <th style="text-align: center">键</th>
                                <th style="text-align: center">值</th>
                            </tr>
                        </thead> -->
                    <tbody>
                        <tr
                            v-for="[key, val] in Object.entries(value)"
                            :key="key">
                            <td
                                class="object-key-col"
                                style="text-align: center">
                                {{ key }}
                            </td>
                            <td style="text-align: center">{{ val }}</td>
                        </tr>
                    </tbody>
                </table>
            </template>

            <template v-else>
                {{ value }}
            </template>
        </div>
    </div>
</template>

<script setup>
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

// template直接渲染
// const formatValue = (value) => {
//     // 若返回的是对象数组
//     if (typeof value === "object" && value !== null) {
//         console.log(value);
//         // return parsedValue;
//     }
//     return value;
// };
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
</style>
