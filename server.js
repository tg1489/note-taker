const 
    express = require('express'),
    app = express(),
    path = require('path'),
    fs = require('fs'),
    uuid = require('./helpers/uuid'),
    PORT = process.env.PORT || 3000

const {readFromFile,writeToFile,readAndAppend} = require('./helpers/fsUtils')
    
// Middleware
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.use(express.static('public'))


// Routers
    app.get('/', (req, res) => {
        res.sendFile('./public/index.html')
    })

    app.get('/notes', (req, res) => {
        res.sendFile(path.join(__dirname, './public/notes.html'))
    })

    app.get('/api/notes', (req, res) => {
        const notes = fs.readFile('./db/db.json', 'utf-8', (err, jsonStr) => {
            try {
                const data = JSON.parse(jsonStr)
                res.json(data)
            }
            catch (err) {console.error(err)}
        })
    })

    app.post('/api/notes', (req, res) => {
        
        const {title,text} = req.body
        const newNote = {id:uuid(), title, text}
        readAndAppend(newNote, './db/db.json')
    })

    app.delete(`/api/notes/:id`, (req, res) => {
        const elementID = req.params.id.toString()
        fs.readFile('./db/db.json', 'utf8', (err, notesFromFile) => {
            const notes = JSON.parse(notesFromFile)
            const targetID = notes.filter(databaseNote => databaseNote.id !== elementID);
            fs.writeFile('./db/db.json', JSON.stringify(targetID), () => res.json(targetID))
        }
    )})

// Create Port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))