import {createContactMethod} from './../methods/contact.method';

import {Request, Response} from 'express';


import client from './../db';

export const createContactTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS contact (
            id SERIAL PRIMARY KEY,
            phoneNumber VARCHAR(20),
            email VARCHAR(255),
            linkedId INTEGER,
            linkPrecedence VARCHAR(20),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deletedAt TIMESTAMP
        );
    `;
    try {
        await client.query(query);
        console.log('Contact table created or already exists.');
    } catch (error) {
        console.error('Error creating contact table:', error);
    }
};


export const createContact = async (req: Request, res: Response): Promise<void> => {
    try {
        createContactTable(); // Ensure the table exists before creating a contact
        const contact = req.body;
        const createdContact = await createContactMethod(contact);
        res.status(200).json({contact: createdContact, success: true});
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

