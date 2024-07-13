import type { PlasmoMessaging } from "@plasmohq/messaging";

const handler: PlasmoMessaging.PortHandler = async (req: any, res) => {
    try {
        console.log("Opening side panel");
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.sidePanel.open({ tabId: tab.id });
        });
        res.send({ success: true });
    } catch (error) {
        console.error("Failed to open side panel:", error);
        res.send({ success: false, error: error.message });
    }
}
export default handler