
var express = require('express')
var app = express()

app.use(express.static(__dirname))

var messages = [
    {name: "Robert", message:"Hello"},
    {name: "Julia", message:"Hi!"}
]

app.get('/messages',(req,res) => {
    res.send(messages)
})

var server = app.listen(3000, () => {
    console.log("Server is listning on port", server.address().port)
})