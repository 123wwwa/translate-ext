import React, { useState, useRef, useEffect } from 'react';

const RenderMeaning = ({ meanings }: { meanings: string[] }) => {
    const [showFullMeaning, setShowFullMeaning] = useState(false);
    const meaningRef = useRef<HTMLDivElement>(null);
    const [isClamped, setIsClamped] = useState(false);

    useEffect(() => {
        if (meaningRef.current) {
            setIsClamped(meaningRef.current.scrollHeight > meaningRef.current.clientHeight);
        }
    }, [meaningRef, meanings]);

    const toggleShowFullMeaning = () => {
        setShowFullMeaning(!showFullMeaning);
    };

    const joinedMeanings = meanings.join(", ");
    return (
        <div>
            <div ref={meaningRef} className={`overflow-hidden text-white ${showFullMeaning ? 'max-h-full overflow-y-auto' : 'max-h-[4.5em] overflow-hidden'}`}>
                <p className="text-ellipsis" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: showFullMeaning ? 'none' : '3', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {joinedMeanings}
                </p>
            </div>
            {isClamped && (
                <span className="text-blue-500 cursor-pointer" onClick={toggleShowFullMeaning}>
                    {' '}
                    {showFullMeaning ? '간략히 보기' : '더보기'}
                </span>
            )}
        </div>
    );
};

export default RenderMeaning;
