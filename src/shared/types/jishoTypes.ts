export type JishoResult = {
    isDict: boolean,
    text: string,
    type?: string,
    reading?: string,
    meanings?: any[],
    onyomi?: string[],
    kunyomi?: string[],
    jlpt?: string,
}