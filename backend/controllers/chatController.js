import OpenAI from 'openai';

// @desc    Handle chat message
// @route   POST /api/chat
// @access  Public
export const handleChat = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!process.env.OPENAI_API_KEY) {
            return res.status(503).json({
                success: false,
                message: 'AI service is currently unavailable (API Key missing)'
            });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Construct messages array with system prompt and history
        const messages = [
            {
                role: 'system',
                content: `You are a helpful, friendly, and professional AI assistant for ShoeStore, a premium footwear e-commerce platform. 
                Your goal is to assist customers with product inquiries, order status, sizing advice, and general questions.
                
                Tone: Professional, enthusiastic, and concise.
                
                Key Information:
                - We sell high-quality sneakers and athletic shoes.
                - We offer free shipping on orders over $100.
                - Returns are accepted within 30 days.
                - Support email: support@shoestore.com
                
                If you don't know an answer, politely ask the user to contact support.`
            },
            ...(history || []).map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            { role: 'user', content: message }
        ];

        const completion = await openai.chat.completions.create({
            messages: messages,
            model: 'gpt-3.5-turbo', // Cost-effective and fast
            max_tokens: 150,
            temperature: 0.7,
        });

        const aiResponse = completion.choices[0].message.content;

        res.status(200).json({
            success: true,
            message: aiResponse
        });

    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({
            success: false,
            message: 'I apologize, but I am having trouble connecting to my brain right now. Please try again later.'
        });
    }
};
