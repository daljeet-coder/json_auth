const fs = require("fs")
const bodyParser = require("body-parser")
const jsonServer = require("json-server")
const jwt = require("jsonwebtoken")

const server = jsonServer.create()
const userdb = JSON.parse(fs.readFileSync("./users.json","utf-8"))

server.use(bodyParser.urlencoded({extended:true}))
server.use(bodyParser.json())
server.use(jsonServer.defaults())

const SECRET_KEY = 'WQ9459ERIUO'

const expiresIn = '1h'

function createToken(payload){
    return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

function isAuthencated({email,password}){
    return(
        userdb.users.findIndex((user)=>user.email===email && user.password===password) !==-1
    );
}

server.post("/api/auth/register",(req,res)=>{
    const {email,password} = req.body;
    if(isAuthencated({email,password})){
        const status= 401;
        const message= "Email & password already exist";
        res.status(status).json({status, message})
        return
    }
    fs.readFile("./users.json",(err,data)=>{
        if(err){
            const status= 401;
            const message= err;
            res.status(status).json({status,message});
            return
        }
        data = JSON.parse(data.toString())
        let last_index = data.uses[data.users.length-1].id;
        data.users.push({id:last_index+1, email:email, password:passwor })
        let writeData = fs.writeFile("./users.json",
        JSON.stringify(data),
        (err)=>{
            if(err){
                const status= 401;
                const message= err;
                res.status(status).json({status,message});
                return
            }
        }
        )
    });
    const access_token = createToken({email,password})
    res.status(200).json({access_token})
})

server.post("/api/auth/login",(req,res)=>{
    const {email,password} = req.body;
    if(isAuthencated({email,password})){
        const status= 401;
        const message= "Invalid Credentials";
        res.status(status).json({status, message})
        return
    }
    const access_token = createToken({email,password})
    res.status(200).json({access_token})
})

const PORT = process.env.PORT||8000


server.listen(PORT,()=>{
    console.log('json server is running')
})