const express = require('express')
const bodyParser = require('body-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csv = require('csv-parser')
const fs = require('fs')
const app = express()
app.set('view engine', 'ejs');

const csvWriter = createCsvWriter({
    path: 'file.csv',
    header: [{
            id: 'id',
            title: 'Student_Id'
        },
        {
            id: 'name',
            title: 'Name'
        },
        {
            id: 'gender',
            title: 'Gender'
        },
        {
            id: 'dob',
            title: 'DateOfBirth'
        },
        {
            id: 'city',
            title: 'City'
        },
        {
            id: 'state',
            title: 'State'
        },
        {
            id: 'email',
            title: 'EmailId'
        },
        {
            id: 'qualification',
            title: 'Qualification'
        },
        {
            id: 'stream',
            title: 'Stream'
        }
    ]
});


app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))


const port = process.env.PORT || 3000
app.get('/', (req, res) => {
    res.sendFile('/index.html')
})

app.get('/add-student', (req, res) => {
    res.sendFile(__dirname + '/add-student.html')
})

app.post('/add-student', (req, res) => {
    const record = []
    record.push(req.body)
    csvWriter.writeRecords(record) // returns a promise
        .then(() => {
            res.render('acknowledgement',{message:'Student Data Inserted Successfully'})
            console.log('...Done');
        });
})
app.get('/search', (req, res) => {
    res.sendFile(__dirname + '/search-student.html')
})
app.post('/search', (req, res) => {
    const results = [];
    fs.createReadStream('file.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const found = results.find((data) => data.Student_Id == req.body.id)
            if(found){
                return res.render('search-result',{record:found})
            }
            res.render('acknowledgement',{message:'Record Not Found😯'})
        });
})
app.get('/display',(req,res)=>{
    const results = [];
    fs.createReadStream('file.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log(results)
            res.render('all-records',{records:results})
        });
})
app.listen(port, () => console.log('app is running on port: ' + port))