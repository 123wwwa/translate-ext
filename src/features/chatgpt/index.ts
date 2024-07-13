import type { AskGptOptions } from "~shared/types/handlerTypes";
import { sendToBackground } from "@plasmohq/messaging";
import type { RequestBody, ResponseBody } from "~background/messages/gpt";
import { explainPrompts, prompts } from "./prompts";
import type { Translations } from "~shared/types/translationTypes";

export const gptTranslate = async (text: string): Promise<Translations> => {
  let content = prompts["jp-ko"] + text;
  let options: AskGptOptions = {
    messages: [{ role: "user", content: content }],
    max_tokens: 1000,
    model: "gpt-4o",
    temperature: 0.1,
  };
  let message = {
    name: "gpt",
    body: {
      options: options,
    },
  };
  //@ts-ignore
  let req = await sendToBackground<RequestBody, ResponseBody>(message);
  if (req.error) {
    alert(req.error);
    console.error(req.error);
    return {};
  }
  let res = req.content;
  console.log(removeJsonPrefix(res));
  return removeJsonPrefix(res);
};

function removeJsonPrefix(text: string): Translations {
  text = text.trim();
  const prefixLength = 10;
  const prefix = text.slice(0, prefixLength).toLowerCase();
  if (prefix.includes("json")) {
    const jsonIndex = prefix.indexOf("json");
    text = text.slice(0, jsonIndex) + text.slice(jsonIndex + 4).trim();
  }
  if (text.startsWith("```")) {
    text = text.slice(3).trim();
  }
  if (text.endsWith("```")) {
    text = text.slice(0, -3).trim();
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    try {
      return eval(`(${text})`);
    } catch (evalError) {
      console.error("Failed to parse JSON:", error);
      return {};
    }
  }
}

export const gptExplain = async (text: string, selectedText: string): Promise<Translations> => {
  let prompts = explainPrompts["jp-ko"](text, selectedText);
  let options: AskGptOptions = {
    messages: [{ role: "user", content: prompts }],
    max_tokens: 1000,
    model: "gpt-4o",
    temperature: 0.1,
  };
  let message = {
    name: "gpt",
    body: {
      options: options,
    },
  };
  //@ts-ignore
  let req = await sendToBackground<RequestBody, ResponseBody>(message);
  if (req.error) {
    console.error(req.error);
    return {};
  }
  console.log(removeJsonPrefix(req.content));
  return removeJsonPrefix(req.content);
};
