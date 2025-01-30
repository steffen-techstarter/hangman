const express = require('express') 
const app = express()
const host = "localhost" // Server erreichbar unter 'localhost/8080'
const port = 8080

// app.get('/', (req, res) => { 
//     res.send('Request received')
// })

// app.get('/jannik', (req, res) => { 
//     res.send('Request received sölkjsöl')
// })

app.use('/', express.static('../gruppe'));


app.listen(port, host, () => {
    console.log(`Server ready at http://${host}:${port}`)
})


