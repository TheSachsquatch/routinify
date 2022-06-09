import React from 'react';
import Timetable from "./Timetable";
function Dashboard({routine, user, inputs, setInputs, deleteRtn, date, setDate, setShowVideo, URL}) {
    return(
        <div>
            <Timetable routine = {routine} user = {user} setInputs = {setInputs} inputs = {inputs} deleteRtn = {deleteRtn} date = {date} setDate = {setDate} setShowVideo = {setShowVideo} URL = {URL}/>
        </div>
        
    );
}

export default Dashboard;