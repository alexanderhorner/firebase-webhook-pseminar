import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import { TheThingsNetWebhookBody } from "./requestdata"

admin.initializeApp(functions.config().firebase)

exports.pushData = functions
    .region('europe-west1')
    .https.onRequest(async (req, res) => {

        if (req.headers.authorization !== "Basic QmF5ZXJubGFiMTotd0Bja302Y2UnLSk9WV91bWVqNnV0VlJSVU4tJmBSUQ==") {
            res.json({
                status: "error",
                message: "Auth failed"
            })
            functions.logger.error("Auth failed")
            return
        }


        // Grab the text parameter.
        const data:TheThingsNetWebhookBody = req.body;

        let decodedPayload

        try {
            decodedPayload = data.uplink_message.decoded_payload
        } catch (error) {
            res.json({
                status: "error",
                message: `Error: ${error}`
            })
            return
        }

        functions.logger.log(JSON.stringify(decodedPayload))

        const databaseResponse = admin.database().ref('/').set(decodedPayload)

        // Push the new message into Firestore using the Firebase Admin SDK.
        // Send back a message that we've successfully written the message
        res.json({
            status: "success",
            data: databaseResponse
        });
    })
