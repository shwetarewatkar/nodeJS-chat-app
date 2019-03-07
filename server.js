var express = require('express')
var bodyParser =  require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var dbURL = 'mongodb+srv://user:user@cluster0-tnq6m.mongodb.net/test?retryWrites=true'

var Message = mongoose.model('Message',{
    name: String,
    message: String
})

var messages = [
    {name: 'Robert', message:'Hello'},
    {name: 'Julia', message:'Hi!'}
]

app.get('/messages',(req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
    
})

app.post('/messages',(req, res) => {
    console.log(req.body)
    var message = new Message(req.body)
    message.save((err) => {
        if(err)
            sendStatus(500)
        
        Message.findOne({message: 'badword'}, (err, censored) => {
            if(censored){
                console.log('censored word found', censored)
                Message.remove({_id: censored.id}, (err) => {
                    console.log('censored message')
                })
            }
        })
        // messages.push(req.body)
        io.emit('message',req.body)
        res.sendStatus(200)
    })
}) 

io.on('connection', (socket) => {
    console.log('User connected')
})

mongoose.connect(dbURL,{useMongoClient:true}, (err) => {
    console.log('MongoDB database connected',err)
})

var server = http.listen(3000, () => {
    console.log("Server is listening on port", server.address().port)
})