const today = new Date();
const todayString = `${today.getFullYear()}年${
    today.getMonth() + 1
}月${today.getDate()}日`;

export const constructInitPrompt = (
    extraWords: String,
    allMonthPlans: Array<any>
) => {
    let prompt = `我的本月计划如下，${extraWords}，请以各条目为键名，生成相应内容为值，返回json格式方便我解析：\n\n`;
    for (const each of allMonthPlans) {
        prompt += `日期：${each.date}\n已完成计划：${each.plansFinished}\n未完成计划：${each.plansUnfinished}`;
    }
    return prompt;
};

// 提示词封装为contents对象
export const contents = {
    test: "你是什么模型？",
    summerizeMonthPlan:
        "请帮我对本月计划进行总结，条目包括：1.完成与未完成比例；2.本月个人状态；3.近日个人状态等",
    depictCharacter:
        "请根据计划内容刻画我的个人形象，请自行确定个人形象的相关条目key",
    optimizePlanToday: `今天是${todayString}，请综合之前和之后的计划内容对我今天（${todayString}）的计划进行优化。
        条目包括：1.安排合理计划及理由；2.安排欠妥计划及理由；3.按照之前计划分析需增加/坚持的计划及理由`,
};
