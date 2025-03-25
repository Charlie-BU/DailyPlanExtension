<template>
    <div>
        <div id="test-chart" style="width: 600px; height: 400px"></div>
    </div>
</template>

<script setup>
import * as echarts from "echarts";

const props = defineProps({
    chartData: {
        type: Array,
        required: true,
    },
});

const initECharts = () => {
    //    const data = [
    //        { value: 1048, name: 'Search Engine' },
    //        { value: 735, name: 'Direct' },
    //        { value: 580, name: 'Email' },
    //        { value: 484, name: 'Union Ads' },
    //        { value: 300, name: 'Video Ads' }
    //    ]
    initChart(props.chartData);
};

const initChart = (data) => {
    //const chartData = await fetchChartData();
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
                name: "Access From",
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
                //data: [
                //    { value: 1048, name: 'Search Engine' },
                //    { value: 735, name: 'Direct' },
                //    { value: 580, name: 'Email' },
                //    { value: 484, name: 'Union Ads' },
                //    { value: 300, name: 'Video Ads' }
                //]
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
