type NameAndIcon = {
    name: String;
    icon: string;
};

export const getNameAndIcon = (key: string): NameAndIcon | {} => {
    // Record<K, V>限定键类型K，值类型V
    const namesAndIcons: Record<string, NameAndIcon> = {
        planQuality: {
            name: "计划质量",
            icon: "🔹",
        },
        priorityOrder: {
            name: "优先级排序",
            icon: "🔹",
        },
        classification: {
            name: "计划分类",
            icon: "🔹",
        },
        adherence: {
            name: "计划坚持度",
            icon: "🔹",
        },
        planList: {
            name: "常规计划建议",
            icon: "🔹",
        },
        unfinishedPlans: {
            name: "近期未完成计划请留意‼️",
            icon: "🔹",
        },
        comments: {
            name: "分析与建议",
            icon: "🔹",
        },
    };

    return namesAndIcons[key] || {};
};
