import React, { useState } from 'react';
import {useDispatch} from 'react-redux';
import {loginUser} from '../../../_actions/user_action';

import {createBrowerHistory} from 'react-router-dom';
import {useParams,useLocation,useNavigate} from 'react-router-dom';

//const history = createBrowerHistory();

const LoginPage = (props) => {
    //const navigate = useNavigate();
    const dispatch =useDispatch();

    const [Email , setEmail] = useState('')
    const [Password , setPassword] = useState('')

    const onEmailHandler =(event)=>{
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler =(event)=>{
        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler =(event)=>{
        event.preventDefault();//refresh 막기
        //서버에 보내기 
        let body={
            email :Email,
            password : Password
        }
        //user_action.js 호출
        dispatch(loginUser(body))
            .then(response=>{
                if(response.payload.loginSuccess){
                    props.history.push('/')//페이지이동 //v6바꿔줘야함!
                }else{
                    alert('Error')//왜 안됨 ? 
                }
            })
        
    }
    return (
        <div style={{
            display:'flex',justifyContent:'center',alignItems:'center'
            ,width:'100%',height:'100vh'
        }}>
            <form style={{display:'flex',flexDirection:'column'}}
                onSubmit={onSubmitHandler}>
                <label> Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage