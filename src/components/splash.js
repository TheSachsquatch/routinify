import React from 'react'
import devices from "./devices-01.jpg"
import routine from "./average_routine.JPG"
export default function Splash() {

  return (
      <body className = "bg-black shadow font-Helvetica-Neue">
           <div className = "grid">
                <div className = "ml-10 big_text text-white font-semibold justify-self-center fixed top-0 bg-black w-full text-center">
                        Routinify
                </div>
                <div className = "text-4xl text-white mt-14 px-20 justify-self-center rounded-md pt-52">
                    The website to simplify working out
                </div>
                <img src = {routine} className= "w-1/2 justify-self-center shadow-md mt-10" alt = "routine" />
                <div className = "text-4xl text-white mt-20 px-20 justify-self-center">
                    Make new routines and progress week by week
                </div>
               
                <div className = "text-4xl text-white mt-20 px-20 justify-self-center">
                    Find form tips for any exercise
                </div>
                <button className = "mt-20 text-white hover:text-slate-50 text-7xl !px-3 !py-5 mb-10 justify-self-center hover:text-gray-400" onClick = {event => window.location.href = '/dashboard'}>
                    Start routinifying here
                </button>
                <div className = "text-4xl text-white mt-20 px-20 justify-self-center">
                    Made for Mobile
                </div>
                <img src = {devices} className = "mt-10 w-1/6 justify-self-center shadow-md rounded" alt = "devices" />
            </div>
            <div className = "h-40">

            </div>
            <div className = "bg-white grid pl-5 text-xl py-10 footer">
                A Sachin Vijayaraj website
            </div>
      </body>
        
   
  )
}
