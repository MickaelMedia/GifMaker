import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";
const ffmpeg= createFFmpeg({ log:true}); 

function App() {

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  const [time, setTime] =useState();
  const [duration, setDuration] = useState();

  const load = async ()=>{
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() =>{
    load();
  }, [])

  const convertToGif = async() =>{
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video));

    await ffmpeg.run("-i", "test.mp4", "-t", duration, "-ss", time, "-f", "gif", "out.gif");
    // -t stands for time of the gif and -ss stands for delay.

    const data = ffmpeg.FS("readFile", "out.gif");

    const url = URL.createObjectURL(new Blob([data.buffer], { type: "image/gif"}));
    setGif(url)
  }

  return ready ? (
    <div className="App">
      {video && <video controls width="250" src={URL.createObjectURL(video)}></video>} <br/>
      
       <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))}/>
       <br />
       <p>Delay (time to start at)</p><input type="text" onChange={(e) => setTime(e.target.value)}/>
       <br />
       <p>Duration </p><input type="text" onChange={(e) => setDuration(e.target.value)}/>
      <p>the duration is {duration} and delay is {time}</p>
       <h3>Result </h3>

       <button onClick={convertToGif}>Convert</button> <br/>

       {gif &&<img src={gif} width="250"/>}

       <p>For video reference check out :</p>
       <p><a href="https://www.youtube.com/watch?v=-OTc0Ki7Sv0&list=WL&index=9">https://www.youtube.com/watch?v=-OTc0Ki7Sv0&list=WL&index=9</a></p>

    </div>
  ) :
  (<p>Loading ...</p>);
}

export default App;
