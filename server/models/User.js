const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name :{
        type: String,
        maxlength:50
    },
    email:{
        type: String,
        trim: true,
        unique: 1
    },
    password :{
        type: String,
        minlength:5
    },
    lastname :{
        type: String,
        maxlength:50
    },
    role:{
        type: Number,
        default:0
    },
    imgage:String,
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
})
//저장 전에 함수실행
userSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){
        //비밀번호 암호화 
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {//hash: 암호화된 비번
                // Store hash in your password DB.
                if(err) return next(err)
                user.password = hash 
                next()
            });
        });
    }else{
        next()
    }
})
//맞는비번인지 확인 
userSchema.methods.comparePassword = function(plainpassword,cb){
    bcrypt.compare(plainpassword, this.password,function(err,isMatch){
        if(err) return cb(err)
         cb(null,isMatch) //err=null, isMatch=true
    })
}
//token 
userSchema.methods.generateToken= function(cb){
    var user = this;
    //jsonwebtoken이용해서 token 생성 
    var token = jwt.sign(user._id.toHexString(),'secretToken')
    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
         cb(null, user)
    })
}
//auth
userSchema.statics.findByToken = function(token, cb){
    var user = this; 
    //토클은 decode한다
    jwt.verify(token,'secretToken',function(err,decoded){
        //유저아이디를 이용해서 유저를 찾고
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token":token},function(err,user){
            if(err) return cb(err);
             cb(null,user)
        })
    })
}

const User = mongoose.model('User',userSchema)
module.exports ={User}
