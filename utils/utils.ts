type NameAndIcon = {
    name: string;
    icon: string;
};

export const getNameAndIcon = (func: string, key: string): NameAndIcon => {
    const mapping: Record<string, Record<string, NameAndIcon>> = {
        summerizeMonthPlan: {
            completionRate: { name: "完成率", icon: "📊" },
            taskCategoryDistribution: { name: "任务类型分布", icon: "📂" },
            personalStateMonthly: { name: "本月个人状态", icon: "🧘" },
            personalStateRecent: { name: "最近7天状态", icon: "📅" },
            timeManagementEfficiency: { name: "时间管理效率", icon: "⏳" },
            planStability: { name: "计划稳定性", icon: "📈" },
            topAchievements: { name: "本月成就", icon: "🏆" },
            keyChallenges: { name: "主要挑战", icon: "⚠️" },
            summaryAndAdvice: { name: "总结与建议", icon: "📝" },
        },
        depictCharacter: {
            timeManagementStyle: { name: "时间管理风格", icon: "⏰" },
            taskCompletionPattern: { name: "任务完成模式", icon: "✅" },
            learningStyle: { name: "学习风格", icon: "📖" },
            stressResponse: { name: "压力应对", icon: "😵" },
            strengths: { name: "优势", icon: "💪" },
            weaknesses: { name: "劣势", icon: "🤔" },
            hobbies: { name: "兴趣爱好", icon: "🎨" },
            socialStlements: { name: "社交风格", icon: "👥" },
            habitConsistency: { name: "习惯一致性", icon: "🔄" },
            personaSummary: { name: "个人形象总结", icon: "🎭" },
        },
        optimizePlanToday: {
            planQuality: { name: "计划质量", icon: "📋" },
            suggestedPlan: { name: "建议计划", icon: "✅" },
            priorityOrder: { name: "优先级排序", icon: "🔝" },
            classification: { name: "计划分类", icon: "📌" },
            adherence: { name: "计划坚持度", icon: "🔗" },
        },
        proposePlanTomorrow: {
            planList: { name: "明日计划建议", icon: "🗓️" },
            unfinishedPlans: { name: "未完成计划", icon: "⚡" },
            comments: { name: "总结与建议", icon: "💬" },
        },
        predictMyBehavior: {
            goodHabits: { name: "良好习惯", icon: "🌟" },
            badHabits: { name: "不良习惯", icon: "🚫" },
            bottlenecks: { name: "计划瓶颈", icon: "🛑" },
            comments: { name: "总体评价", icon: "💡" },
        },
        seekOldPlans: {
            droppedPlans: { name: "曾经坚持的计划", icon: "🔍" },
            priorityRecovery: { name: "优先恢复计划", icon: "♻️" },
            comments: { name: "总结与建议", icon: "📢" },
        },
    };

    return mapping[func]?.[key] || { name: "未知字段", icon: "❓" };
};

export const formatTimestamp = (
    timestamp: string | number,
    scope: "toDate" | "toTime" = "toDate"
): object | null => {
    const date = new Date(Number(timestamp));
    if (isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (scope === "toDate") {
        return { year, month, day };
    }

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return { year, month, day, hour, minute, second };
};

export const parsePercentage = (str: string): Number => {
    const match = str.match(/^(\d+(\.\d+)?)%$/);
    return match ? parseFloat(match[1]) / 100 : NaN;
};
