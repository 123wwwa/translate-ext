import type { JishoResult } from "~shared/types/jishoTypes";
import { Storage } from "@plasmohq/storage";

export const storage = new Storage({
    area: "local"
});

const KEYS_LIST = 'KEYS_LIST';

// Helper function to manage the list of keys
const addKeyToList = async (key: string) => {
    const keys = await getChromeStorage(KEYS_LIST, []);
    if (!keys.includes(key)) {
        keys.push(key);
        await setChromeStorage(KEYS_LIST, keys);
    }
};

const removeKeyFromList = async (key: string) => {
    const keys = await getChromeStorage(KEYS_LIST, []);
    const filteredKeys = keys.filter((storedKey: string) => storedKey !== key);
    await setChromeStorage(KEYS_LIST, filteredKeys);
};

export const saveWord = async (word: JishoResult, wordbook: string = 'DefaultWordbook'): Promise<void> => {
    const wordbookData = await getChromeStorage(wordbook, []);
    const isDuplicate = wordbookData.some(
        (storedWord: JishoResult) => storedWord.type === word.type && storedWord.text === word.text
    );

    if (!isDuplicate) {
        wordbookData.push(word);
        await setChromeStorage(wordbook, wordbookData);
        await addKeyToList(wordbook);
    } else {
        console.log(`The word "${word.text}" of type "${word.type}" already exists in the wordbook "${wordbook}".`);
    }
};

export const isWordStored = async (word: JishoResult): Promise<string[]> => {
    const allKeys = await getChromeStorage(KEYS_LIST, []);
    const wordbooksContainingWord: string[] = [];

    for (const key of allKeys) {
        const wordbookData = await getChromeStorage(key, []);
        const isStored = wordbookData.some(
            (storedWord: JishoResult) => storedWord.type === word.type && storedWord.text === word.text
        );
        if (isStored) {
            wordbooksContainingWord.push(key);
        }
    }

    return wordbooksContainingWord;
};

export const getWord = async (text: string): Promise<JishoResult[]> => {
    const allKeys = await getChromeStorage(KEYS_LIST, []);
    const allWords = await Promise.all(allKeys.map(async (key: string) => {
        const value = await storage.get(key);
        return value ? JSON.parse(value) : [];
    }));
    return allWords.flat().filter(word => word.text === text);
};

export const getWordInWordBook = async (wordbook: string): Promise<JishoResult[]> => {
    return await getChromeStorage(wordbook, []);
};

export const getAllWords = async (): Promise<JishoResult[]> => {
    const allKeys = await getChromeStorage(KEYS_LIST, []);
    const allWords = await Promise.all(allKeys.map(async (key: string) => {
        const value = await storage.get(key);
        return value ? JSON.parse(value) : [];
    }));
    return allWords.flat();
};

export const deleteWord = async (text: string, wordbook: string = 'DefaultWordbook'): Promise<void> => {
    const wordbookData = await getChromeStorage(wordbook, []);
    const updatedWordbookData = wordbookData.filter(word => word.text !== text);
    await setChromeStorage(wordbook, updatedWordbookData);
    if (updatedWordbookData.length === 0) {
        await removeKeyFromList(wordbook);
    }
};

export const getAllWordBookNames = async (): Promise<string[]> => {
    return await getChromeStorage(KEYS_LIST, []);
};

export const clearAllWords = async (wordbook?: string): Promise<void> => {
    if (wordbook) {
        await storage.remove(wordbook);
        await removeKeyFromList(wordbook);
    } else {
        const allKeys = await getChromeStorage(KEYS_LIST, []);
        await Promise.all(allKeys.map(key => storage.remove(key)));
        await storage.remove(KEYS_LIST);
    }
};

export const setChromeStorage = async (key: string, value: any) => {
    try {
        await storage.set(key, JSON.stringify(value));
    } catch (e) {
        console.log(e);
    }
};

export const getChromeStorage = async (key: string, defaultValue: any) => {
    const data = await storage.get(key);
    if (!data) {
        return defaultValue;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
};
