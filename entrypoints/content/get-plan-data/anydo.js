import { ofetch } from "ofetch";

import { formatTimestamp } from "../../../utils/utils";

const getAnydoAuth = () => {
    return localStorage.getItem("auth") || "";
};

const getTaskId = async () => {
    const res = await ofetch(`https://sm-prod4.any.do/api/v14/me/bg_sync`, {
        method: "GET",
        headers: {
            "x-anydo-auth": getAnydoAuth(),
        },
    });
    return res?.task_id || "";
};

const formatTaskArray = (rawTasks) => {
    const allTasks = rawTasks.map((each) => {
        const date = formatTimestamp(each.dueDate, "toDate");
        return {
            title: each.title,
            status: each.status === "CHECKED",
            date: date ? `${date.year}年${date.month}月${date.day}日` : "未知",
            day: Number(date.day),
        };
    });

    const groupedTasks = allTasks.reduce((acc, task) => {
        const { title, status, date, day } = task;
        let entry = acc.find((item) => item.date === date);

        if (!entry) {
            entry = { date, day, plansFinished: [], plansUnfinished: [] };
            acc.push(entry);
        }
        if (status) {
            entry.plansFinished.push(title);
        } else {
            entry.plansUnfinished.push(title);
        }
        return acc;
    }, []);

    // 按日期排序（从早到晚）
    groupedTasks.sort((a, b) => {
        return (
            new Date(
                a.date.replace(/(\d+)年(\d+)月(\d+)日/, "$1-$2-$3")
            ).getTime() -
            new Date(
                b.date.replace(/(\d+)年(\d+)月(\d+)日/, "$1-$2-$3")
            ).getTime()
        );
    });

    return groupedTasks;
};

export const getAllTasks = async () => {
    const taskId = await getTaskId();
    if (!taskId) {
        console.error("Failed to get task ID");
        return null;
    }
    const res = await ofetch(
        `https://sm-prod4.any.do/me/bg_sync_result/${taskId}`,
        {
            method: "GET",
            headers: {
                "x-anydo-auth": getAnydoAuth(),
            },
        }
    );
    const rawTasks = res?.models?.task?.items;
    const tasks = formatTaskArray(rawTasks);
    return tasks;
};
