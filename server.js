const express = require("express");
const cors = require('cors');
const app = express();
const fileUpload = require('express-fileupload');

const api_redirect_path = require("./api/api")
const port = process.env.PORT || 3000;
const api_version = 1.0;

process.env.TZ = 'Etc/GMT-2';

// give publicly access for call public path
app.use(express.static(__dirname + '/public'));
// app.use(process.env.admin_image_path_name, express.static(process.env.admin_image_path));
app.use(process.env.image_path_name, express.static(process.env.image_path));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(fileUpload());



// only in json format
app.use((err, req, res, next) => {
    if (err) {
        res.status(400).send(
            {
                "status": 400,
                'message': "error parsing data, Request is not in a JSON Format",
                "success": false,
            }
        )
    } else {
        next();
    }
});


app.use('/api', api_redirect_path);

app.get('/status-code', (req, res) => {
    return res.status(200).send({
        "status": 200,
        'message': "error status code",
        "success": true,
        "api v": api_version,
        "data": {
            result: [
                { "code": 200, "details": "Everything is fine" },
                { "code": 201, "details": "Everything is fine and resource is created" },
                { "code": 304, "details": "Resource is not modified" },
                { "code": 400, "details": "Bad request for request format" },
                { "code": 401, "details": "You are not authorized to access this resource" },
                { "code": 403, "details": "No access to this resource" },
                { "code": 404, "details": "Resource not found" },
                { "code": 405, "details": "Method is not goog" },
                { "code": 409, "details": "Duplicate entry error" },
                { "code": 500, "details": "Internal server error" },
                { "code": 503, "details": "Server is not available now" },
            ]
        },
    })
});




app.get('/*', (req, res) => {
    return res.status(404).send({
        "status": 404,
        'message': "unknown route",
        "success": false,
        "api v": api_version
    })
});


app.post('/*', (req, res) => {
      return res.status(404).send({
        "status": 404,
        'message': "unknown route",
        "success": false,
        "api v": api_version
    })
});

app.patch('/*', (req, res) => {
    return res.status(404).send({
        "status": 404,
        'message': "unknown route",
        "success": false,
        "api v": api_version
    })
});

app.put('/*', (req, res) => {
    return res.status(404).send({
        "status": 404,
        'message': "unknown route",
        "success": false,
        "api v": api_version
    })
});

app.delete('/*', (req, res) => {
    return res.status(404).send({
        "status": 404,
        'message': "unknown route",
        "success": false,
        "api v": api_version
    })
});


app.listen(port, async () => {
    console.log(`Online Booking system backend running port ${port}`);
});
