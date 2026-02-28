import React, { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../Context/Context'
import ReactMarkdown from 'react-markdown';

const Main = () => {

  const {onSent, recentPrompt, showResult, loading, resultData, setInput, input, handleKeyDown, startListening, stopGeneration, getGreeting, readingTime} = useContext(Context)

  return (
    <div className='main'>
      <div className="nav">
        <p>Chat Assistant</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        
        {!showResult
        ?<>

          <div className="greet">
            <p><span>{getGreeting()}, Kshitiz.</span></p>
            <p>How can I help you today?</p>
          </div>
          <div className="cards">
              <div className="card" onClick={() => onSent("Suggest some places for college trip with friends")}>
                  <p>Suggest some places for college trip with friends</p>
                  <img src= {assets.compass_icon} alt="" />
              </div>
              <div className="card" onClick = {() => onSent("Provide a brief debate on the topic : AI and its impact on Software Engineers")}>
                  <p>Provide a brief debate on the topic : AI and its impact on Software Engineers</p>
                  <img src= {assets.code_icon} alt="" />
              </div>
              <div className="card" onClick = {() => onSent("Extract the data and analyze it to explain market trends")}>
                  <p>Extract the data and analyze it to explain market trends</p>
                  <img src= {assets.bulb_icon} alt="" />
              </div>
            <div className="card" onClick = {() => onSent("Help me prepare for my control systems viva")}>
                  <p>Help me prepare for my control systems viva</p>
                  <img src= {assets.message_icon} alt="" />
              </div>
          </div>

        </> 
        :<div className='result'>
            <div className="result-title">
              <img src= {assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src= {assets.gemini_icon} alt="" />

              {!loading && readingTime > 0 && (
                <p style={{ fontSize: "12px", color: "gray", marginBottom: "5px" }}>
                ⏱️ {readingTime} min read
                </p>
              )}

              {loading
              ?(<div className='loader'>
                <p className="thinking-text">Gemini is processing your request...</p>
                <hr />
                <hr />
                <hr />
              </div>)
              : (<ReactMarkdown>{resultData}</ReactMarkdown>)
              }
              
            </div>
        </div>
        }

        <div className="main-bottom">
          
          <div className="search-box">
            
            <input onChange={(e) => setInput(e.target.value)} value = {input} onKeyDown = {handleKeyDown} type="text" placeholder='Enter a prompt here' />
            <div>
              <img src= {assets.gallery_icon} alt="" />
              <img src= {assets.mic_icon} onClick={startListening} alt="" />
              {loading ? (
                <img 
                src={assets.stop} 
                onClick={stopGeneration} 
                alt="Stop" 
                style={{ cursor: 'pointer', width: '24px' }} 
                /> )
              :
              (<img onClick = {() => onSent()} src= {assets.send_icon} alt="" />) 
              }
            </div>
          </div>
          <p className='bottom-info'>
            It may display inaccurate info, including about people, so double-check for better results
          </p>
        </div>
      </div>
    </div>
  )
}

export default Main
