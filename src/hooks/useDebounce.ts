import { useEffect, useState } from "react";

/**
 * useDebounce - delays updating a value until a specified delay has passed
 * @param value The value to debounce
 * @param delay Delay in milliseconds (default: 300ms)
 */
export const useDebounce = <T>(value: T, delay = 300): T => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};
