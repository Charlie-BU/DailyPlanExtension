export const Test = () => {
    const elements = document.querySelectorAll(".list.red");
    if (!elements.length) {
        return [];
    }
    const result = Array.from(elements).map((element) => ({
        text: element.innerText,
    }));
    return result;
};

export const getAllPlansThisMonth = () => {
    const currentMonth = document.querySelector(".current-date")?.innerText;

    const tds = document.querySelectorAll(
        "#app .el-calendar__body table tbody td.current"
    );
    const res = [];
    for (let td of tds) {
        // 获取当前日期-日
        const dateDay = td.querySelector(
            "div > div > div.date-title > div.day > div.checked"
        )?.innerText;
        // 获取农历信息
        const lunar = td.querySelector(
            "div > div > div.date-title > div.lunar"
        )?.innerText;
        // 获取当日全部计划DOM元素数组
        const plansToday = Array.from(
            td.querySelectorAll("div > div > div.date-lists > div.list")
        );
        // 获取当日完成/未完成的计划数组
        const plansFinished = plansToday
            ?.filter((plan) => plan.classList.contains("complete"))
            .map((plan) => plan.innerText.trim());
        const plansUnfinished = plansToday
            ?.filter((plan) => !plan.classList.contains("complete"))
            .map((plan) => plan.innerText.trim());
        // 构造planObj
        const planObj = {
            date: `${currentMonth}${dateDay}日` || "未知",
            lunar: lunar || "未知",
            plansFinished: plansFinished || [],
            plansUnfinished: plansUnfinished || [],
        };
        console.log(planObj);
        res.push(planObj);
    }
    if (!tds.length) {
        return [];
    }
    return res;
};
