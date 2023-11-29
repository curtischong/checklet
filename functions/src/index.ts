/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { DataSnapshot } from "firebase-admin/database";
import { ParamsOf } from "firebase-functions/lib/common/params";
import {
    onDocumentCreated,
    FirestoreEvent,
    QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

//firebase onDocumentCreated get authenticated user that made the request

// TODO: this way of defining the function is v1. migrate to v2: https://firebase.google.com/docs/firestore/extend-with-functions-2nd-gen
exports.updateUserDocuments = onDocumentCreated(
    "checkers/{docId}",
    async (
        event: FirestoreEvent<QueryDocumentSnapshot | undefined, ParamsOf<any>>,
    ) => {
        const firestore = await getFirestore();

        // we cannot get the user that made this request? https://stackoverflow.com/questions/76888918/data-and-params-in-ondocumentcreated-firebase-function-are-undefined-when-called
        // https://stackoverflow.com/questions/76917893/how-do-i-get-the-authenticated-user-from-firebase-firestore-2nd-gen-ondocumentda
        //
        // the alternative is to read the userId within the document. This is sus because the user can change the userId to one that isn't theirs
        // We just have to hope that they don't find out what the other userId is
        const snapshot = event.data;
        if (!snapshot) {
            console.log("No data associated with the event");
            return;
        }
        const data = snapshot.data();
        const userId = data.userId; // this is a security risk since the client sets this. but since we don't have access to the user that made the request, we have to do this
        const usersRef = firestore.collection("users").doc(userId);

        usersRef.get().then((docSnapshot: DataSnapshot) => {
            if (docSnapshot.exists()) {
                usersRef.update(
                    "checkers",
                    // https://stackoverflow.com/questions/53814199/how-to-get-cloud-function-oncreate-trigger-doc-id
                    firestore.FieldValue.arrayUnion(event.params.docId),
                );
            } else {
                usersRef.set("checkers", []);
            }
        });
    },
);
