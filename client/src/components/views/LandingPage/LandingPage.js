import React, { useEffect } from 'react';
import axios from 'axios' 

const LandingPage = (props) => {

    useEffect(()=>{
        axios.get('/api/hello')
        //axios.get('http://localhost:5000/api/hello') //에러나서 proxy설정해줌
        .then(response=>console.log(response.data))
    },[])

    const onClickHandler =()=>{
        axios.get('/api/users/logout')
        .then(response=>{
            if(response.data.success){
                props.history.push('./login')//v6바꿔줘야함!
            }else{
                alert('Error')
            }
        })
    }

    return (
        <div style={{
            display:'flex',justifyContent:'center',alignItems:'center'
            ,width:'100%',height:'100vh'
        }}>
            <h2>LandingPage 시작페이지</h2>
            <button onClick={onClickHandler}>로그아웃</button>
        </div>
    );
};

export default LandingPage;