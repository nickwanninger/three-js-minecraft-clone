const User = require('./schemas/User')
const School = require('./schemas/School')
const path = require('path')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
module.exports = app => {
	const passport = require('passport')
	passport.use(
		new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
			if (req.body.school) {
				School.findOne({ key: req.body.school }).exec((err, schoolDoc) => {
					if (schoolDoc) {
						const regex = new RegExp('^' + username + '$', 'i')
						User.findOne({ $or: [ { username: { $regex: regex } } ] }, '+password')
							.populate('school')
							.exec((err, user) => {
								if (err) return done(err)
								if (!user) return done(null, false)
								user.verifyPassword(password, (pwErr, isMatch) => {
									if (isMatch) {
										done(null, user)
									} else {
										done(pwErr, null)
									}
								})
							})
					} else {
						done('Invalid School')
					}
				})
			} else {
				done('No school provided', null)
			}
		})
	)
	passport.serializeUser((user, done) => {
		done(null, user)
	})
	passport.deserializeUser((obj, done) => {
		User.findById(obj._id).populate('school').cache().exec(done)
	})
	app.use(
		session({
			secret: 'monstrocat3000',
			resave: true,
			proxy: true,
			saveUninitialized: false,
			store: new MongoStore({
				mongooseConnection: mongoose.connection
			})
		})
	)
	app.use(passport.initialize())
	app.use(passport.session())
	app.post('/api/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) {
				return res.send({ success: false, data: err })
			}
			if (!user) {
				return res.send({ success: false, data: err })
			}
			req.logIn(user, function(err) {
				if (err) {
					return res.send({ success: false, data: err })
				}
				return res.send({ success: true, data: user })
			})
		})(req, res, next)
	})
}
