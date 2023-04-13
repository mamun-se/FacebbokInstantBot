const express = require('express')
const PORT = process.env.PORT || 9000;

const request = require('request');
bodyParser = require('body-parser'),
    app = express().use(bodyParser.json())

app.use(express.static('./public'))


let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
let PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let messageTitle = process.env.TITLE;
let messagePhoto = process.env.PHOTO;
let messageSubTitle = process.env.SUBTITLE;
let messageButtonTitle = process.env.BUTTONTITLE;


app.post('/webhook', (req, res) => {

    let body = req.body;
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach((entry) => {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            let times_tamp = webhook_event.timestamp;

            console.log('Times Tamp: ' + times_tamp);


            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);
            // Get the sender PSID





            //--------GamePlay-----------

            if (webhook_event.game_play) {

                let game_id = webhook_event.game_play.game_id;

                let userTime = (Math.round((times_tamp / 1000) / 60)) * 1000 * 60;

                MessageSent(sender_psid);

                setTimeout( ()=> {MessageSent(sender_psid);}, (2000 * 60));
                setTimeout( ()=> {MessageSent(sender_psid);}, (5000 * 60));
                setTimeout( ()=> {MessageSent(sender_psid);}, (70000 * 60));
                setTimeout( ()=> {MessageSent(sender_psid);}, (10000 * 60));

        
            }

            //---------------------GmaePlay End---------------


            else if (webhook_event.message) {
                //      console.log("Message");
            }

            else {
                //       console.log("no Message and no game");

            }


        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});


app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});


function callSendAPI(sender_psid, response, game_page_access_token) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": game_page_access_token },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!  Id: ' + sender_psid)
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}


function MessageSent(sender_psid) {


    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": messageTitle,
                        "image_url": messagePhoto,
                        "subtitle": messageSubTitle,
                        "default_action": {
                            "type": "game_play",
                        },
                        "buttons": [{
                            "type": "game_play",
                            "title": messageButtonTitle,
                            "payload": JSON.stringify({
                                "bot_data": 0
                            })
                        }]
                    }
                ]
            }
        }
    }

    callSendAPI(sender_psid, response, PAGE_ACCESS_TOKEN);


}




app.listen(PORT)
