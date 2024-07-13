import type { PlasmoMessaging } from "@plasmohq/messaging"
import JishoAPI from 'unofficial-jisho-api';
import type { JishoResult } from "~shared/types/jishoTypes";
const jisho = new JishoAPI();
export type RequestBody = {
    tokens: any[]
}

export type ResponseBody = {
    data: JishoResult[]
}

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {
    let tokens = req.body.tokens;
    const results = await Promise.all(tokens.map(async (token) => {
        try {
            if (token.surface_form.length !== 1) {
                // If the token is not a single character, search for phrase
                if (/^\d+$/.test(token.surface_form)) {
                    return {
                        isDict: false,
                        text: token.surface_form,
                    }
                }
                const result = await jisho.searchForPhrase(token.surface_form);
                return {
                    "isDict": true,
                    "type": "phrase", // Add type "phrase" to distinguish from "kanji"
                    "text": token.surface_form,
                    "reading": result.data[0].japanese[0].reading,
                    "meanings": result.data[0].senses,
                }
            }
            if (/^[\u4e00-\u9faf]$/.test(token.surface_form)) {
                // If the token is a kanji, search for kanji
                const result = await jisho.searchForKanji(token.surface_form);
                return {
                    "isDict": true,
                    "type": "kanji", // Add type "kanji" to distinguish from "phrase
                    "text": token.surface_form,
                    "reading": token.reading,
                    "meanings": [result.meaning],
                    "onyomi": result.onyomi,
                    "kunyomi": result.kunyomi,
                    "jlpt": result.jlptLevel,
                }; // Return both the token and the result
            } else if (/^[\u3040-\u309F]$/.test(token.surface_form) || /^[\u30A0-\u30FF]$/.test(token.surface_form)) {
                const result = await jisho.searchForPhrase(token.surface_form);
                return {
                    "isDict": true,
                    "type": "phrase", // Add type "phrase" to distinguish from "kanji"
                    "text": token.surface_form,
                    "reading": result.data[0].japanese[0].reading,
                    "meanings": result.data[0].senses,
                }
            }
            else { // If the token is not a kanji, return null
                return {
                    "isDict": false,
                    "text": token.surface_form,
                }
            }
        } catch (error) {
            console.error(`Error fetching data for ${token}:`, error);
            return { "isDict": false, "text": token.surface_form };
        }
    }));

    res.send({ data: results });
}
export default handler;