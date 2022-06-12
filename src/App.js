import React, {useState} from "react";
import "./App.css";
import Dashboard from './components/Dashboard';
import Axios from 'axios';
import Login from "./components/Login";
import Logo from "./components/logo_routine.png";
import moment from 'moment'
import Video from './components/video'
import {AiFillHome} from "react-icons/ai"
import {RiAddFill, RiArrowDownSLine, RiArrowUpSLine} from "react-icons/ri"

const App = () =>{

    const exercises_data = [
      {
          exercise: 'bench press',
          sets: '3',
          reps: '3',
          weight: '185',
          inc: '5'
      },
      {
        exercise: 'overhead press',
        sets: '4',
        reps: '3',
        weight: '100',
        inc: '5'
    }   
    ]

  const days = [{ monday: [],
    tuesday: [],
    wednesday:  [],
    thursday:  [],
    friday:  [],
    saturday:  [],
    sunday:  []}, { 
          monday: exercises_data,
          tuesday:  [],
          wednesday:  [],
          thursday:  [],
          friday:  [],
          saturday:  [],
          sunday:  [],
  }]

  const[inputs, setInputs] = useState(days);
  const [showVideo, setShowVideo] = useState("");
  const [rtList, setRtList]= useState(["Default"]);
  const [show,setShow] = useState(false);
  const [registerStatus, setRegisterStatus] = useState(false);
  const [loginStatus, setLoginStatus] = useState("");
  const [routine, setRoutine] = useState("Default");
  const [formData, updateFormData] = useState("");
  const[add, setAdd] = useState(false);
  const[isLogging, setisLogging] = useState(true);
  var today = moment().format('M/D')
  const[date, setDate] = useState(today);
  const isUser= loginStatus === "" ? "login" : loginStatus;
  const isLog = loginStatus !=="";
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const URL = process.env.REACT_APP_SERVER_URL;
  const startRegister=()=>{
    setisLogging(false);
  }

  function createRoutines(list){
    Axios.post(URL + '/record/routines', {
      user: isUser,
      routine: list,
    }).then((response)=>{
        if(response){
            console.log(response);
        }
    })
  }

  function updateRoutines(lst){
    Axios.put(URL + '/record/update/routine',{
        user: loginStatus, 
        routine: lst,
    }).then((response)=>{
        if(response){
          console.log(response);
        }
    });
  }

  const doChange = (e) =>{
    updateFormData( e.target.value.trim())
  }

  const doSubmit = (e) =>{
    e.preventDefault();
    let list = rtList.slice();
    list.push(formData);
    setRtList(list);
    console.log(list);
    console.log(rtList);
    Axios.get(URL + '/record/routines',{
      params:{
        user: loginStatus
      }
    }).then((response)=>{
        if(response.data!==null){
          updateRoutines(list);
        }
        else{
          createRoutines(list);
        }
    })
    setRoutine(formData);
    setAdd(false);
  }

  const showLogin = () =>{
      setShow(true);
  }
  const hideLogin = () =>{
      setisLogging(true);
      setShow(false);
      setRegisterStatus(false);
  }

  const changeRoutine = (event) =>{
      setRoutine(event.target.value);
      if(loginStatus!== ""){
        Axios.get(URL + '/record/user',{
        params:{
            user: loginStatus, 
            routine: event.target.value
        }
        }).then((response)=>{
            if(response.data!==null){
                setInputs(response.data.data);
                setDate(response.data.date);
            }
            else{
              Axios.post(URL + '/record/add', {
                  user: loginStatus,
                  routine: event.target.value,
                  date: date,
                  data: inputs
              }).then((res)=>{
                  if(res){
                      console.log(res);
                  }
              })
            }
        });
      }
  }
  
  const addRtn = (e) =>{
    e.preventDefault();
    setAdd(true);
  }

  const stopAdd = (e) =>{
    e.preventDefault();
    setAdd(false);
  }
  const deleteRtn = (e) =>{
    e.preventDefault();
    const index = rtList.findIndex((rtn) => rtn===routine);
    const oldRtn = routine.slice();
    let lst = ["Default"];
    if(rtList.length===1){
      setRoutine("Default");
    }
    else if(index===rtList.length-1){
      setRoutine(rtList[index-1]);
      rtList.splice(index, 1);
      lst = rtList.slice();
    }
    else{
      setRoutine(rtList[index+1]);
      rtList.splice(index, 1);
      lst = rtList.slice();
    }
    Axios.delete(URL + '/record/delete',{
      params:{
        user: loginStatus,
        routine: oldRtn
      }
    }).then((response)=>{
        console.log(response);
    })
    
    console.log(lst);
    setRtList(lst);
    updateRoutines(lst);
    
  }

  const logOut = () =>{
    sessionStorage.clear();
    setLoginStatus("");
  }
  var wrapper = show? "wrapper blur-lg" : "wrapper";
  if(showVideo){
    wrapper = "wrapper blur-md";
  }
    return(
      <div>
          <div className = "grid bg-zinc-900">
                  <button className = "btn !py-3 my-3 ml-2 grid justify-items-center w-20" onClick = {event => window.location.href = '/'} > 
                    <AiFillHome size = {40}/>
                  </button>
                  <button className = "mt-3 shadow-md btn mr-5 text-3xl col-start-12 col-end-13 mb-3 !py-3" onClick = {showLogin}> {isUser} </button >
                  {
                    isLog? <button className = "mt-3 mr-3 mb-3 shadow-md btn text-xl col-start-13 col-end-14 col-span-1 !py-3" onClick = {logOut} > logout </button> : null
                  }
          </div>
          <Login open = {show} setShow = {setShow} close = {hideLogin} regStatus= {setRegisterStatus} reg = {registerStatus} loginStatus = {loginStatus} 
          setLoginStatus = {setLoginStatus} className routines = {setRtList} setRt = {setRoutine} setInputs = {setInputs} startRegister = {startRegister} isLogging ={isLogging} setisLogging = {setisLogging}
          CLIENT_ID = {CLIENT_ID} setDate= {setDate} URL = {URL}/>
          <Video setShowVideo = {setShowVideo} showVideo = {showVideo} URL = {URL}/>
            <div className= {wrapper}>
            <div className = "grid">
              <div className = "grid grid-flow-col auto-cols-max">
                <div className="text-left mt-1 ml-3 title_text font-bold justify-self-start mr-3 align-baseline">Routinify  </div>
                <img src = {Logo} alt = "Logo" className = "mt-1 width_img align-baseline"/>
              </div>
              
              {
                isLog ?<div className = "justify-self-end">
                  <div className = "grid">
                      {!add ? <button className = "btn justify-self-end mr-5" onClick = {addRtn}>
                          <RiArrowDownSLine size = {20}/>
                      </button> :  <button className = "btn justify-self-end mr-5 !" onClick = {stopAdd}>
                              <RiArrowUpSLine size = {20}/>
                            </button>}
                      
                      <select onChange= {changeRoutine} className= "justify-self-end text-2xl mr-5 shadow-md rounded-md px-3 py-3 bg-gray-100" value = {routine}>
                        {rtList.map((routine,i)=>{
                          return <option value = {routine} className = "rounded"> {routine}</option>
                        })
                        }
                      </select>
                  </div>
                  {add ? <form className = "grid justify-items-stretch shadow-sm shadow-zinc-300 rounded-md bg-zinc-200 mt-2">
                          <div>
                            <button className = "btn-green !px-1" onClick = {doSubmit}>
                              <RiAddFill size = {20}/>
                            </button>
                          </div>
                          <div className =  "mb-2 justify-self-center">
                            <input type = "text" id = "routine" name = "routine" placeholder = "Add new routine" onChange = {doChange} className = "bg-zinc-200 text-center mt-2">
                            </input>
                          </div>
                        </form> : null
                  }
                  </div>
                  : null
              }
            </div>
            <Dashboard routine = {routine} user = {loginStatus} inputs = {inputs} setInputs = {setInputs} deleteRtn = {deleteRtn} date = {date} setDate = {setDate} setShowVideo = {setShowVideo} URL = {URL}/>
            
          </div>
      </div>
       
    );
};

export default App;