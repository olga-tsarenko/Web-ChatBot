const express = require('express');
const fs = require('fs');
const {data} = require('./Data');
const cors = require('cors');

const app = express();
const port = 3030;
let currentStep = null

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('GET request to the homepage')
})

const checkStep = (message) => {
    console.log('message', message);
    if (message === 'start') {
        return currentStep = data.start
    } else {
        return currentStep = currentStep.actions[message];
    }
}

app.post('/', async (req, res) => {
    const receivedData = req.body;
    checkStep(receivedData.message)

    console.log('Object.keys(currentStep)', Object.keys(currentStep));
    if (Object.keys(currentStep)[0] === 'response') {
        const responseMessage = currentStep.response('usd')
        const result = await responseMessage();

        res.send({text: result.data.rates.UAH, actions: ''});
    } else {
        res.send(currentStep);
    }

});


app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);

});

console.log(data);
