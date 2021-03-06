var express = require('express')
var bodyParser =  require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise
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
    message.save().then(() => {
        console.log('Saved')
        Message.findOne({message: 'badword'})

    }).then(censored => {
        if(censored){
            console.log('censored word found', censored)
           return Message.remove({_id: censored.id}, (err) => {
        
            })
        }
        io.emit('message',req.body)
        res.sendStatus(200)
    })
    .catch((err) => {
        res.sendStatus(500)
        return console.error(err)
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