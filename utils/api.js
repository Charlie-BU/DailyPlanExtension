export async function sendMessageToBackground(message) {
    console.log("Sending message to background:", message);
    const response = await browser.runtime.sendMessage(message);
    console.log("Received response from background:", response);
    return response;
}

export async function translateText(config, text, targetLang) {
    console.log("Translating text:", { config, text, targetLang });
    return sendMessageToBackground({
        type: "translate",
        config,
        text,
        targetLang,
    });
}

export async function explainText(config, text, targetLang) {
    return sendMessageToBackground({
        type: "explain",
        config,
        text,
        targetLang,
    });
}
