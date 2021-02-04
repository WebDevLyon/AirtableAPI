const airtable = require('../utils/airtable.js')
const base = airtable.connect()

//Logique tournois

exports.getTournois = (req, res) => {
	let list = []
	base(req.query.base)
		.select({
			view: 'Main',
		})
		.eachPage(
			function page(records, fetchNextPage) {
				records.forEach(function (record) {
					list.push({
						name: record.get('Nom'),
						id: record.id,
						start: record.get('Date_debut'),
						end: record.get('Date_Fin'),
						Envoi_1: record.get('Envoi_1'),
						Envoi_1_Fait: record.get('Envoi_1_Fait'),
						Envoi_2: record.get('Envoi_2'),
						Envoi_2_Fait: record.get('Envoi_2_Fait'),
						Envoi_3: record.get('Envoi_3'),
						Envoi_3_Fait: record.get('Envoi_3_Fait'),
						order: record.get('Ordre du chèque'),
						linkBadiste: record.get('Lien_Badiste'),
						adresse: record.get('Adresse'),
					})
					console.log(list)
				})
				fetchNextPage()
				res.status(200).json({ Retrieved: list })
			},
			function done(err) {
				if (err) {
					res.status(404).json(err)
				}
			}
		)
}

exports.getOneTournoi = (req, res) => {
	base(req.query.base).find(req.query.id, function (err, record) {
		if (err) {
			res.status(404).json(err)
		}
		res.status(200).json({ Retrieved: record.fields })
	})
}

exports.modifTournoi = (req, res) => {
	base('Tournois').update(
		[
			{
				id: req.body.id,
				fields: req.body.data,
			},
		],
		function (err, records) {
			if (err) {
				res.json(err)
				return
			}
			records.forEach(function (record) {
				res.json({ result: record })
			})
		}
	)
}

exports.delTournoi =  (req, res) => {
	base('Tournois').destroy(req.body.id, function (err, deletedRecords) {
		if (err) {
			console.error(err)
			return
		}
		res.json({ Deleted: deletedRecords.length + ' records' })
	})
}