const bson = require('bson')
const logger = require('../../logging/logger')

class Reply {
  constructor (object) {
    this._id = object._id
    this.content = object.content
    this.content = object.author
    this.upvotes = object.upvotes
    this.downvotes = object.downvotes
    this.dateTime = object.dateTime
    this.reports = object.reports
  }

  async newReply (threadId, threadCollection) {
    let response
    try {
      const filter = {
        _id: bson.ObjectID.createFromHexString(threadId)
      }
      this._id = bson.ObjectId.generate()
      this.dateTime = Date.now()
      const query = {
        $push: {
          replies: this
        }
      }
      const res = await threadCollection.update(filter, query)
      if (res.modifiedCount !== 1) {
        response = {
          status: false,
          msg: `Unable to create a reply for thread:${threadId} replyId:${this._id}`,
        }
        logger.debug(response.msg)
      } else {
        response = {
          status: true,
          msg: 'success',
          replyId: this._id.toHexString()
        }
        logger.debug(`New reply for thread:${threadId} replyId:${this._id}`)
      }
    } catch (e) {
      response = {
        status: false,
        err: e
      }
    }
    return response
  }
}

module.exports = Reply
