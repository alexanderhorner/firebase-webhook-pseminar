import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

import { TheThingsNetWebhookBody } from "./requestdata"

admin.initializeApp(functions.config().firebase)

exports.pushData = functions
    .region('europe-west1')
    .https.onRequest(async (req, res) => {


        // Verify login data in basic auth header
        const username = process.env.BASIC_AUTH_USERNAME
        const password = process.env.BASIC_AUTH_PASSWORD

        const authToken = Buffer.from(`${username}:${password}`).toString('base64')

        if (req.headers.authorization !== `Basic ${authToken}`) {
            res.json({
                status: "error",
                message: "Auth Error: Basic Auth failed"
            })
            throw new Error("Basic Auth failed")
        }


        // Grab relevant data from the data recieved 
        const data:TheThingsNetWebhookBody = req.body;

        const decodedPayload = data.uplink_message.decoded_payload
        const timestampReceivedAt = data.uplink_message.received_at

        if (decodedPayload == null) {
            const message = "Payload error: decoded_payload empty"
            res.json({
                status: "error",
                message
            })
            throw new Error(message)
        }
        if (timestampReceivedAt == null) {
            const message = "Payload error: received_at empty"
            res.json({
                status: "error",
                message
            })
            throw new Error(message)
        }


        // Push data to database
        const databaseEntry = {
            ...decodedPayload,
            timestamp: timestampReceivedAt
        }

        functions.logger.log(JSON.stringify(databaseEntry))

        admin.database().ref('/currentData').set(databaseEntry)
        admin.database().ref('/history').push().set(databaseEntry)

        res.json({
            status: "success",
            data: null
        })


    })
