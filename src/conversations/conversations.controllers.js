const uuid = require('uuid')

const Conversations = require('../models/conversations.models')
const Participants = require('../models/participants.models')
const Users = require('../models/users.models')

const findAllConversations = async () => {
    const data = await Conversations.findAll({
        include: {
            model: Participants,
            include: {
                model : Users
            }
        }
    })
    return data
}

const findConversationById = async (id) => {
    const data = await Conversations.findOne({
        where: {
            id: id
        },
        include: {
            model: Participants,
            include: {
                model: Users
            }
        }
    })
    return data
}

const createConversation = async (obj) => {
    const newConversation = await Conversations.create({
        id: uuid.v4(),
        title: obj.title,
        imgUrl: obj.imgUrl,
        userId: obj.ownerId //? Creador de la conversacion (owner)
    })
    const participant1 = await Participants.create({
        id: uuid.v4(),
        userId: obj.ownerId, //? este es el owner que viene desde el token
        conversationId: newConversation.id
    })
    const participant2 = await Participants.create({
        id: uuid.v4(),
        userId: obj.participantId, //? Este es el otro usuario que viene desde el body
        conversationId: newConversation.id
    })

    return {
        newConversation,
        participant1,
        participant2
    }
}

const updateConversation = async(id, obj) => {
    const data = await Conversations.update(obj, {
        where: {
            id: id
        }
    })
    return data[0] //? array
    //?  [1] Se edito algo correctamente (si encontro el id)
    //? [0] No se edito nada (porque no encontro el id)
}


const removeConversation = async (id) => {
    const data = await Conversations.destroy({
        where: {
            id: id
        }
    })
    return data
}



//optional challenges
//finds all participants of a conversation
const findConversationParticipants = async (conversationId) => {
    const data = await Participants.findAll({
        where: {
            conversationId: conversationId
        }
    })
    return data
}
//add new participant
const addParticipants = async (conversationId,userId) => {
    const participant = await Participants.create({
        id: uuid.v4(),
        userId: userId,
        conversationId: conversationId
    })
    return participant
}
//get participant by id
const findParticipantById = async (conversationId, userId) => {
    const participant = await Participants.findOne({
        where: {
            userId: userId,
            conversationId: conversationId
        }
    })
    return participant
}
//remove a participant
const removeParticipant = async (conversationId,userId) => {
    const participant = await Participants.destroy({
        where: {
            conversationId: conversationId,
            userId: userId
        }
    })
    return participant
}

module.exports = {
    findAllConversations,
    createConversation, 
    findConversationById,
    updateConversation,
    removeConversation,
    findConversationParticipants,
    addParticipants,
    findParticipantById,
    removeParticipant
}
