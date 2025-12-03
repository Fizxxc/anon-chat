// /api/autoReplyAI.js
export default async function handler(req, res) {
    const { message } = req.body;

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
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "system",
                        content: "Balas pesan seperti teman ngobrol, tidak kaku, santai dan relevan."
                    },
                    {
                        role: "user",
                        content: `Balas secara singkat pesan berikut: "${message}"`
                    }
                ],
                max_tokens: 150
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
