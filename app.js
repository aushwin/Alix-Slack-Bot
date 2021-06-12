const { MongoClient } = require("mongodb");

const { App } = require("@slack/bolt")
require('dotenv').config()

// Slack Bot Api
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode:true,
    appToken: process.env.APP_TOKEN
})
const channelId = "C024TJSV01G";

async function logAtChannel (dbChange) {
    let message = `name : ${dbChange.fullDocument.name}\ntask : ${dbChange.fullDocument.task}\nproject : ${dbChange.fullDocument.project}\nstatus : ${dbChange.fullDocument.status}`
    try {
        console.log('logAtChannel kerunund')
        // Call the chat.postMessage method using the WebClient
        const result = await app.client.chat.postMessage({
            channel: channelId,
            text: message
        });

        console.log(result);
    }
    catch (error) {
        console.error(error);
    }
}

//dB watch()
const uri = "mongodb+srv://admin:admin@cluster0.nsmjz.mongodb.net/TaskLogger?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let changeStream;
async function watchForChange() {
    try {
        await client.connect();
        const database = client.db("TaskLogger");
        const movies = database.collection("Tasks");
        // open a Change Stream on the "movies" collection
        changeStream = movies.watch();
        // set up a listener when change events are emitted
        changeStream.on("change", (next) => {
            logAtChannel(next)
            // process any change event
            console.log("received a change to the collection: \t", next);
        });
    }catch (e){
        console.log(e)
    }
}


const startServer = async () => {
    const port = 3000

     await app.start(port || process.env.PORT)
        .then(r =>console.log(`⚡️ Slack Bolt app is running on port ${port}!`))
}

watchForChange()
startServer()