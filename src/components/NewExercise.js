import React, { useEffect } from 'react'
import {RiAddLine, RiCloseLine} from "react-icons/ri"

var initialFormData = Object.freeze({
    exercise: "",
    weight: "",
    sets: "",
    reps: "",
    inc: ""
})
function NewExercise({props, setShowNew, exercises_data, updateExercises, day, week, item}){
        const [formData, updateFormData] = React.useState(initialFormData);

        useEffect(()=>{
            if(item!=null){
                updateFormData(item)
            } 
        }, [updateFormData, item])

        const handleChange = (e) =>{
            updateFormData({...formData,
            [e.target.name]: e.target.value
            })
        }
        
        const reset = () =>{
            updateFormData(initialFormData);
            props= setShowNew(false)
        }

        function update(){
            const items = Array.from(exercises_data[week][day]);
            console.log(items);
            var index = 0
            for(var i =0; i< items.length; i++){
                var isSame = false;
                for(const [key, value] of Object.entries(item)){
                    if(items[i].key === key){
                        console.log(value);
                        continue;
                    }
                    break;
                }
                if(isSame){
                    index =i;
                    break;
                }
            }
            console.log(item);
            items.splice(index, 1, formData);
            exercises_data[week][day] = items;
            const newEx = {...exercises_data}
            console.log(newEx);
            updateExercises(newEx);
        }

        const handleSubmit = (e) =>{
            e.preventDefault()
            if(item!=null){
                update();
            }
            else{
                console.log(week);
                console.log(exercises_data)
                var items = new Array(formData);
                if(exercises_data[week][day]!=null){
                    items = Array.from(exercises_data[week][day]);
                    items.push(formData);
                }
                exercises_data[week][day] = items;
                const newEx = {...exercises_data}
                updateExercises(newEx);
            }
        }
        return(
                <div className = "newEx grid justify-items-stretch shadow-sm shadow-zinc-300 rounded-md bg-zinc-200 mt-2">
                    <form>
                        <div className = "justify-items-left">
                            <button className = "btn-red !px-1" type = "reset" onClick = {reset}>
                                <RiCloseLine size = {20}/>
                            </button>
                            <button className = "btn-green !px-1" onClick = {handleSubmit}>
                                <RiAddLine size = {20} />
                            </button>
                        </div>
                        <div className = "text-center pt-1 pb-1">
                            <input type = "text" id= "exercise" name= "exercise" placeholder = "exercise"  className = "text-center text-xl self-center w-40 bg-zinc-100 mb-1 rounded" onChange = {handleChange}
                            value = {formData.exercise}></input>
                        </div>
                        <div className = "text-center pb-1">
                            <input type = "text" id= "weight" name= "weight" placeholder = "wgt." className = "text-center w-10 bg-zinc-100 mb-1 rounded" onChange = {handleChange}
                            value = {formData.weight} ></input> lbs&nbsp;
                            <input type = "text" id= "inc" name= "inc" placeholder = "inc" className = "ml-1 font-bold text-center w-10 bg-zinc-100 mb-1 rounded" onChange = {handleChange} 
                            value = {formData.inc}></input> <span className = "font-bold">+&nbsp; </span>
                        </div>
                        <div className = "text-center font-bold mb-2">
                            <input type = "text" id= "sets" name= "sets" placeholder = "sets" className = " text-center w-10 bg-zinc-100 mr-1 font-bold rounded" onChange = {handleChange}
                            value = {formData.sets}></input>
                            X
                            <input type = "text" id= "reps" name= "reps" placeholder="reps" className = "text-center w-10 bg-zinc-100 ml-1 font-bold rounded" onChange = {handleChange}
                            value = {formData.reps}></input>
                        </div>
                    </form>
                </div>
        )
}
export default NewExercise;
