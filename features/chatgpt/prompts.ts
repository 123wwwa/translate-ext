export const prompts = {
    "jp-ko": `다음 일본어를 한국어로 자연스럽게 번역하라
    번역문을 일련의 키-값 쌍으로 반환합니다. 여기서 각 키는 한국어로 번역된 단어 또는 구문이다,
    그리고 각 값은 일본어에서 해당하는 원래 단어 또는 구문이다.
    응답은 JSON.parse()를 사용하여 쉽게 변환할 수 있도록 해야합니다.
    한자인데 히라가나로 쓰여진 단어는 한자로 변환하라. 또한 한자와 히라가나가 같이 있으면 한자만 변환해라.
    원문을 절대 수정하지 마라. 또한 값의 길이가 10자를 초과하지 않도록 주의하라.
    예시: きょう今日はじゅうごや十五夜だ。秋のよぞら夜空のきよ清くす澄んだまんげつ満月が美しい。
    '{"오늘은": "今日は","중추절이다": "十五夜だ","가을의": "秋の","밤하늘의": "夜空の","맑고": "澄んだ","보름달이": "満月が","아름답다": "美しい"}'
    번역해야할 것:`,
    "jp-en": `Translate the Japenese into English in a natural order.
    Return the translation as a series of key-value pairs where each key is the translated word or phrase in english,
    and each value is the corresponding original word or phrase in the Japenese. 
    Ensure that the order of pairs reflects the natural order of the translated sentence in English.
    The response should be formatted so it can be easily converted using JSON.parse().
    Convert words that are Chinese characters but written in Hiragana into Chinese characters. 
    Also, if Chinese characters and Hiragana are together, convert only Chinese characters.
    Make sure not to modify the original text. Also be careful that the length of the value does not exceed 10 characters.
    Example:  きょう今日はじゅうごや十五夜だ。秋のよぞら夜空のきよ清くす澄んだまんげつ満月が美しい。
    '{"Today": "今日", "is": "は", "fifteenth night.": "十五夜だ。","The autumn": "秋", "night sky": "夜空","with": "の","clear": "清","and": "く", "serene": "澄","full moon": "満月","is beautiful.": "美しい。"}'
    Here is the input:`,
}
export const explainPrompts = {
    "jp-ko": (text, selection) => {
        return `다음 일본어에 대한 해석과 그에 대한 자연스러운 설명을 아래 형식으로 제공해줘.
    예시: 勉強はコスパ最強の遊びだ에서 "コスパ"의 의미 설명
    답변: {"meaning":"여기서 コスパ는 コストパフォーマンス (cost performance, 비용 대비 효율)의 줄임말로, 무언가의 가성비를 뜻합니다.",
    "reading": "こすぱ"}
    설명해야할 것: ${text}에서 ${selection}의 의미는 무엇인가요?`
    },
    "jp-en": (text, selection) => {
        return `Provide an interpretation of the following Japanese and a natural explanation of it.
    Example: From 勉強はコスパ最強の遊びだ  explain the meaning of "コスパ"
    Answer: {"meaning": "Here, コスパ is short for コストパフォーマンス (cost performance), meaning the cost performance ratio of something.",
    "reading": "こすぱ"}
    Explain: What does ${selection} mean in ${text}?`
    },

}