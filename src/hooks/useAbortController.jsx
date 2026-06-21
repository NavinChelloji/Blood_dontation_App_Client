import { useEffect, useRef } from "react";

export default function useAbortController() {
    const contrdollerRef = useRef(null);
    const getSignal = ()=>{
        contrdollerRef.current?.abort();
        contrdollerRef.current = new AbortController();
        return contrdollerRef.current.signal;
    }
    useEffect(()=>{
        return ()=>contrdollerRef.current?.abort();
    },[]);
    return {getSignal};
}