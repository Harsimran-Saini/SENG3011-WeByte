import React, { useState } from 'react';
import TrendGraph from './TrendGraph.js';


export default function TrendGraphWrapper(props) {
    const [value, setValue] = useState("");
    const [keyword, setKeyword] = useState("");

    return (
        <>
            <form onSubmit={(event) => {event.preventDefault(); setKeyword(value)}}>
                <label>
                    Keyword:
                    <input type="text" 
                    value={value}
                    onChange={e => setValue(e.target.value)}/>
                </label>
                <input type="submit" value="Display" />
            </form>
            <TrendGraph state={{ keyword: [keyword, setKeyword] }}/>
        </>
    );
}