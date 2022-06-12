import React from 'react'
import * as Axios from 'axios';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {ThreeDots} from 'react-loader-spinner';
import {TiTimes} from 'react-icons/ti'
import { IconContext } from "react-icons";

function Video({showVideo, setShowVideo, URL}) {

    const [url, setUrl] = React.useState("");
    const removeVideo = (e)=>{
        e.preventDefault();
        setUrl("");
        setShowVideo("");
    }
    const apiLoad = url==="";
    function getVideo(){
        Axios.get(URL + "/videos/video", {
            params: {
                exercise: showVideo
            }
        }).then((response)=>{
            console.log(response);
            if(response.data!==null){
                setUrl(response.data.video);
            }
            else{
                Axios.post(URL + "/videos/videoscrape", {
                    exercise: showVideo
                }).then((resp)=>{
                    console.log(resp);
                    if(resp.data!==null){
                        setUrl(resp.data.video);
                    }
                })
            }
        })
    }
    if(showVideo!== ""){
        getVideo();
    }

    if(showVideo!== ""){
        return (
            <div className = "grid justify-items-stretch w-4/6 fixed modal">
                <button className = "grid justify-items-center btn-red" onClick = {removeVideo}>
                <IconContext.Provider value={{ color: "black" }}>
                    <div>
                        <TiTimes size = {30}/>
                    </div>
                </IconContext.Provider>
                </button>
                
                {apiLoad?  <div className = "grid justify-items-center bg-neutral-100 py-32 relative">
                    <ThreeDots color = "#384345" height = {80} width = {80}> </ThreeDots>
                </div>:  <div className = "video">
                            <iframe class = "responsive-iframe" src  = {url} title = "exercise_video"></iframe>
                         </div>
                }
               
            </div> 
        )
    }
}

export default Video;
