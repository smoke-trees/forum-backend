const router = require('express').Router()
const jwtAuth = require('../middleware/jwtAuth')
const jwtUnAuth = require('../middleware/jwtUnAuth')
const bson = require('bson')
const User = require('../modules/users/model')

const Thread = require('../modules/threads/model')

router.get('/one', jwtUnAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.query.threadId
  const response = await Thread.readThreadUsingId(threadId, req.app.locals.threadCollection, userId)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.get('/all', jwtUnAuth, async (req, res) => {
  const userId = req.userId
  const limit = req.query.limit || 30
  const response = await Thread.readAllThreads(limit, req.app.locals.threadCollection, userId)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.get('/allUnReplied', jwtUnAuth, async (req, res) => {
  const userId = req.userId
  const limits = req.query.limit || 30
  const response = await Thread.readAllUnRepliedThread(limits, req.app.locals.threadCollection, userId)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/delete', jwtAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.body._id
  const user = new User({ _id: bson.ObjectID.createFromHexString(userId) })
  const response = await user.deleteThread(threadId, req.app.locals.userCollection, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/update', jwtAuth, async (req, res) => {
  const userId = req.userId
  const thread = req.body.thread
  const user = new User({ _id: bson.ObjectID.createFromHexString(userId) })
  thread._id = bson.ObjectID.createFromHexString(thread._id)
  const response = await Thread.updateThreadContent(thread, user._id.toHexString(), req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/star', jwtAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.body.threadId
  const user = new User({ _id: bson.ObjectID.createFromHexString(userId) })
  const response = await user.addStar(threadId, req.app.locals.userCollection, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/unstar', jwtAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.body.threadId
  const user = new User({ _id: bson.ObjectID.createFromHexString(userId) })
  const response = await user.removeStar(threadId, req.app.locals.userCollection, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/upvote', jwtAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.body.threadId
  await Thread.removeDownvote(threadId, userId, req.app.locals.threadCollection)
  const response = await Thread.addUpvote(threadId, userId, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/downvote', jwtAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.body.threadId
  await Thread.removeUpvote(threadId, userId, req.app.locals.threadCollection)
  const response = await Thread.addDownvote(threadId, userId, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/removeUpvote', jwtAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.body.threadId
  const response = await Thread.removeUpvote(threadId, userId, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.post('/removeDownvote', jwtAuth, async (req, res) => {
  const userId = req.userId
  const threadId = req.body.threadId
  const response = await Thread.removeDownvote(threadId, userId, req.app.locals.threadCollection)
  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

router.get('/search', jwtUnAuth, async (req, res) => {
  const query = req.query.q

  const lastDate = req.query.ld || Date.now()

  const userId = req.userId
  const response = await Thread.search(query, lastDate, req.app.locals.threadCollection, userId)

  if (response.status) {
    res.status(200).json(response)
  } else if (response.err) {
    res.status(500).json(response)
  } else {
    res.status(400).json(response)
  }
})

module.exports = router
