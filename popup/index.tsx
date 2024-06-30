import { getChromeStorage, setChromeStorage } from '~shared/storage';
import '../styles/global.css';
import React, { useEffect, useState } from "react";
import { useChromeStorage } from '~shared/hooks/useChromeStorage';
import { languages } from '~shared/constants/languageCode';

const IndexPopup: React.FC = () => {
  const [fromLanguage, setFromLanguage] = useChromeStorage("fromLanguage", "");
  const [toLanguage, setToLanguage] = useChromeStorage("toLanguage", "");
  const [apiKey, setApiKey] = useChromeStorage("apiKey", "");

  

  const handleSaveSettings = async () => {
    await setChromeStorage("fromLanguage", fromLanguage);
    await setChromeStorage("toLanguage", toLanguage);
    await setChromeStorage("apiKey", apiKey);
  };

  return (
    <div className="w-[200px] p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-2">GPT Translate</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">From</label>
        <div className="relative">
          <input
            type="text"
            list="languages"
            value={fromLanguage}
            onChange={(e) => setFromLanguage(e.target.value)}
            className="block w-full pl-3 py-1.5 text-sm border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          />
          <datalist id="languages">
            {Object.entries(languages).map(([lang, code], index) => (
              <option key={index} value={lang} />
            ))}
          </datalist>

        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">To</label>
        <div className="relative">
          <input
            type="text"
            list="languages"
            value={toLanguage}
            onChange={(e) => setToLanguage(e.target.value)}
            className="block w-full pl-3 py-1.5 text-sm border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          />
          <datalist id="languages">
            {Object.entries(languages).map(([lang, code], index) => (
              <option key={index} value={lang} />
            ))}
          </datalist>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">ChatGPT API</label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mt-1 block w-full pl-3 pr-8 py-1.5 text-sm border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
        />
      </div>
      <button
        onClick={handleSaveSettings}
        className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 transition duration-300"
      >
        Save Settings
      </button>
    </div>
  );
};

export default IndexPopup;
