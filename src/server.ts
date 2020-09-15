import express from 'express';
import cors from 'cors';

const PORT = 4000;

const {JWT_SECRET = 'secret'} = process.env;

const app = express();

app.use(express.json());

app.use(cors());


app.get('/', (req, res) => {
    res.send('Hi there!');
})

app.listen(PORT, () => console.log(`Server is up at ${PORT}`));