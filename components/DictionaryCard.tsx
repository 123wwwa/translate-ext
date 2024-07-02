import * as wanakana from 'wanakana';
import type { JishoResult } from '~shared/types/jishoTypes';
const DictionaryCard = ({ data }: { data: JishoResult }) => {
    return (
        <div className="snap-center p-4 bg-gray-800 rounded-lg shadow-md flex items-center space-x-4">
            {data.type === "kanji" ? (
                <>
                    <div className="flex-none text-6xl font-bold text-center w-1/3">{data.text}</div>
                    <div className="flex-1">
                        <p className="text-xl mb-2">{data.meanings?.join(", ")}</p>
                        <div className="text-sm text-gray-400 space-y-1">
                            <p><strong>On:</strong> {data.onyomi?.join(", ")} ({wanakana.toRomaji(data.onyomi?.join(", "))})</p>
                            <p><strong>Kun:</strong> {data.kunyomi?.join(", ")} ({wanakana.toRomaji(data.kunyomi?.join(", "))})</p>
                            {data.jlpt && <p><strong>JLPT:</strong> {data.jlpt}</p>}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex-none text-2xl font-bold text-center w-1/3">{data.text}</div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-2">{data.reading} ({wanakana.toRomaji(data.reading)})</p>
                        <ol className="list-decimal list-inside space-y-1">
                            {data.meanings.map((sense: any, senseIndex: number) => (
                                <li key={senseIndex}>{sense.english_definitions.join(", ")}</li>
                            ))}
                        </ol>
                    </div>
                </>
            )}
        </div>
    );
};
export default DictionaryCard;