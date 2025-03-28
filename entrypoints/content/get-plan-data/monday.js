import { ofetch } from "ofetch";

const currURL = window.location.href;
const urlObj = new URL(currURL);
const domain = urlObj.origin;

const match = currURL.match(/\/boards\/(\d+)\//);
const boardId = match ? match[1] : null;

console.log(domain, boardId);

const formatTaskArray = (rawTasks) => {
    const allTasks = Object.values(rawTasks).flat().map((each) => {
        const date = each.column_values.date?.date ? new Date(each.column_values.date.date) : null;
        return {
            title: each.column_values.name || each.name,
            status: each.column_values.project_status?.index === 1,
            date: date ? `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日` : "未知",
            day: date ? date.getDate() : null,
        };
    });

    const groupedTasks = allTasks.reduce((acc, task) => {
        const { date, title, status } = task;
        let entry = acc.find((item) => item.date === date);

        if (!entry) {
            entry = { date, day: task.day, plansFinished: [], plansUnfinished: [] };
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
    const res = await ofetch(
        `${domain}/columnvalues/board-ms/boards/${boardId}/items`,
        {
            method: "GET",
        }
    );
    const rawTasks = res?.pagedItems;
    const tasks = formatTaskArray(rawTasks);
    console.log(res);
    console.log(tasks);
    return tasks;
};

