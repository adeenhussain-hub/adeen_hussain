const msgModel =  require('../models/msgModel')
const Model =  new msgModel

class msgController{
    async getChatHistory(req, res){
        try {
            const senderId = req.user.id;
            const receiverId = req.params.id
            const results = await Model.getChatHistoryById(senderId, receiverId)
            console.log("Sender from token:", senderId, "Receiver from params:", receiverId);

            if(results.length === 0) return res.status(404).json({message : "No message Found"})
            return res.status(200).json({message : "Successfull", Messages : results})

        } catch (error) {
            console.log(error)
            return res.status(500).json({message : "Server Error", error : error})
        }
    }    
}

module.exports = new msgController();