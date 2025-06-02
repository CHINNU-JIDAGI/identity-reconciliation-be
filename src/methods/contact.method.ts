import client from './../db';
import Contact from '../tables/contact.table';

type ContactResponse = {
    primaryContactId: number | null;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
};

export const createContactMethod = async (contact: Contact): Promise<ContactResponse> => {
    // find if contact already exists with same email or phone number
    let response = {
        primaryContactId: null,
        emails: [] as string[],
        phoneNumbers: [] as string[],
        secondaryContactIds: [] as number[]
    };

    const existingContactQuery = `
        SELECT * FROM contact 
        WHERE phoneNumber = $1 OR email = $2
    `;

    const existingValues = [contact.phoneNumber, contact.email];

    let existingContact = null;
    try {
        const existingRes = await client.query(existingContactQuery, existingValues);
        for (let row of existingRes.rows) {
            if (row.linkprecedence === 'primary') {
                existingContact = row;
                response.primaryContactId = row.id;
            } else {
                response.secondaryContactIds.push(row.id);
            }

            if (row.email) {
                if (!response.emails.includes(row.email)) {
                    response.emails.push(row.email);
                }
            }
            if (row.phonenumber) {
                if (!response.phoneNumbers.includes(row.phonenumber)) {
                    response.phoneNumbers.push(row.phonenumber);
                }
            }
        }

    } catch (error) {
        throw error;
    }

    if (!existingContact) {
        contact.linkPrecedence = 'primary';
    } else {
        contact.linkedId = existingContact.id;
        contact.linkPrecedence = 'secondary';
    }


    const query = `
        INSERT INTO contact (phoneNumber, email, linkedId, linkPrecedence)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [contact.phoneNumber, contact.email, contact.linkedId, contact.linkPrecedence];

    try {
        const res = await client.query(query, values);
        if (res.rows[0].linkprecedence === 'primary') {
            response.primaryContactId = res.rows[0].id;
        } else if (!response.secondaryContactIds.includes(res.rows[0].id)) {
            response.secondaryContactIds.push(res.rows[0].id);
        }
        if (res.rows[0].email && !response.emails.includes(res.rows[0].email)) {
            response.emails.push(res.rows[0].email);
        }
        if (res.rows[0].phonenumber && !response.phoneNumbers.includes(res.rows[0].phonenumber)) {
            response.phoneNumbers.push(res.rows[0].phonenumber);
        }
        
        return response;
    } catch (error) {
        console.error('Error creating contact:', error);
        throw error;
    }
}