const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
// write your logging code here
    const agent = req.headers['user-agent'];
    const time = new Date().toISOString();
    const method = req.method;
    const resource = req.url;
    const version = `HTTP/${req.httpVersion}`;
    const status = 200;

    const line = `${agent},${time},${method},${resource},${version},${status}\n`;

    console.log(line);

    fs.appendFile('log.csv', line, (err) => {
        if(err){
            console.log(err);
        }
    })

    next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.send('ok')
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    const logs = fs.readFileSync('log.csv', 'utf8');
    const rows = logs.split('\n');

    const logObjects = rows
        .slice(1)
        .filter(row => row.trim() !== '')
        .map( row => {
            const parts = row.split(',');
        
        return {
            Agent: parts[0],
            Time: parts[1],
            Method: parts[2],
            Resource: parts[3],
            Version: parts[4],
            Status: parts[5]
        };
        
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(logObjects, null, 2));
});

module.exports = app;
