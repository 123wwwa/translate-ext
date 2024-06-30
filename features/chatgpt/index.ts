import { getChromeStorage } from "~shared/storage";
import type { AskGptOptions } from "~shared/types/handlerTypes";
import { sendToBackground } from "@plasmohq/messaging";
import type { RequestBody, ResponseBody } from "~background/messages/gpt";
import { prompts } from "./prompts";
export const gptTranslate = async (text: string) => {
    const fromLang = await getChromeStorage("fromLanguage", "en");
    const toLang = await getChromeStorage("toLanguage", "en");
    let content = prompts["jp-ko"]+text;
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
    res = removeJsonPrefix(res);
    return res;
}
function removeJsonPrefix(text: string): string {
    // Trim any leading or trailing whitespace
    text = text.trim();
    
    // Check if the first 10 characters contain "json"
    const prefixLength = 10;
    const prefix = text.slice(0, prefixLength).toLowerCase();
  
    if (prefix.includes('json')) {
      // Find the position of the "json" substring
      const jsonIndex = prefix.indexOf('json');
      
      // Remove the "json" substring
      text = text.slice(0, jsonIndex) + text.slice(jsonIndex + 4).trim();
    }
  
    // Remove leading backticks and whitespace
    if (text.startsWith('```')) {
      text = text.slice(3).trim();
    }
  
    // Remove trailing backticks and whitespace
    if (text.endsWith('```')) {
      text = text.slice(0, -3).trim();
    }
    try {
        text = JSON.parse(text);
    } catch (error) {
        text = eval(`(${text})`);
    }
    console.log(text);
    return text;
  }