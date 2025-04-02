<template>
    <div class="welcome-container">
        <div class="header">
            <h1>我要做计划 AI 插件</h1>
            <p>选择您喜欢的计划平台开始使用</p>
        </div>

        <div class="platforms-container">
            <div
                v-for="platform in platforms"
                :key="platform.name"
                class="platform-card"
                @click="navigateToPlatform(platform.URL)">
                <div class="platform-icon">
                    <img :src="platform.icon" alt="Platform Icon" />
                </div>
                <div class="platform-info">
                    <h3>{{ platform.name }}</h3>
                    <p>{{ platform.description }}</p>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>© 我要做计划 AI 插件 - 让计划更简单</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { allPlatforms } from "@/utils/config";

const platforms = ref(allPlatforms);

const navigateToPlatform = (url) => {
    chrome.tabs.create({ url });
};
</script>

<style scoped>
.welcome-container {
    font-family: "Poppins", sans-serif;
    width: 360px;
    min-height: 480px;
    padding: 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.header {
    text-align: center;
    margin-bottom: 24px;
}

.header h1 {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    background: linear-gradient(90deg, #4776e6 0%, #8e54e9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.header p {
    font-size: 14px;
    color: #666;
    margin: 0;
}

.platforms-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
}

.platform-card {
    display: flex;
    align-items: center;
    padding: 16px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;
}

.platform-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.platform-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    font-size: 20px;
    color: white;
    overflow: hidden; /* 图片不会溢出容器 */
}

.platform-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
}

.platform-info {
    flex: 1;
}

.platform-info h3 {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 4px 0;
    color: #333;
}

.platform-info p {
    font-size: 12px;
    color: #666;
    margin: 0;
}

.footer {
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-top: auto;
}
</style>
