const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Surname: {
        type: String,
        required: true
    },
    PhoneNumber:{
        type: String,
        required: true
    },
}, { timestamps: true});


personSchema.statics.findPersons = async function (query) {
    try {
        const caseInsensitiveQuery = {};
        for (const key in query) {
            caseInsensitiveQuery[key] = new RegExp(query[key], 'i');
        }

        const persons = await this.find(caseInsensitiveQuery);
        return persons;
    } catch (error) {
        //throw new Error(`Error finding persons: ${error.message}`);
    }
};

const PersonData = mongoose.model('Records', personSchema); 
module.exports = PersonData;
