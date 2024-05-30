const express = require('express');
const fs = require('fs');
const {data} = require('./public/Data');
const cors = require('cors');
const {join} = require("path");

const app = express();
const port = 3030;
let currentStep = data

app.use(express.json());
app.use(cors());

app.post('/', async (req, res) => {
    const receivedData = req.body;
    const message = receivedData.message;

    if (currentStep.hasOwnProperty(message)) {
        const action = currentStep[message];
        if (!action.actions) {
            if (typeof action.text === 'function') {
                try {
                    const text = await action.text(message);
                    res.json({ text: `${text}<br><br>Thanks, Type 'help' to start again` });
                    currentStep = data;
                } catch (error) {
                    console.error(error.message);
                    res.json({ text: "An error occurred while executing the function. Try again." });
                }
            } else {
                res.json({ text: `${action.text}<br><br>Thanks, Type 'help' to start again` });
                currentStep = data;
            }
        } else {
            res.json(action);
            currentStep = action.actions;
        }
    } else {
        res.json({ text: "Sorry, I didn't understand that." });
    }
});

app.use(express.static(join(__dirname, 'public')));
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);

});
