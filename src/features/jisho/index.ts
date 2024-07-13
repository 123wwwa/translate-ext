import { sendToBackground } from "@plasmohq/messaging";
import { type RequestBody, type ResponseBody } from "~background/messages/jisho";
import kuromoji from 'kuromoji';
export const jishoSearchWord = async (word: string) => {
    const searchText = word.trim();
    const dictPath = window.chrome.runtime.getURL('assets/dict');
    const tokens = await new Promise((resolve, reject) => {
        kuromoji.builder({ dicPath: dictPath }).build((err, tokenizer) => {
            if (err) {
                console.error("Error building tokenizer:", err);
                reject(err);
            } else {
                resolve(tokenizer.tokenize(searchText));
            }
        });
    });
    let message = {
        name: "jisho",
        body: {
            tokens: tokens
        }
    };
    // @ts-ignore
    let req = await sendToBackground<RequestBody, ResponseBody>(message);
    return req.data;
};