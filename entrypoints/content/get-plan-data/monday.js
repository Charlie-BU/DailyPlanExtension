import { ofetch } from "ofetch";

const currURL = window.location.href;
const urlObj = new URL(currURL);
const domain = urlObj.origin;

const match = currURL.match(/\/boards\/(\d+)\//);
const boardId = match ? match[1] : null;

console.log(domain, boardId);

export const getAllTasks = async () => {
    const res = await ofetch(
        `https://${domain}.monday.com/columnvalues/board-ms/boards/${boardId}/items`,
        {
            method: "GET",
        }
    );
    console.log(res);
    // return res?.task_id || "";
};
