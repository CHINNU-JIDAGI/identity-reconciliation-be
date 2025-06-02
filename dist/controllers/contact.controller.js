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
exports.createContact = exports.createContactTable = void 0;
const contact_method_1 = require("./../methods/contact.method");
const db_1 = __importDefault(require("./../db"));
const createContactTable = () => __awaiter(void 0, void 0, void 0, function* () {
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
        yield db_1.default.query(query);
        console.log('Contact table created or already exists.');
    }
    catch (error) {
        console.error('Error creating contact table:', error);
    }
});
exports.createContactTable = createContactTable;
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, exports.createContactTable)(); // Ensure the table exists before creating a contact
        const contact = req.body;
        const createdContact = yield (0, contact_method_1.createContactMethod)(contact);
        res.status(200).json({ contact: createdContact, success: true });
    }
    catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createContact = createContact;
