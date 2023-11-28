import { Engine } from "@api/engine";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { doc } = req.body;
            const engine = new Engine(); // Assuming Engine is a class you've defined or imported
            const feedback = engine.checkDoc(doc);

            res.status(200).json({
                inputText: text,
                feedback: feedback,
            });
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
