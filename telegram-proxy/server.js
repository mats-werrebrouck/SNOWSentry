const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())

// Proxy route
app.post('/send-message', async (req, res) => {
    const { chatId, message } = req.body;

    try {
        const response = await axios.post('https://api.telegram.org/bot7021667199:AAE6rGmLqnMMUXoHgYB0wAm32m900xdjonk/sendMessage', {
            chat_id: chatId,
            text: message
        });

        res.status(response.status).json(respone.data);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
