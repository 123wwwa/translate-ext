import React from 'react';
import * as wanakana from 'wanakana';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { JishoResult } from '~shared/types/jishoTypes';
import RenderMeaning from './RenderMeaning';

const DataCard = ({ data, toggleDropdown }: { data: JishoResult, toggleDropdown: () => void }) => {
    const SaveButton = () => {
        return (
            <span
                onClick={toggleDropdown}
                className={`inline-flex items-center justify-center cursor-pointer px-2 py-1 rounded bg-white hover:bg-gray-300`}
            >
                <span className="text-sm text-blue-500">Save</span>
                <FontAwesomeIcon icon={faPlus} className="ml-1 text-blue-500" style={{ width: 16, height: 16 }} />
            </span>
        );
    };

    switch (data.type) {
        case "kanji":
            return (
                <>
                    <div className="flex-none text-6xl font-bold text-center w-1/3 h-full flex flex-col justify-between">
                        <div className="flex-grow flex text-white items-center justify-center">{data.text}</div>
                        <SaveButton />
                    </div>
                    <div className="flex-1">
                        <RenderMeaning meanings={data.meanings} />
                        <div className="text-sm text-gray-400 space-y-1">
                            <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><strong>On:</strong> {data.onyomi?.join(", ")} ({wanakana.toRomaji(data.onyomi?.join(", "))})</p>
                            <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><strong>Kun:</strong> {data.kunyomi?.join(", ")} ({wanakana.toRomaji(data.kunyomi?.join(", "))})</p>
                            {data.jlpt && <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><strong>JLPT:</strong> {data.jlpt}</p>}
                        </div>
                    </div>
                </>
            );
        case "phrase":
            return (
                <>
                    <div className="flex-none text-2xl font-bold text-center w-1/3 h-full flex flex-col justify-between">
                        <div className="flex-grow flex text-white items-center justify-center">{data.text}</div>
                        <SaveButton />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{data.reading} ({wanakana.toRomaji(data.reading)})</p>
                        <RenderMeaning meanings={data.meanings.map((sense: any) => sense.english_definitions.join(", "))} />
                    </div>
                </>
            );
        case "gpt-explain":
            return (
                <>
                    <div className="flex-none text-2xl font-bold text-white text-center w-1/3 h-full flex flex-col justify-between">
                        <div className="flex-grow flex items-center justify-center">{data.text}</div>
                        <SaveButton />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{data.reading} ({wanakana.toRomaji(data.reading)})</p>
                        <RenderMeaning meanings={data.meanings} />
                    </div>
                </>
            );
        default:
            return null;
    }
};

export default DataCard;
