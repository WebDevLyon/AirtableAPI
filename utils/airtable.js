const Airtable = require('airtable')

// Connect Airtable
exports.connect= ()=>{
	// ENV VARIABLE
	const apiKey = process.env.AIRTABLE_API_KEY
	const baseId = process.env.AIRTABLE_BASE_ID
	return new Airtable({ apiKey: apiKey }).base(baseId)
}