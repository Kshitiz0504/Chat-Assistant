import { createContext, useState, useRef } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const isStoppedRef = useRef(false);
    const [readingTime, setReadingTime] = useState(0);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };
    
    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            if (isStoppedRef.current) {
                return; 
            }   
            setResultData(prev => prev + nextWord);
        }, 75*index)
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setInput("");
        setResultData("");
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSent();
        }
    };

    const startListening = () => {
        // Check if the browser supports this feature
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
        if (!SpeechRecognition) {
        alert("Browser not supported");
        return;
        }

        const recognition = new SpeechRecognition();
        
        // When you finish speaking, it puts the text in the input box
        recognition.onresult = (event) => {
            setInput(event.results[0][0].transcript); 
        };

        recognition.start();
    };

    const stopGeneration = () => {
        isStoppedRef.current = true;
        setLoading(false); 
    };

    const onSent = async (prompt) => {
        
        if (!input && !prompt) return;

        try {
            isStoppedRef.current = false;
            setResultData("");
            setLoading(true);
            setShowResult(true);
            let response;
            if(prompt !== undefined) {
                response = await runChat(prompt);
                setRecentPrompt(prompt)
            }
            else {
                setPrevPrompts(prev => [...prev, input])
                setRecentPrompt(input);
                response = await runChat(input);
            }
            
            if (response) {
                const wordCount = response.split(" ").length;
                const time = Math.ceil(wordCount / 200);
                setReadingTime(time);

                let newResponseArray = response.split(" ");
                for(let i = 0; i < newResponseArray.length; i++) {
                    const nextWord = newResponseArray[i];
                    delayPara(i, nextWord + " ")
                }
            } 
            else {
                setResultData("The AI couldn't generate a response. Please try again.");
            }

            const wordCount = response.split(" ").length;
            const readTime = Math.ceil(wordCount / 200);
            console.log(`This will take about ${readTime} minute(s) to read.`);

            setLoading(false)
            setInput("")

        } catch (error) {
            console.error("Gemini Error:", error);
            setResultData("Something went wrong.");
        } 
        finally {
            setLoading(false);
            setInput(""); 
        }

    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        handleKeyDown,
        startListening,
        stopGeneration,
        getGreeting,
        readingTime,
        setReadingTime 
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;