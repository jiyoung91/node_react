const express = require('express');
const app = express();
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {auth} = require('./middleware/auth');
const { User } = require("./models/User");

//bodyParser:클라이언트에서 가져온 정보를 서버에서 분석해서 가져올수있게 해줌
app.use(bodyParser.urlencoded({extended:true}));
//json타입으로 가져옴
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
const { use } = require('bcrypt/promises');
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology:true
}).then(()=> console.log('MongoDB Connected..'))
  .catch(err=>console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요')
})
//postman으로 test하기 
app.post('/api/users/register',(req,res)=>{
    //회원가입 정보 > DB에 넣기
    const user = new User(req.body);

    user.save((err,userInfo)=>{
        if(err) return res.json({success: false,err})
        return res.status(200).json({
            success: true
        })
    })
})
//로그인
app.post('/api/users/login',(req,res)=>{
    //DB에서 이메일 찾기
    User.findOne({email:req.body.email},(err,user)=>{
        if(!user){
            return res.json({
                loginSuccess:false,
                message:"제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //맞는 비번인지 확인
        user.comparePassword(req.body.password, (err,isMatch)=>{
            //console.log('req.body.password>',req.body.password)
            if(!isMatch)
             return req.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})
            //token 생성 > JSONWEBTOKEN 라이브러리 다운
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                //token 을 저장(cookies or local storage)
                res.cookie("x_auth",user.token)   
                .status(200) 
                .json({loginSuccess:true,userId:user._id})  //성공시 출력
            })
        })
    })
})
//권한
app.get('/api/users/auth',auth,(req,res)=>{
    res.status(200).json({
        _id: req.user._id,
        isAdmin : req.user.role === 0 ? false : true , 
        isAuth : true, 
        email: req.user.email,
        name : req.user.name,
        lastname:req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})
//로그아웃
app.get('/api/users/logout', auth, (req, res)=>{
    User.findOneAndUpdate({ _id : req.user._id},
        {token : ""}
        ,(err,user) => {
            if(err) return res.json({success:false,err});
            return res.status(200).send({
                success: true
            })
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
