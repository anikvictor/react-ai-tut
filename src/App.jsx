import { useState } from 'react'
import './App.css'
import { URL } from './constants';
import Answers from './components/Answers';

function App() {

  const [question, setQuestion] = useState('');
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(JSON.parse(localStorage.getItem('history')));

  const payload = {
    "contents": [
      {
        "parts": [
          {
            "text": question
          }
        ]
      }
    ]
  }

  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  }

  const askMe = async () => {
    if (localStorage.getItem('history')) {
      let history = JSON.parse(localStorage.getItem('history'));
      history = [question, ...history];
      localStorage.setItem('history', JSON.stringify(history))
      setRecentHistory(history)
    }
    else {
      localStorage.setItem('history', JSON.stringify(question));
      setRecentHistory([question])
    }

    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload)
    })

    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ");
    dataString = dataString.map((item) => item.trim());
    setResult([...result, { type: 'q', text: question }, { type: 'a', text: dataString }]);
  }

  return (
    <div classN ame='grid grid-cols-5 h-screen text-center'>
      <div className='col-span-1 bg-zinc-800 pt-3'>
        <h1 className='text-xl text-white flex text-center justify-center'>
          <span>Recent Search</span>  
          <button className='cursor-pointer' onClick={clearHistory}> 
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg>
          </button>
        </h1>
        <ul className='text-left overflow-auto mx-2'>
          {
            recentHistory && recentHistory.map((item)=>(
              <li className='pl-5 px-5 text-zinc-400 crusor-pointer hover:bg-zinc-700 hover:text-zinc-200'>{item}</li>
            ))
          }
        </ul>
      </div>
      <div className='col-span-4 p-10'>
        <div className='h-260 overflow-auto w-full'>
          <div className='text-zinc-300'>
            <ul>
              {
                result.map((item, index) => (
                  <div key={index + Math.random()} className={item.type == 'q' ? 'flex justify-end' : ''}>
                    {
                      item.type == 'q' ?
                        <li key={index + Math.random()} className='text-right p-1 border-8 bg-zinc-700 border-zinc-700 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit'>
                          <Answers ans={item.text} totalresult={result.length} key={index} type={item.type} /></li>
                        : item.text.map((ansItem, ansIndex) => (
                          <li key={ansIndex + Math.random()} className='text-left p-1'><Answers ans={ansItem} totalresult={result.length} key={ansIndex} type={item.type} /></li>
                        ))
                    }
                  </div>
                ))}

            </ul>
          </div>
        </div>
        <div className='bg-zinc-800 w-1/2 p-1 pr-5 text-white m-auto rounded-4xl border border-zinc-700 flex h-16'>
          <input type='text' placeholder='Ask me' value={question} onChange={(e) => setQuestion(e.target.value)} className='w-full h-full p-3 outline-none' />
          <button onClick={askMe} className='cursor-pointer'>Ask</button>
        </div>
      </div>
    </div>
  )
}

export default App
