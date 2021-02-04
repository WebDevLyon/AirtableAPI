require('dotenv').config()
const cors = require('cors')
const jwt = require('jsonwebtoken')

//Router
const tournoisRoutes = require('./routes/tournois.js')

// Variable
let listTournois = ['Sélectionner un tournois']
// User test pour auth
const users = [{ id: '1', username: 'nijlak', password: '123' }]
const SECRET = 'TOKEN'

const express = require('express')

// Création App Express

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors())


// Middleware
/* Récupération du header bearer */
const extractBearerToken = (headerValue) => {
	if (typeof headerValue !== 'string') {
		return false
	}

	const matches = headerValue.match(/(bearer)\s+(\S+)/i)
	return matches && matches[2]
}

/* Vérification du token */
const checkTokenMiddleware = (req, res, next) => {
	// Récupération du token
	const token =
    req.headers.authorization && extractBearerToken(req.headers.authorization)

	// Présence d'un token
	if (!token) {
		return res.status(401).json({ message: 'Error. Need a token' })
	}

	// Véracité du token
	jwt.verify(token, SECRET, (err, decodedToken) => {
		if (err) {
			res.status(401).json({ message: 'Error. Bad token' })
		} else {
			return next()
		}
	})
}

// Logique
app.use('/',tournoisRoutes)


/* Formulaire de connexion */
app.post('/login', (req, res) => {
	// Pas d'information à traiter
	if (!req.body.username || !req.body.password) {
		return res.status(400).json({
			message: 'Error. Please enter the correct username and password',
		})
	}

	// Checking
	const user = users.find(
		(u) => u.username === req.body.username && u.password === req.body.password
	)

	// Pas bon
	if (!user) {
		return res.status(400).json({ message: 'Error. Wrong login or password' })
	}

	const token = jwt.sign(
		{
			id: user.id,
			username: user.username,
		},
		SECRET,
		{ expiresIn: '24 hours' }
	)

	return res.json({ token: token })
})

app.get('/me', checkTokenMiddleware, (req, res) => {
	// Récupération du token
	const token =
    req.headers.authorization && extractBearerToken(req.headers.authorization)
	// Décodage du token
	const decoded = jwt.verify(token, SECRET, { complete: false })

	return res.json({ user: decoded })
})

app.post('/register', (req, res) => {
	// Aucune information à traiter
	if (!req.body.username || !req.body.password) {
		return res
			.status(400)
			.json({ message: 'Error. Please enter username and password' })
	}

	// Checking
	const userExisting = users.find((u) => u.username === req.body.username)

	// Pas bon
	if (userExisting) {
		return res
			.status(400)
			.json({ message: `Error. User ${req.body.username} already existing` })
	}

	// Données du nouvel utilisateur
	const id = users[users.length - 1].id + 1
	const newUser = {
		id: id,
		username: req.body.username,
		password: req.body.password,
	}

	// Insertion dans le tableau des utilisateurs
	users.push(newUser)

	return res.status(201).json({ message: `User ${id} created` })
})

app.listen(process.env.PORT || 3000, () =>
	console.log('Server started on port ' + process.env.PORT + '...')
)

