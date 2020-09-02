const {Telegraf}  = require('telegraf');

const MS_PER_DAY = 86400000;
const NEGATIVE_EMOJI = '🖕🏼';
const CLOCK_EMOJI = '🕒';
const QUEUE_EMOJI = '📋';
const WARNING_EMOJI = '⚠️';
const CONFUSION_EMOJI = '🤔';

class TelegramService{
    constructor(){
        this.targetChatId = parseInt(process.env.TELEGRAM_BOT_TARGET_CHAT_ID);
        this.token = process.env.TELEGRAM_BOT_TOKEN || false;

        this.systemMetaInfo = {};

        if (!this.token){
            console.error('Missing token for Telegram notification bot');
        }else{
            this.bot = new Telegraf(this.token);
            this.setAuthMiddleware();
            this.setMessageAndCommandHandlers();
        }
    }

    run(){
        const classContext = this;

        this.bot.stop(()=>{
            classContext.isUp = false;
        });

        return this.bot.launch().finally(() => {
            this.isUp = this.bot.polling.started;
            if (this.isUp){
                this.startedAt = Date.now();
            }
        });
    }

    setAuthMiddleware(){
        this.bot.use(async (ctx, next) => {
            if (parseInt(ctx.chat.id) === this.targetChatId){
                next();
            }else{
                ctx.message.text === NEGATIVE_EMOJI ? ctx.reply('Nah, fuck you ♂leatherman ♂') : ctx.reply(`${NEGATIVE_EMOJI} I don't talk to strangers! Your id is ${ctx.chat.id} by the way.`);
            }
        });
    }

    setMessageAndCommandHandlers(){
        this.bot.telegram.setMyCommands([
                {command:'uptime', description: 'Displayed format: DdMM:HH:SS'},
                {command:'qlen', description: 'Amount of messages in queue'}
            ]);

        this.bot.command('uptime', (ctx) => ctx.reply(`${CLOCK_EMOJI} My uptime is ${this.calculateUptime()}`));

        this.bot.command('qlen', async (ctx) => ctx.reply(`${QUEUE_EMOJI} Amount of messages in Redis queue: ${this.getPlayerQueueMessagesAmount()}`));

        this.bot.on('message', (ctx) => {
            return ctx.reply(`${CONFUSION_EMOJI} Unfortunately I don't understand what you're saying.`);
        });
    }

    sendWarning(warningText){
        return this.bot.telegram.sendMessage(this.targetChatId, `${WARNING_EMOJI} Warning: ${warningText}`);
    }

    sendMessage(messageText){
        return this.bot.telegram.sendMessage(this.targetChatId, messageText);
    }

    calculateUptime(){
        const diffInMs = Date.now() - this.startedAt;
        return this.startedAt ? this.formatUptime(diffInMs) : 0;
    }

    formatUptime(uptimeInMs){
        const daysPassed = Math.round(uptimeInMs / MS_PER_DAY);
        const isoStringTimeStartIndex = 11;
        const isoTimeSubstringLength = 8;
        return uptimeInMs ? `${daysPassed}d${new Date(uptimeInMs).toISOString().substr(isoStringTimeStartIndex, isoTimeSubstringLength)}` : 0;
    }

     getPlayerQueueMessagesAmount(){
        return typeof this.systemMetaInfo.queueLength === 'number' ? this.systemMetaInfo.queueLength : 'unknown';
    }

    setSystemMetaInfo(key, value){
        this.systemMetaInfo[key] = value;
    }
}

module.exports = TelegramService;