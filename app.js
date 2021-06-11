const { App } = require("@slack/bolt")
require('dotenv').config()

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode:true,
    appToken: process.env.APP_TOKEN
})

app.command('/info',async({command,ack,say})=>{
    try{
        await ack
        say('Yaay! that command works')
    }catch (error){
        console.log('err')
        console.log(error)
    }
})

app.message("hey", async({command,say})=>{
    try{
        await say('Sup its working')
    }catch(error){
        console.log('error')
        console.log(error)
    }
})




const startServer = async () => {
    const port = 3000

     await app.start(port || process.env.PORT)
        .then(r =>console.log(`⚡️ Slack Bolt app is running on port ${port}!`))
}

startServer()