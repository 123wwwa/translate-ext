import { useEffect, useState } from "react";
import { getChromeStorage } from "~shared/storage";

export const useChromeStorage = (key, defaultValue) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        const loadValue = async () => {
            const storedValue = await getChromeStorage(key, defaultValue);
            setValue(storedValue);
        };
        loadValue();
    }, [key, defaultValue]);

    return [value, setValue];
};