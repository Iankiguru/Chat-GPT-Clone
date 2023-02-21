import express from 'express';
import * as dotenv from  'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', async (req, res) => {
    res.status(200)
    .send({
        message: 'Hello World from Codex!'
    })
});

app.post('/', async(req, res) => {
    try{
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model:"text-davinci-003",
            prompt:`${prompt}`,
            temperature:0.3,
            max_tokens:3000,
            top_p : 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (e){
        console.log(e);
        res.status(500).send({
            error: e
        })
    }
});

app.listen(5000,() => {
    console.log('listening on port http://localhost:5000');
});
