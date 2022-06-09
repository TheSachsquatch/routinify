import React, {useEffect, useState } from 'react'
import Exercise from './Exercise'
import NewExercise from './NewExercise'
import * as Axios from 'axios';
import {IconContext } from "react-icons";
import {TiChevronLeft} from 'react-icons/ti';
import {TiChevronRight} from 'react-icons/ti';
import {RiEditFill} from "react-icons/ri"
import {RiSaveLine} from "react-icons/ri"
import {RiCloseFill} from "react-icons/ri"
import moment from 'moment'

function Timetable({routine, user, inputs, setInputs, deleteRtn, date, setDate, setShowVideo, URL}) {
    
    const isLog = user!=="";
    const[timeGrid,setTimeGrid]=useState("grid grid-cols-7");
    const[mob, setMob] = useState(false);
    const[week, setWeek]  = useState(1);
    const [dateData, updateDateData] = React.useState("");

    const dateChange = (e) =>{
        updateDateData({...dateData,
        [e.target.name]: e.target.value.trim()
        })
    }

    const checkSubmit = (e) =>{
        if(e.key==='Enter'){
            e.preventDefault();
            console.log(dateData.date);
            if(dateData){
                setDate(dateData.date);
            }
            Axios.put(URL + '/record/update/date',{
                user: user, 
                routine: routine,
                date: dateData.date
            }).then((response)=>{
                console.log(response);
            })
        }
    }

    function detectMobTest() {
        console.log(mob);
        return ( ( window.innerWidth <= 1545 ));
    }
    const canGoPrevWeek = week>1;
    useEffect( () => {
        function handleResize(){
            if(detectMobTest() ){
                setTimeGrid ("grid ");
                setMob(true);
            }
            else{
                setTimeGrid ("grid grid-cols-7");
                setMob(false);
            }
        }
        window.addEventListener('resize', handleResize);
    })

    function createExercises(){
        Axios.post(URL + '/record/add', {
            user: user,
            routine: routine,
            data: inputs
        }).then((response)=>{
            if(response){
                console.log(response);
            }
        })
    }
    
    function editExercises(){
        Axios.put(URL + '/record/update', {
            user: user, 
            routine: routine,
            data: inputs
        }).then((response)=>{
            if(response){
                console.log(response);
            }
        })
    }

    const nextWeek = (e) =>{
        const newWeek = week+1;
        console.log(newWeek);
        console.log(inputs);
        console.log(inputs.length-1);
        if(newWeek> inputs.length-1 ){
            let exercises_data= [...inputs]
            exercises_data.length++;
            exercises_data[newWeek] = {
                monday: [],
                tuesday:[],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: [],
            }
            for(const [day, value] of Object.entries(exercises_data[week])){
                if(value!==null){
                    let newValue = value.slice();
                    for(var i =0; i< value.length; i++){
                        let newV = {...newValue[i]}
                        let curWeight = parseInt(newValue[i].weight)
                        let inc = parseInt(value[i].inc);
                        let newVal = (curWeight+inc).toString();
                        newV.weight= newVal;
                        newValue[i] = newV;
                    }
                    exercises_data[newWeek][day] = newValue;
                }
            }
            console.log(exercises_data);
            setInputs(exercises_data);
            if(isLog){
                editExercises();
            }
            
        }
        
        setWeek(newWeek);
    }

    const prevWeek = (e) =>{
        const prevWeek = week-1;
        setWeek(prevWeek);
    }
    const[edit, updateEdit] = React.useState(true);
    
    const Exer = ({day}) =>{
        
        const [showNew, setShowNew] = React.useState(false);
        const onClick = () => setShowNew(true)
        return(
            <div>
                {showNew ? <NewExercise props = {onClick} setShowNew ={setShowNew} exercises_data = {inputs} updateExercises = {setInputs} day = {day} week = {week}/> : 
                    <div className = "grid mt-2 !justify-self-stretch">
                        <button className = "btn" onClick = {onClick}>
                            +
                        </button>
                    </div> 
                }
            </div>
        )
    }

    const Edit = () =>{
        const onClick = () => updateEdit(false);
        const stopEdit = () => {
            updateEdit(true);
            if(user!==""){
                Axios.get(URL + '/record/user',{
                    params:{
                        user: user, 
                        routine: routine
                    }
                }).then((response)=>{
                    if(response.data!==null){
                        setInputs(response.data.data);
                    }
                    else{
                        return null;
                    }
                });
            }
        }
        const saveEdit = () =>{
            updateEdit(true);
            if(user!== ""){
                Axios.get(URL + '/record/user',{
                    params:{
                        user: user, 
                        routine: routine
                    }
                }).then((response)=>{
                    if(response.data!==null){
                        editExercises();
                    }
                    else{
                        createExercises();
                    }
                });
            }
        }
        return(
            edit ? <button className= "text-xl mb-2 btn justify-start col-start-1" onClick = {onClick}>  <div className = "grid justify-items-center">
                <RiEditFill size = {20} /> </div> </button> :
                <div>
                    <button className= "text-xl mb-2 btn-red justify-start" onClick = {stopEdit}> <RiCloseFill size = {28}/> </button>
                    <button className= "text-xl ml-2 mb-2 btn-green justify-start" onClick = {saveEdit}>
                            <RiSaveLine size = {28} />
                    </button>
                </div>     
        )
    }
    
    const DateCalculate = ({num}) =>{
        var dateObj = new Date(date);
        var momentObj = moment(dateObj);
        momentObj.add(num+(week-1)*7, 'day');
        return(
            <div className = "dates !pt-0">
                {momentObj.format('M/D')}
            </div>
        )
    }
   
    const Day = ({day, i}) =>{
        return(
            <div>
                <div className="dates"> 
                    {day}
                </div>
                <DateCalculate num = {i} />
                <Exercise exercises= {inputs} updateExercises = {setInputs} day = {day.toLowerCase()} week = {week} edit = {edit} setShowVideo = {setShowVideo}/>
                {!edit ? <Exer day = {day.toLowerCase()} week = {week}/> : null }
            </div>
        );
    }
    const Week = () =>{
        return(
            <div className = {timeGrid}>
                <Day day = "Monday" i = {0} />
                <Day day = "Tuesday" i = {1} />
                <Day day = "Wednesday" i = {2} />
                <Day day = "Thursday" i = {3} />
                <Day day = "Friday" i = {4} />
                <Day day = "Saturday" i = {5} />
                <Day day = "Sunday" i = {5} />
            </div>
        );
    }

    return (
        <div>
            <div className = "grid container mx-auto flex">
                <div className = "text-4xl mt-9 text-center justify-self-center">{routine} </div>
                <div className = "text-3xl mt-1 text-center justify-self-center italic"> 
                    Week&nbsp;{week}
                    <form>
                        <input type = "text" id= "date" name= "date" placeholder = "Start date"  className = "text-base text-center self-center w-32 bg-zinc-200 mb-1 rounded px-2 py-1" onChange = {dateChange} onKeyDown = {(e)=> checkSubmit(e)}>
                        </input>
                    </form>
                </div>
                <div className = "grid grid-cols-12 flex">
                    <Edit/>
                    {
                    isLog?
                            <button className = "btn-red ml-2 text-xl mb-2 col-start-12 text-center justify-items-center grid" onClick = {deleteRtn}>
                                {
                                   <RiCloseFill size = {30}/>
                                }
                            </button>
                        : null
                    }
                </div>
                
            </div>
            <div className = "container flex justify-center mx-auto shadow-md pb-4 rounded-md">
                {
                    canGoPrevWeek ?  <button className = "mr-4 btn" onClick = {prevWeek}>
                        <IconContext.Provider value = {{className : "text-4xl"}}>
                            <TiChevronLeft/>
                        </IconContext.Provider>
                    </button> : null
                }
               
                <div className = "flex flex-col">
                    <div className = "w-full">
                            <Week />
                    </div>
                </div>
                <button className = "ml-4 btn" onClick = {nextWeek}>
                    <IconContext.Provider value = {{className : "text-4xl"}}>
                        <TiChevronRight/>
                    </IconContext.Provider>
                </button>
            </div>
        </div>
        
    )
  }

  export default Timetable;
