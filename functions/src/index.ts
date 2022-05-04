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

        let decodedPayload, timestampReceivedAt

        try {
            decodedPayload = data.uplink_message.decoded_payload
            timestampReceivedAt = data.uplink_message.received_at

            if (decodedPayload == null) {
                throw "decoded_payload empty"
            }
            if (timestampReceivedAt == null) {
                throw "received_at empty"
            }
        } catch (error) {
            res.json({
                status: "error",
                message: `Error: ${error}`
            })
            return
        }

        const databaseEntry = {
            ...decodedPayload,
            timestamp: timestampReceivedAt
        }

        functions.logger.log(JSON.stringify(decodedPayload))

        const databaseResponseCurrentData = admin.database().ref('/currentData').set(databaseEntry)
        const databaseResponseHistory = admin.database().ref('/history').push().set(databaseEntry)

        res.json({
            status: "success",
            data: {
                databaseResponseCurrentData,
                databaseResponseHistory
            }
        });
    })
