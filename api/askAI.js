// /api/askAI.js (Vercel Serverless Function)
export default async function handler(req, res) {
    const { question } = req.body;

    if (!process.env.OPENAI_KEY || !process.env.OPENAI_PROJECT_ID) {
        return res.status(400).json({ error: "API Key atau Project ID tidak ditemukan di .env" });
    }

    try {
        const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
                'OpenAI-Project': process.env.OPENAI_PROJECT_ID
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",   // versi terbaru + murah + cepat
                messages: [
                    {
                        role: "system",
                        content: "Kamu adalah AI ramah, membantu dan menjawab singkat namun jelas."
                    },
                    {
                        role: "user",
                        content: question
                    }
                ],
                max_tokens: 200
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
