/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { DataSnapshot } from "firebase-admin/database";
import * as functions from "firebase-functions";
import { ParamsOf } from "firebase-functions/lib/common/params";
import {
    onDocumentCreated,
    Change,
    FirestoreEvent,
    QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

// TODO: this way of defining the function is v1. migrate to v2: https://firebase.google.com/docs/firestore/extend-with-functions-2nd-gen
exports.updateUserDocuments = onDocumentCreated(
    "checkers/{docId}",
    async (
        event: FirestoreEvent<
            QueryDocumentSnapshot | undefined,
            ParamsOf<Document>
        >,
    ) => {
        const userId = event.
        if (!userId) {
            throw new Error("User not logged in");
        }
        const firestore = await getFirestore();

        const usersRef = firestore.collection("users").doc(userId);

        usersRef.get().then((docSnapshot: DataSnapshot) => {
            if (docSnapshot.exists()) {
                usersRef.update(
                    "checkers",
                    // https://stackoverflow.com/questions/53814199/how-to-get-cloud-function-oncreate-trigger-doc-id
                    firestore.FieldValue.arrayUnion(context.params.docId),
                );
            } else {
                usersRef.set("checkers", []);
            }
        });
        // .catch((err) => {
        //     console.log("cannot find user");
        //     console.log(err);
        // });
    },
);
