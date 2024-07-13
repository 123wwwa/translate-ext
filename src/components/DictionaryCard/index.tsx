import React, { useState } from 'react';
import type { JishoResult } from '~shared/types/jishoTypes';
import DataCard from './DataCard';
import DropDown from './DropDown';

const DictionaryCard = ({ data }: { data: JishoResult }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="snap-center p-4 bg-gray-800 rounded-lg shadow-md flex items-center space-x-4 h-[150px] relative">
            <DataCard data={data} toggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)} />
            {isDropdownOpen && <DropDown data={data} closeDropdown={() => setIsDropdownOpen(false)} />}
        </div>
    );
};

export default DictionaryCard;
