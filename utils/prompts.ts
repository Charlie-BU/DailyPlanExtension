const today = new Date();
const todayString = `${today.getFullYear()}年${
    today.getMonth() + 1
}月${today.getDate()}日`;

export const constructInitPrompt = (
    extraWords: String,
    allMonthPlans: Array<any>,
    isFirstCall: Boolean = true
) => {
    let prompt = isFirstCall ? "我的本月计划如下" : "";
    prompt += `${extraWords}，请以各条目为键名，生成相应内容纯文本为值，返回json格式方便我解析：\n\n`;
    if (isFirstCall) {
        for (const each of allMonthPlans) {
            prompt += `日期：${each.date}\n已完成计划：${each.plansFinished}\n未完成计划：${each.plansUnfinished}`;
        }
    }
    return prompt;
};

// 提示词封装为contents对象
export const contents = {
    systemInitPrompt:
        "你是由计划分析专家、数据科学家和心理学家组成的智能体，负责对用户计划数据进行多维度分析。",
    test: "你是什么模型？",
    summerizeMonthPlan:
        "请帮我对本月计划进行总结，条目包括：1.完成与未完成比例；2.本月个人状态；3.近日个人状态等",
    depictCharacter:
        "请根据计划内容刻画我的个人形象，请自行确定个人形象的相关条目key",
    // 条目：计划质量、优先级智能排序、计划分类、计划坚持度
    optimizePlanToday: `今天是${todayString}，请综合之前和之后的计划内容对我今天（${todayString}）的计划进行分析与优化（今日计划无需关注已完成或未完成）。
        条目包括：
        1. planQuality：今日计划是否稍显杂乱无章？如果是，请给予建议（并非优先级，而是计划内容是否合理或欠妥，如何修改）并加以人性化鼓励；如果不是，请加以赞扬；
        2. priorityOrder：请给出最合理的优先级排序方式，并指出建议用时以及建议在一天中完成的时间段；
        3. classification：分为工作型和休闲型。给出平衡建议：若工作型远多于休闲型，则提醒适时休息，安排休息时间并建议休息内容；若休闲型远多于工作型，则给出相应建议，提醒不要懈怠等；
        4. adherence：分析过去坚持的某些计划今日仍有坚持。若有，请给予赞扬；若没有，请适当提醒并给出建议；`,
};
