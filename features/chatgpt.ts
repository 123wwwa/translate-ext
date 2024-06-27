import { getChromeStorage } from "~shared/storage";
import type { AskGptOptions } from "~shared/types/handlerTypes";
import { sendToBackground } from "@plasmohq/messaging";
import type { RequestBody, ResponseBody } from "~background/messages/gpt";
export const gptTranslate = async (text: string) => {
    console.log("text", text);
    const fromLang = await getChromeStorage("fromLanguage", "en");
    const toLang = await getChromeStorage("toLanguage", "en");
    let content = `translate to ${toLang} naturally\n
     example)inputううう・・・ののちゃんオリ曲おめでとう・・・output으으으... 노노쨩 오리지널 곡 축하해...\n
    here is input: ${text}`;
    let options: AskGptOptions = {
        messages: [{"role": "user", "content":content}],
        max_tokens: 1000,
        model: "gpt-4o",
        temperature: 0.1
    };
    let message = {
        name: "gpt",
        body : {
            options: options
        }
    }
    //@ts-ignore
    let req = await sendToBackground<RequestBody, ResponseBody>(message);
    if (req.error) {
        alert(req.error);
        console.error(req.error);
        return req.error;
    }
    let res = req.content;
    // trim the result
    //res.replace("choice", "").trim();
    return res;
}