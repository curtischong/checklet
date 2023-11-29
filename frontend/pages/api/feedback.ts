import { FeedbackRequest, FeedbackResponse } from "@api/ApiTypes";
import { Engine } from "@api/engine";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (req.method === "POST") {
        try {
            const { doc, checkerId }: FeedbackRequest = req.body;
            const engine = new Engine(); // Assuming Engine is a class you've defined or imported
            engine.checkDoc(doc, checkerId);
            const feedback: any[] = [];

            res.status(200).json({
                feedback: feedback,
            } as FeedbackResponse);
        } catch (error) {
            console.error("Error while calling engine:", error);
            res.status(500).json({ error: "Could not compute" });
        }
    } else {
        // Handle any non-POST requests
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
