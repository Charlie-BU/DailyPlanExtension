<template>
    <div class="analysis-container">
        <div class="analysis-card completion-ratio">
            <h3>📊 完成情况</h3>
            <div class="progress-container">
                <div
                    class="progress-bar"
                    :style="{ width: completionRate + '%' }">
                    {{ completionRate }}%
                </div>
            </div>
            <div class="stats">
                <div class="stat-item">
                    <span class="label">已完成</span>
                    <span class="value completed">啦啦啦啦滴好次的</span>
                </div>
                <div class="stat-item">
                    <span class="label">未完成</span>
                    <span class="value uncompleted">人呢发v把瑞恶霸v</span>
                </div>
            </div>
        </div>

        <!-- 本月状态卡片 -->
        <div class="analysis-card monthly-status">
            <h3>📈 本月个人状态</h3>
            <div class="status-section">
                <h4>🌟 积极表现</h4>
                <ul>
                    <li
                        v-for="(item, index) in data.本月个人状态.积极方面"
                        :key="'positive-' + index">
                        {{ item }}
                    </li>
                </ul>
            </div>
            <div class="status-section">
                <h4>💪 待改进方面</h4>
                <ul>
                    <li
                        v-for="(item, index) in data.本月个人状态.待改进方面"
                        :key="'improve-' + index">
                        {{ item }}
                    </li>
                </ul>
            </div>
        </div>

        <!-- 近期状态卡片 -->
        <div class="analysis-card recent-status">
            <h3>📅 近期状态 ({{ data.近日个人状态.时间范围 }})</h3>
            <div class="status-section">
                <h4>📌 状态特征</h4>
                <ul>
                    <li
                        v-for="(item, index) in data.近日个人状态.状态特征"
                        :key="'status-' + index">
                        {{ item }}
                    </li>
                </ul>
            </div>
            <div class="status-section">
                <h4>💡 建议</h4>
                <ul>
                    <li
                        v-for="(item, index) in data.近日个人状态.建议"
                        :key="'suggestion-' + index">
                        {{ item }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});

const completionRate = computed(() => {
    const completed = props.data.完成与未完成比例.已完成;
    const total = completed + props.data.完成与未完成比例.未完成;
    return ((completed / total) * 100).toFixed(2);
});
</script>

<style lang="scss" scoped>
.analysis-container {
    display: grid;
    gap: 20px;
    padding: 16px;
}

.analysis-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }

    h3 {
        margin: 0 0 16px;
        color: #2c3e50;
        font-size: 1.2rem;
        font-weight: 600;
    }

    h4 {
        color: #3498db;
        margin: 12px 0;
        font-size: 1rem;
    }
}

.progress-container {
    background: #f0f3f6;
    border-radius: 10px;
    height: 20px;
    overflow: hidden;
    margin: 10px 0;
}

.progress-bar {
    background: linear-gradient(90deg, #4caf50, #8bc34a);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.8rem;
    transition: width 0.5s ease;
}

.stats {
    display: flex;
    justify-content: space-around;
    margin-top: 16px;
}

.stat-item {
    text-align: center;

    .label {
        display: block;
        color: #7f8c8d;
        font-size: 0.9rem;
        margin-bottom: 4px;
    }

    .value {
        font-size: 1.2rem;
        font-weight: 600;

        &.completed {
            color: #27ae60;
        }

        &.uncompleted {
            color: #e74c3c;
        }
    }
}

.status-section {
    margin: 16px 0;

    ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            background: rgba(236, 240, 241, 0.6);
            margin: 8px 0;
            padding: 12px;
            border-radius: 8px;
            font-size: 0.9rem;
            color: #34495e;
            transition: background-color 0.2s ease;

            &:hover {
                background: rgba(236, 240, 241, 0.9);
            }
        }
    }
}

@media (max-width: 768px) {
    .analysis-container {
        grid-template-columns: 1fr;
    }
}

@media (min-width: 769px) {
    .analysis-container {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
}
</style>
