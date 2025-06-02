"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactMethod = void 0;
const db_1 = __importDefault(require("./../db"));
const createContactMethod = (contact) => __awaiter(void 0, void 0, void 0, function* () {
    // find if contact already exists with same email or phone number
    let response = {
        primaryContactId: null,
        emails: [],
        phoneNumbers: [],
        secondaryContactIds: []
    };
    const existingContactQuery = `
        SELECT * FROM contact 
        WHERE phoneNumber = $1 OR email = $2
        ORDER BY id ASC
    `;
    const existingValues = [contact.phoneNumber, contact.email];
    let existingContact = null;
    try {
        const existingRes = yield db_1.default.query(existingContactQuery, existingValues);
        for (let row of existingRes.rows) {
            if (row.linkprecedence === 'primary') {
                if (response.primaryContactId) {
                    row.linkprecedence = 'secondary';
                    row.linkedId = response.primaryContactId;
                    yield db_1.default.query(`UPDATE contact SET linkPrecedence = 'secondary', linkedId = $1 WHERE id = $2`, [response.primaryContactId, row.id]);
                    response.secondaryContactIds.push(row.id);
                }
                else {
                    existingContact = row;
                    response.primaryContactId = row.id;
                }
            }
            else {
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
    }
    catch (error) {
        throw error;
    }
    if (!existingContact) {
        contact.linkPrecedence = 'primary';
    }
    else {
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
        yield db_1.default.query(query, values);
        return response;
    }
    catch (error) {
        console.error('Error creating contact:', error);
        throw error;
    }
});
exports.createContactMethod = createContactMethod;
