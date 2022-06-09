import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import NewExercise from './NewExercise'
import {RiEditFill} from "react-icons/ri"
import {RiCloseFill} from "react-icons/ri"

function Exercise({exercises, updateExercises, day, edit, week, setShowVideo}) {
    //const [exercises, updateExercises] = useState(exercises_data);
    function handleOnDragEnd(result){
        if(!result.destination) return;
        const items = Array.from(exercises[week][day]);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        exercises[week][day] =items;
        const newEx = {...exercises}
        updateExercises(newEx);
    }

    function ExerciseTemplate({exercise, sets, reps, weight, inc, item}){
        const [showNew, setShowNew] = React.useState(false);

        const setShowVideoExercise = (e) =>{
            e.preventDefault();
            setShowVideo(exercise);
        }
        const setShow= (e) =>{
            e.preventDefault();
            setShowNew(true);
        }
        if(showNew){
            return(
                <NewExercise exercises_data = {exercises} updateExercises = {updateExercises} day = {day} week = {week} item = {item} setShowNew= {setShowNew}/>
            )
        }
        else{
            return (
                <div>
                    <div className = "grid">
                    <span className = "mr-1 justify-self-left" >
                        {!edit? <RemoveExercise exer={item}/> : null}
                        {!edit? <button className= "btn !py-0.5" onClick = {setShow}> <RiEditFill size = {20}/> </button> :null}
                    </span>
                    <button className = "justify-self-center hover:text-gray-500 mb-2 mt-2 text-xl" onClick = {setShowVideoExercise}>
                        {exercise}
                    </button>
                    </div>
                    <div className = "text-center">
                            <span className = "justify-self-center">
                                {weight}lbs
                            </span>
                            <span className = "ml-2 btn-inc justify-self-right" >
                                {inc}+
                            </span>
                    </div>
                    <div className = "text-center font-bold mt-2 pb-1">
                        <span className = "mr-4">
                            {sets}
                        </span>
                        X 
                        <span className = "ml-4">
                            {reps}
                        </span>
                    </div>
                </div>
            )
        }
    }
    function RemoveExercise({exer}){
        function del(){
            const items = Array.from(exercises[week][day]);
            const found = items.indexOf(exer);
            items.splice(found, 1);
            exercises[week][day] = items;
            const newEx = {...exercises}
            updateExercises(newEx);
        }
        return(
            <button className = "btn-red !px-1" onClick = {del}>
                <RiCloseFill size = {20} />
            </button>
        )
    }
    if(exercises[week] && exercises[week][day].length>0){
        return(
            <div>
              <DragDropContext onDragEnd = {handleOnDragEnd}>
                  <Droppable droppableId = {!edit ? "exercise" : "none"}>
                      {(provided)=>(
                          <ul className = "exercise" {...provided.droppableProps} ref={provided.innerRef}>
                              {exercises[week][day].map(({exercise, sets, reps, weight, inc}, index)=>{
                                  const item = {exercise, sets, reps, weight, inc};
                                  if(!edit){
                                    return (
                                        <Draggable  key = {exercise} draggableId = {exercise} index= {index}>
                                            {(provided) =>(
                                            <li ref = {provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className = "shadow-sm shadow-zinc-300 rounded-md bg-zinc-200 mt-2">
                                                <ExerciseTemplate exercise = {exercise} sets = {sets} weight = {weight} reps = {reps} inc = {inc} item = {item}/>
                                            </li>
                                            )}
                                            
                                        </Draggable>
                                    );
                                  }
                                  else{
                                      return(
                                        <li className = "shadow-sm shadow-zinc-300 rounded-md bg-zinc-200 mt-2">                                  
                                            <ExerciseTemplate exercise = {exercise} sets = {sets} weight = {weight} reps = {reps} inc = {inc} item = {item}/>
                                        </li>
                                      );
                                  }
                                  
                              })}
                              {provided.placeholder}
                          </ul>
                      )}
                  </Droppable>
              </DragDropContext>
            </div>
          
        );
    }
      
}

export default Exercise;