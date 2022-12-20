const conversationController = require('./conversations.controllers')

const getAllConversations = (req, res) => {
    conversationController.findAllConversations()
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((err) => {
            res.status(400).json({message: err.message})
        })
}

const getConversationById = (req, res) => {

    const id = req.params.conversation_id
    conversationController.findConversationById(id)
        .then(data => {
            if(data){
                res.status(200).json(data)
            } else {
                res.status(404).json({message: 'Invalid ID'})
            }
        })
        .catch(err => {
            res.status(400).json({message: err.message})
        })
}

const postConversation = (req ,res) => {
    const {title, imageUrl, participantId} = req.body
    const ownerId = req.user.id 
    conversationController.createConversation({title, imageUrl, participantId, ownerId})
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            res.status(400).json({message: err.message, fields: {
                title: 'string',
                imageUrl: 'string',
                participantId: 'UUID'
            }})
        })
}

const patchConversation = (req, res) => {
    const id = req.params.conversation_id
    const { title, imageUrl } = req.body
    conversationController.updateConversation(id, {title, imageUrl})
        .then(data => {
            if(data){
                res.status(200).json({message: `Conversation with id: ${id} updated succesfully!`})
            } else {
                res.status(404).json({message: 'Invalid ID'})
            }
        })
        .catch(err => {
            res.status(400).json({message: err.message})
        })
}

const deleteConvesation = (req, res) => {
    const id = req.params.conversation_id
    conversationController.removeConversation(id)
        .then(data => {
            if(data){
                res.status(204).json()
            } else {
                res.status(404).json({message: 'Invalid ID'})
            }
        })
        .catch(err => {
            res.status(400).json({message: err.message})
        }) 
}

//find participants
const getConversationParticipants = (req,res) => {
    const conversationId = req.params.conversation_id
    conversationController.findConversationParticipants(conversationId)
        .then(data => {
            if(data){
                res.status(200).json(data)
            }else{
                res.status(404).json({message: "Invalid conversation Id"})
            }
        })
        .catch(err => {
            res.status(400).json({message: err.message})
        })
}
//Add participants
const postParticipants = (req,res) => {
    const conversationId = req.params.conversation_id
    const participantId = req.body.userId

    //verify if user already exists in the conversation
    conversationController.findParticipantById(conversationId,participantId)
        .then(data => {
            if(data){
                res.status(400).json({message: "User is already a participant"})
            }else{
                //if user is not in the conversation he will be added
                conversationController.addParticipants(conversationId,participantId)
                .then(data => {
                    if(data){
                        res.status(201).json({message: "participant added"})
                    }else{
                        res.status(404).json({message:"Invalid userId or conversationId"})
                    }
                })
                .catch(err => {
                    res.status(400).json({message: err.message})
                })    

            }
        })

    
}

//get one participant by id
const getParticipant = (req,res) => {
    const conversationId = req.params.conversation_id
    const participantId = req.params.participant_id
    conversationController.findParticipantById(conversationId,participantId)
        .then(data => {
            if(data){
                res.status(200).json(data)
            }else{
                res.status(404).json({message: "Participant not found"})
            }
        })
        .catch(err => {
            res.status(400).json({message: err.message})
        })
}

// Remove participant
const deleteParticipant = (req,res) => {
    const conversationId = req.params.conversation_id
    const participantId = req.params.participant_id
    conversationController.removeParticipant(conversationId,participantId)
        .then(data => {
            if(data){
                res.status(204).json()
            }else{
                res.status(404).json({message:"Participant not found"})
            }
        })
        .catch(err => {
            res.status(400).json({message: err.message})
        })
}

module.exports = {
    getAllConversations,
    postConversation,
    getConversationById,
    patchConversation,
    deleteConvesation,
    getConversationParticipants,
    postParticipants,
    getParticipant,
    deleteParticipant
}