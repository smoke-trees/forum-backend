const { assert } = require('chai')
const { describe, beforeEach, it } = require('mocha')
const app = require('../app')
const Thread = require('../modules/threads/model')
const Reply = require('../modules/replies/model')
const bson = require('bson')

describe('# Replies test-suite', function () {
  beforeEach(async function () {
    await app.locals.dbClient
    try {
      await app.locals.threadCollection.drop()
    } catch (e) {
    }
  })

  describe('# CRUD for replies', function () {
    it('Create a new Reply', async function () {
      const thread = new Thread({ content: 'reply thread', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res1 = await thread.createThread(app.locals.threadCollection)
      assert.isTrue(res1.status)

      const reply = new Reply({ content: 'reply', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res2 = await reply.createReply(thread._id.toHexString(), app.locals.threadCollection)
      assert.isTrue(res2.status)

      thread._id = '231231'
      const res3 = await reply.createReply(thread._id, app.locals.threadCollection)
      assert.isFalse(res3.status)
    })
    it('update a Reply', async function () {
      const thread = new Thread({ content: 'update thread', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res1 = await thread.createThread(app.locals.threadCollection)
      assert.isTrue(res1.status)

      const reply1 = new Reply({ content: 'reply 1', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res2 = await reply1.createReply(thread._id.toHexString(), app.locals.threadCollection)
      assert.isTrue(res2.status)

      const reply2 = new Reply({ content: 'reply 2', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res3 = await reply2.createReply(thread._id.toHexString(), app.locals.threadCollection)
      assert.isTrue(res3.status)
      reply2.content = 'update reply'

      const res4 = await reply2.updateReplyContent(thread._id.toHexString(), app.locals.threadCollection)
      assert.isTrue(res4.status)

      reply2._id = new bson.ObjectID(bson.ObjectID.generate())
      const res5 = await reply2.updateReplyContent(thread._id.toHexString(), app.locals.threadCollection)
      assert.isFalse(res5.status)
    })
    it('delete a Reply', async function () {
      const thread = new Thread({ content: 'delete thread', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res1 = await thread.createThread(app.locals.threadCollection)
      assert.isTrue(res1.status)

      const reply1 = new Reply({ content: 'reply 1', author: new bson.ObjectID(bson.ObjectID.generate()) })
      const res2 = await reply1.createReply(thread._id.toHexString(), app.locals.threadCollection)
      assert.isTrue(res2.status)

      const res3 = await Reply.deleteReply(thread._id.toHexString(), reply1._id.toHexString(), app.locals.threadCollection)
      assert.isTrue(res3.status)

      const res4 = await Reply.deleteReply(thread._id.toHexString(), reply1._id.toHexString(), app.locals.threadCollection)
      assert.isFalse(res4.status)
    })
  })
})