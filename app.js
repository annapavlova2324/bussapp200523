const express = require('express')

const mysql = require('mysql')
var fs = require('fs');
const path = require('path');

const app = express()
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}))


const port = process.env.PORT || 8000;

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'd26893.mysql.zonevs.eu',
    user            : 'd26893_busstops',
    password        : '3w7PYquFJhver0!KdOfF',
    database        : 'd26893_busstops'
})


app.get('', (req, res) => {
    res.sendFile("C:\\Users\\o\\Desktop\\Last\\index.html");
})

app.get('/fetch', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query("SELECT DISTINCT stop_id, stop_name, stop_area FROM aleksandrmastakov_stops", (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                var json = JSON.stringify(rows);
                res.send(json);
                res.end();
           
            } else {
                console.log(err)
            }

        })
    })
})

app.get('/info/:varName', (req, res) => {
    let sendquery = req.params.varName;
    pool.getConnection((err, connection) => {
            if(err) throw err
            console.log('connected as id ' + connection.threadId)
            console.log(sendquery);
            connection.query("SELECT DISTINCT stop_name FROM aleksandrmastakov_stops WHERE stop_area = '" + sendquery + "'", (err, rows) => {
            connection.release() // return the connection to pool
   
                if (!err) {
                    var json = JSON.stringify(rows);
                    res.send(json);
                    res.end();
                   
               
                } else {
                    console.log(err)
                }
   
            })
        })
    })

app.get('/stopname/:stoparea/:stopname', (req, res) => {
    let stopname = req.params.stopname;
    let stoparea = req.params.stoparea;
    //console.log(stopname);
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query("select DISTINCT c.route_short_name from aleksandrmastakov_routes as c join aleksandrmastakov_trips as d on c.route_id=d.route_id WHERE d.trip_id IN (select b.trip_id from aleksandrmastakov_stops as a join aleksandrmastakov_stop_times as b on a.stop_id=b.stop_id where a.stop_name = '" + stopname + "' and a.stop_area = '"+ stoparea +"')", (err, rows) => {
        connection.release() // return the connection to pool

            if (!err) {
                var json = JSON.stringify(rows);
                res.send(json);
                res.end();
               
           
            } else {
                console.log(err)
            }

        })
    })
})


app.get('/busname/:stoparea/:stopname/:button_value', (req, res) => {
    let busnumber = req.params.button_value;
    let stopname = req.params.stopname;
    let stoparea = req.params.stoparea;
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query("select distinct b.arrival_time from aleksandrmastakov_stops as a join aleksandrmastakov_stop_times as b on a.stop_id=b.stop_id where a.stop_name = '" + stopname + "' and a.stop_area = '" + stoparea + "' and b.trip_id in (Select d.trip_id from aleksandrmastakov_routes as c join aleksandrmastakov_trips as d on c.route_id=d.route_id where c.route_short_name ='" + busnumber +"');", (err, rows) => {
        connection.release() // return the connection to pool

            if (!err) {
                var json = JSON.stringify(rows);
                res.send(json);
                res.end();
               
           
            } else {
                console.log(err)
            }

        })
    })

} )

app.get('/routename/:stopname/:button_value', (req, res) => {
    let busnumber = req.params.button_value;
    let stopname = req.params.stopname;
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query("select DISTINCT c.route_long_name from aleksandrmastakov_routes as c join aleksandrmastakov_trips as d on c.route_id=d.route_id WHERE c.route_short_name = '" + busnumber+ "' and d.trip_id IN (select b.trip_id from aleksandrmastakov_stops as a join aleksandrmastakov_stop_times as b on a.stop_id=b.stop_id where a.stop_name = '" + stopname + "')", (err, rows) => {
        connection.release() // return the connection to pool

            if (!err) {
                var json = JSON.stringify(rows);
                res.send(json);
                res.end();
               
           
            } else {
                console.log(err)
            }

        })
    })

} )



app.listen(port, () => console.log(`Listening on port ${port}`))





