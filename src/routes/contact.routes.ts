import express from 'express';
const router = express.Router();
import { createContact } from './../controllers/contact.controller';

router.post('/', createContact);

export default router;