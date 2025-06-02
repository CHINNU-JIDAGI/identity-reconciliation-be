import express from 'express';
import userRoute from './routes/contact.routes';

const app = express();
app.use(express.json());

app.use('/identity', userRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});