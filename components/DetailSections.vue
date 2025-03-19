<template>
    <div class="analysis-container">
        <div
            v-for="(value, key) in responseToRender.res"
            :key="key"
            class="analysis-card">
            <h3>
                {{ utils.getNameAndIcon(responseToRender.func, key).icon }}
                {{ utils.getNameAndIcon(responseToRender.func, key).name }}
            </h3>
            <div class="content">
                <!-- 判断是否是数组对象，如果是则渲染表格，否则直接展示 -->
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
                                    v-for="(col, index) in Object.keys(
                                        value[0]
                                    )"
                                    :key="index"
                                    style="text-align: center">
                                    {{ col }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(row, rowIndex) in value"
                                :key="rowIndex">
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
                <template v-else>
                    {{ formatValue(value) }}
                </template>
            </div>
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
const formatValue = (value) => {
    // 若返回的是对象数组
    if (Array.isArray(value) && value !== null) {
        const parsedValue = value
            .map((each) =>
                Object.entries(each)
                    .map(([key, val]) => `${key}: ${val}`)
                    .join(" | ")
            )
            .join("\n");
        console.log(parsedValue);
        return parsedValue;
    }
    return value;
};
</script>

<style lang="scss" scoped>
.analysis-card {
    background: linear-gradient(135deg, #ff9a9e, #fad0c4);
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
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .content {
        font-size: 1rem;
        color: #34495e;
        line-height: 1.5;
        overflow-x: auto; /* 让表格超出时可滚动 */
        max-width: 100%;
    }
}

/* 表格样式 */
.data-table {
    width: 100%;
    table-layout: fixed; /* 让单元格宽度固定 */
    min-width: 600px; /* 让表格不会太窄 */
    border-collapse: collapse;
    margin-top: 8px;
}

.data-table th,
.data-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    word-wrap: break-word;
    overflow: hidden;
    // white-space: nowrap; /* 防止文本换行，可选 */
}

.data-table th {
    font-weight: bold;
}
</style>
