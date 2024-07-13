import React, { useEffect, useState } from 'react';
import '../styles/global.css';
import { getAllWords, deleteWord } from '~shared/storage/dictionary';
import type { JishoResult } from '~shared/types/jishoTypes';
import DictionaryCard from '~components/DictionaryCard';

const IndexSidepanel: React.FC = () => {
  const [words, setWords] = useState<JishoResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      const allWords = await getAllWords();
      setWords(allWords);
      setLoading(false);
    };

    fetchWords();
  }, []);

  const handleDelete = async (text: string) => {
    await deleteWord(text);
    const updatedWords = words.filter(word => word.text !== text);
    setWords(updatedWords);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {words.length === 0 ? (
        <div className="text-center text-gray-500">No words saved.</div>
      ) : (
        words.map(word => (
          <div key={word.text} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
            <DictionaryCard data={word} />
            <button
              onClick={() => handleDelete(word.text)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default IndexSidepanel;
