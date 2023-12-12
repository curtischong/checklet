import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse): void => {
    if (req.method === "POST") {
        const { text } = req.body;
        res.status(200).json({ text: text });
    }
    return;
};
