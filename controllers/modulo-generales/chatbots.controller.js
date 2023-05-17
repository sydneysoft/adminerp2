const RestBuilder = require('../builder.controller');

const ChatBotBuilder = new RestBuilder();

const ChatBotController = ChatBotBuilder.setTable('chatbots').setName('Chatbot');

module.exports = {ChatBotController}
