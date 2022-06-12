import React, {useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import { CSSTransition } from 'react-transition-group'
import ReCAPTCHA from 'react-google-recaptcha'
import { GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google'
import {RiCloseLine} from "react-icons/ri"

export default function Login({open, setShow, close, regStatus, reg, loginStatus, setLoginStatus, routines, setRt, setInputs, startRegister, isLogging, setisLogging, CLIENT_ID, setDate, URL}) {
    const showLogin = open ? "login-wrapper justify-self-center text-center items-center shadow-md bg-neutral-200 fixed modal" : "hidden";
    const[usernameReg, setUsernameReg]= useState("");
    const[passwordReg, setPasswordReg]= useState("");
    const[status, setStatus] = useState("");
    const[captchaComp, setCaptchaComp] = useState(false);
    const[errorCap, setErrorCap] = useState(false);
    Axios.defaults.withCredentials= true;
    const onCaptchaChange = (value) =>{
        console.log('Captcha value:', value);
        setCaptchaComp(true);
        setErrorCap(false);
    }
    const getRout = useCallback((username) =>{
        Axios.get(URL + '/record/routines',{
            params: {
                user: username
            }
        }).then((response)=>{
            if(response.data!==null){
                console.log(response);
                routines(response.data.routine);
                setRt(response.data.routine[0]);
                Axios.get(URL + '/record/user',{
                    params:{
                        user: username, 
                        routine: response.data.routine[0]
                    }
                }).then((response)=>{
                    console.log(response);
                    if(response.data!==null){
                        setInputs(response.data.data);
                        setDate(response.data.date);
                    }
                })
            }
        })
    }, [URL, routines, setDate, setInputs, setRt])

    const register = (e) =>{
        e.preventDefault();
        if(captchaComp){
            Axios.post(URL + '/users/register', {
                username: usernameReg, 
                password: passwordReg
            }).then((response) =>{
                console.log(response);
                regStatus(true);
            });
        }
        else{
            setErrorCap(true);
        }
    };

    const login = (e) => {
        e.preventDefault();
        Axios.post(URL + '/users/login',{
            username: usernameReg,
            password: passwordReg
        }).then((response) => {
            if(!response.data.auth){
                setStatus(response.data.message);
            }
            else{
                localStorage.setItem("token", response.data.token);
                Axios.get(URL + '/users/isUserAuth', {
                    headers:{
                        "x-access-token": localStorage.getItem("token")
                    }
                }).then((responseTwo)=>{
                    console.log(responseTwo);
                    if(responseTwo.data.isAuthenticated){
                        setLoginStatus(response.data.user);
                        getRout(response.data.user);
                        setShow(false);
                    }
                })
            }
        });
    };

    const setLog = () => {setisLogging(true)}

    useEffect(()=>{
        Axios.get(URL + '/users/login').then((response)=>{
            if(response.data.loggedIn===true){
                setLoginStatus(response.data.user);
                getRout(response.data.user);
            }
        });
    }, [URL, setLoginStatus, getRout]);

    const handleCredentialResponse= async googleUser =>{
        const tkn = googleUser.credential;
        Axios.get(URL + '/users/google', {
            params: {
                token: tkn
            }
        }).then((response)=>{
            console.log(response);
            if(response.existing!=null){
                Axios.post(URL + '/users/google', {
                    token: tkn
                }).then((res)=>{
                    console.log(res);
                })
            }
            setLoginStatus(response.data.user);
            getRout(response.data.user);
            setShow(false);
        })
    }

    if(reg){
        return(
            <div className = "text-2xl rounded mt-3 mb-3 text-center fixed modal shadow-md bg-zinc-100">
                <div className = "mb-5 mt-3">
                    <button onClick = {close} className = "btn-red">
                        <RiCloseLine size= {20}/>
                    </button>
                </div>
                <div className = "mb-5 mx-5">
                    Registered ✔
                </div>
            </div>
        )
    }
    else{
        return(
            <div>
                {
                    isLogging? <CSSTransition in = {open} timeout = {300} classNames = "login-trans" appear>
                    <div className = {showLogin}>
                            <div>
                                    <button className = "btn-red" onClick = {close}> <RiCloseLine size = {20} /> </button>
                            </div>
                                <form>
                                    <div>
                                        <label>
                                            <input type="text" onChange={(e)=>{setUsernameReg(e.target.value)}} placeholder = "Username" className = "text-xl mt-3 mb-4 mx-3 rounded-md pl-2 py-2" />
                                        </label>
                                    </div>
                               <div>
                                    <label>
                                        <input type="password" onChange = {(e)=>setPasswordReg(e.target.value)} placeholder = "Password" className = "text-xl mb-4 mx-3 rounded-md pl-2 py-2"/>
                                    </label>
                               </div>
                                <div>
                                    <button onClick = {login} type="login" className = "btn-login mb-2">Login</button>
                                </div>
                                <div className =  "mb-1 font-bold">
                                    or
                                </div>
                                <div className= "ml-2 mb-2 mt-2 px-3 grid justify-items-center">
                                    <GoogleOAuthProvider clientId={CLIENT_ID}>
                                        <GoogleLogin size = "large" shape = "pill" width = "240" logo_alignment='center' onSuccess = {handleCredentialResponse} onError = {()=>{
                                            console.log('Failure')
                                        }} />
                                    </GoogleOAuthProvider>
                                </div>
                                
                                <div className = "mb-1 italic">
                                    No account?
                                </div>
                                <div>
                                    <button onClick= {startRegister} className = "btn-login mb-5">Register</button>
                                </div>
                                </form>
                                <h1>
                                    {status}
                                </h1>
                        </div>
                  </CSSTransition> :
                    <div className= {showLogin}>
                        <div>
                            <button className = "btn-red" onClick = {close}> <RiCloseLine size = {20} /> </button>
                            <form>
                                    <div>
                                        <label>
                                            <input type="text" onChange={(e)=>{setUsernameReg(e.target.value)}} placeholder = "Username" className = "text-xl mt-3 mb-4 mx-3 rounded-md pl-2 py-2" />
                                        </label>
                                    </div>
                               <div>
                                    <label>
                                        <input type="password" onChange = {(e)=>setPasswordReg(e.target.value)} placeholder = "Password" className = "text-xl mb-4 mx-3 rounded-md pl-2 py-2"/>
                                    </label>
                               </div>
                                <div className = "mx-3 mb-4">
                                    <ReCAPTCHA sitekey = {process.env.REACT_APP_CAPTCHA_KEY} onChange = {onCaptchaChange}/>
                                </div>
                                
                                {
                                    errorCap ? <div className = "text-center text-red-400">
                                    Complete captcha before registering
                                    </div> : null
                                }
                                <div>
                                        <button onClick= {register} className = "btn-login mb-5">Register</button>
                                </div>
                            </form>
                            <div className = "mb-4 italic">
                                Already have an account?&nbsp;
                                <button class= "link italic" onClick = {setLog}> Login</button>
                            </div>
                        </div>

                    </div>
                        
                }
            </div>
        )
    }

}