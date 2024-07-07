import { openDB, type IDBPDatabase } from 'idb';
import type { JishoResult } from '../types/jishoTypes';

const DB_NAME = 'DictionaryDB';
const STORE_NAME = 'WordBooks';
const VERSION = 1;

let db: IDBPDatabase | null = null;

const initDB = async (): Promise<void> => {
    if (!db) {
        db = await openDB(DB_NAME, VERSION, {
            upgrade(database) {
                if (!database.objectStoreNames.contains(STORE_NAME)) {
                    const store = database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                    store.createIndex('wordbook', 'wordbook', { unique: false });
                    store.createIndex('text', 'text', { unique: false });
                }
            },
        });
    }
};

export const saveWord = async (word: JishoResult, wordbook: string = 'Default word'): Promise<void> => {
    await initDB();
    if (db) {
        await db.put(STORE_NAME, { ...word, wordbook });
    }
};


export const getWord = async (text: string): Promise<JishoResult[]> => {
    await initDB();
    if (db) {
        const index = db.transaction(STORE_NAME).store.index('text');
        const allWords = await index.getAll();
        return allWords.filter(word => word.text === text);
    }
    return [];
};
export const getWordInWordBook = async (wordbook: string): Promise<JishoResult[]> => {
    await initDB();
    if (db) {
        const index = db.transaction(STORE_NAME).store.index('wordbook');
        return await index.getAll(wordbook);
    }
    return [];
};
export const getAllWords = async (wordbook?: string): Promise<JishoResult[]> => {
    await initDB();
    if (db) {
        const index = db.transaction(STORE_NAME).store.index('wordbook');
        if (wordbook) {
            return await index.getAll(wordbook);
        }
        return await db.getAll(STORE_NAME);
    }
    return [];
};

export const deleteWord = async (text: string, wordbook: string = 'Default word'): Promise<void> => {
    await initDB();
    if (db) {
        const index = db.transaction(STORE_NAME).store.index('text');
        const allWords = await index.getAll();
        const wordToDelete = allWords.find(word => word.text === text && word.wordbook === wordbook);
        if (wordToDelete) {
            await db.delete(STORE_NAME, wordToDelete.id);
        }
    }
};
export const getAllWordBookNames = async (): Promise<string[]> => {
  await initDB();
  if (db) {
    const index = db.transaction(STORE_NAME).store.index('wordbook');
    const allWords = await index.getAll();
    const wordbookNames = allWords.map(word => word.wordbook);
    return Array.from(new Set(wordbookNames));
  }
  return [];
};
export const clearAllWords = async (wordbook?: string): Promise<void> => {
    await initDB();
    if (db) {
        if (wordbook) {
            const index = db.transaction(STORE_NAME).store.index('wordbook');
            const allWords = await index.getAll(wordbook);
            for (const word of allWords) {
                await db.delete(STORE_NAME, word.id);
            }
        } else {
            await db.clear(STORE_NAME);
        }
    }
};
