const { assert } = require('chai')
const { describe, beforeEach, it, after } = require('mocha')
const app = require('../../app')
const Thread = require('../../modules/threads/model')
const bson = require('bson')

after(async function () {
  await app.locals.dbClient.close()
})

describe('# Threads test-suite', function () {
  beforeEach(async function () {
    await app.locals.dbClient
    await app.locals.threadCollection.drop()
  })
  describe('# Crud Operations', async function () {
    // Create a thread
    it('create a new thread', function (done) {
      const thread = new Thread({ content: 'test content', author: new bson.ObjectID(bson.ObjectID.generate()) })
      thread.newThread(function (res) {
        if (!res.status) {
          done(res.status)
        } else {
          done()
        }
      })
    })
    // Create and update the thread
    it('update a thread', function (done) {
      const thread = new Thread({ content: 'test content', author: new bson.ObjectID(bson.ObjectID.generate()) })
      thread.newThread(function (res) {
        if (!res.status) {
          done(res.status)
        } else {
          thread.content = 'update content'
          thread.updateThreadContentUsingId(function (res) {
            if (!res.status) {
              done(res.status)
            } else {
              done()
            }
          })
        }
      })
    })
    // Create and update the thread
    it('read a thread', function (done) {
      const thread = new Thread({ content: 'read content', author: new bson.ObjectID(bson.ObjectID.generate()) })
      thread.newThread(function (res) {
        if (!res.status) {
          done(res.status)
        } else {
          const insertId = res.id
          Thread.readThreadUsingId(res.id, function (res1) {
            if (!res1.status) {
              done(res1.status)
            } else {
              assert.equal(res1.thread._id.toHexString(), insertId)
              done()
            }
          })
        }
      })
    })
  })
  //
})
