<template>
    <div ref="demo" class="demo">
        <button @click="goTranslate">去翻译</button>
        <p>
            <strong>Selected Text:</strong>
            <em :class="selectedStyle" class="">{{ text || "No selected" }}</em>
        </p>
        <!-- <p>{{ rects[0].left }}</p> -->
        <!-- <p>
      <strong>Selected rects:</strong>
      <pre class="" lang="json">{{ rects }}</pre>
    </p> -->
        <div>翻译如下:</div>
        <p>{{ res }}</p>
    </div>
</template>

<script setup>
import { useTextSelection } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { storage } from "wxt/storage";
const demo = ref();
const { rects, text } = useTextSelection();
const selectedStyle = computed(() =>
    text.value ? "text-primary" : "text-gray-400"
);
const res = ref("");
const goTranslate = async () => {
    let settings = await storage.getItem("local:settings");
    let response = await translateText(settings, text.value);
    res.value = response.data.choices[0].message.content;
    console.log("response", response);
    console.log("99999", settings);
    console.log("goTranslate", text.value);
};
</script>

<style scoped>
.demo {
    position: fixed;
    top: 0;
    left: 0;
    background-color: #ccc;
    z-index: 9999;
}
</style>
