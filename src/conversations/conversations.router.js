const router = require('express').Router()
const conversationServices = require('./conversations.services')
const messageServices = require('../messages/messages.services')
const passportJWT = require('../middlewares/auth.middleware')
const participantValidate = require('../middlewares/participantValidate.middleware')

router.route('/')
    .get(passportJWT.authenticate('jwt', {session: false}), conversationServices.getAllConversations)
    .post(passportJWT.authenticate('jwt', {session: false}), conversationServices.postConversation)

router.route('/:conversation_id')
    .get(passportJWT.authenticate('jwt', {session: false}), conversationServices.getConversationById)
    .patch(passportJWT.authenticate('jwt', {session: false}), conversationServices.patchConversation)
    .delete(passportJWT.authenticate('jwt', {session: false}), conversationServices.deleteConvesation)


router.route('/:conversation_id/messages')
    .post(passportJWT.authenticate('jwt', {session: false}), participantValidate, messageServices.postMessage)

//conversation participants
router.route('/:conversation_id/participants')
    //get conversation participants
    .get(passportJWT.authenticate('jwt', {session: false}),participantValidate, conversationServices.getConversationParticipants)
    .post(passportJWT.authenticate('jwt', {session: false}),participantValidate,conversationServices.postParticipants)
//get one participant or delete one 
router.route('/:conversation_id/participants/:participant_id')
    .get(passportJWT.authenticate('jwt', {session: false}),participantValidate,conversationServices.getParticipant)
    .delete(passportJWT.authenticate('jwt', {session: false}),participantValidate,conversationServices.deleteParticipant)

module.exports = router
