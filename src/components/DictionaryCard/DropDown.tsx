import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useForm, Controller } from 'react-hook-form';
import { getAllWordBookNames, saveWord, isWordStored } from '~shared/storage/dictionary';
import type { JishoResult } from '~shared/types/jishoTypes';
import { usePort } from "@plasmohq/messaging/hook";

const DropDown = ({ data, closeDropdown }: { data: JishoResult, closeDropdown: () => void }) => {
    const { control, handleSubmit, reset } = useForm();
    const [wordBooks, setWordBooks] = useState<string[]>([]);
    const [selectedWordBook, setSelectedWordBook] = useState<string>('Default word');
    const [newWordBook, setNewWordBook] = useState<string>('');
    const [alreadySaved, setAlreadySaved] = useState<boolean>(false);
    const [existingWordBooks, setExistingWordBooks] = useState<string[]>([]);
    const sidePanelPort = usePort("sidepanel");

    useEffect(() => {
        const fetchWordBooks = async () => {
            const wordBooks = await getAllWordBookNames();
            setWordBooks(wordBooks);
            const storedWordBooks = await isWordStored(data);
            setExistingWordBooks(storedWordBooks);
            setAlreadySaved(storedWordBooks.length > 0);
        };
        fetchWordBooks();
    }, [data]);

    const saveData = async (data: JishoResult, wordbook: string) => {
        await saveWord(data, wordbook);
    };

    const openSidePanel = () => {
        sidePanelPort.send({});
    }

    const onSubmit = async (formData: any) => {
        const wordbook = formData.wordbook === 'new' ? newWordBook : formData.wordbook;
        await saveData(data, wordbook);
        reset();
        closeDropdown(); // Close dropdown after saving
    };

    return (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <div className="flex justify-between p-2 border-b border-gray-200">
                <h3 className="text-gray-700">단어장 선택</h3>
                <div>
                    <button onClick={openSidePanel}>
                        <FontAwesomeIcon icon={faSave} className="text-gray-700" style={{ width: 16, height: 16 }} />
                    </button>
                    <button onClick={closeDropdown}>
                        <FontAwesomeIcon icon={faTimes} className="text-gray-700" style={{ width: 16, height: 16 }} />
                    </button>
                </div>
            </div>
            {alreadySaved && (
                <div className="p-2 text-red-500">
                    Already saved in: {existingWordBooks.join(', ')}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="p-2">
                <div className="mb-2">
                    {wordBooks.map((wordbook, index) => (
                        <div key={index} className="flex items-center mb-1">
                            <Controller
                                name="wordbook"
                                control={control}
                                defaultValue={selectedWordBook}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="radio"
                                        value={wordbook}
                                        checked={field.value === wordbook}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setSelectedWordBook(e.target.value);
                                        }}
                                    />
                                )}
                            />
                            <label className={`ml-2 ${existingWordBooks.includes(wordbook) ? 'text-red-500' : 'text-gray-700'}`}>
                                {wordbook}
                            </label>
                        </div>
                    ))}
                    <div className="flex items-center mb-1">
                        <Controller
                            name="wordbook"
                            control={control}
                            defaultValue={selectedWordBook}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="radio"
                                    value="new"
                                    checked={field.value === 'new'}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setSelectedWordBook(e.target.value);
                                    }}
                                />
                            )}
                        />
                        <label className="ml-2 text-gray-700">새 단어장</label>
                        {selectedWordBook === 'new' && (
                            <input
                                type="text"
                                value={newWordBook}
                                onChange={(e) => setNewWordBook(e.target.value)}
                                className="ml-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-black"
                            />
                        )}
                    </div>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-1 rounded">
                    저장하기
                </button>
            </form>
        </div>
    );
};

export default DropDown;
