<template>
    <div>
        <div id="test-chart" style="width: 500px; height: 333px"></div>
    </div>
</template>

<script setup>
import * as utils from "../utils/utils";
import * as echarts from "echarts";

const props = defineProps({
    chartData: {
        type: Array,
        required: true,
    },
});

const initECharts = () => {
    initChart(props.chartData);
};

const initChart = (data) => {
    // 百分比单独处理
    data.map((each) => {
        if (utils.parsePercentage(each.value)) {
            each.value = utils.parsePercentage(each.value) * 100;
        }
    });
    console.log(data);
    var chartDom = document.getElementById("test-chart");
    if (!chartDom) {
        return;
    }
    var myChart = echarts.init(chartDom);
    var option;

    option = {
        tooltip: {
            trigger: "item",
        },
        legend: {
            top: "5%",
            left: "center",
        },
        series: [
            {
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: "center",
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: "bold",
                    },
                },
                labelLine: {
                    show: false,
                },
                data: data,
            },
        ],
    };

    option && myChart.setOption(option);
};

onMounted(() => {
    initECharts();
});
</script>

<style lang="scss" scoped></style>
