<template>
    <div class="analysis-container">
        <div v-for="(value, key) in data" :key="key" class="analysis-card">
            <h3>{{ getIcon(key) }} {{ key }}</h3>
            <div class="content">{{ formatValue(value) }}</div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});

const getIcon = (key) => {
    const icons = {
        完成情况: "📊",
        本月个人状态: "📈",
        近日个人状态: "📅",
        其他: "🔍",
    };
    return icons[key] || "🔹";
};

const formatValue = (value) => {
    if (typeof value === "object" && value !== null) {
        return Object.entries(value)
            .map(
                ([subKey, subValue]) =>
                    `${subKey}: ${
                        Array.isArray(subValue) ? subValue.join(", ") : subValue
                    }`
            )
            .join(" | ");
    }
    return value;
};
</script>

<style lang="scss" scoped>
.analysis-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    padding: 20px;
}

.analysis-card {
    background: linear-gradient(135deg, #ff9a9e, #fad0c4);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    color: #2c3e50;

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
    }
}
</style>
