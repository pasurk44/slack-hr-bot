# Slack HR Bot

Automatically responds to HR-related questions in Slack using your Notion database and static responses.

## What This Bot Does

- 🤖 **Auto-responds** to HR questions in Slack channels
- 📋 **Reads your Notion database** for up-to-date answers
- 🧵 **Responds in threads** to keep channels clean
- 📱 **Works with @mentions** and regular messages
- ⚡ **Fast responses** using cached keywords

## Example Questions It Answers

- "Do we have Juneteenth off?" → Gets holiday info
- "What's our PTO policy?" → Explains time off
- "How do stock options work?" → Equity information
- "When is payroll?" → Payment schedule
- "What benefits do we have?" → Benefits overview

## Quick Setup Guide

### 1. Create Slack App (5 minutes)

1. Go to **api.slack.com/apps** → **Create New App** → **From scratch**
2. Name: "HR Bot", select your workspace
3. **OAuth & Permissions** → Add these Bot Token Scopes:
   - `chat:write`
   - `reactions:write`
   - `channels:read`
   - `app_mentions:read`
4. **Install App to Workspace**
5. **Copy your Bot User OAuth Token** (starts with `xoxb-`)
6. **Basic Information** → Copy your **Signing Secret**

### 2. Setup Notion Integration (Optional - 3 minutes)

1. Go to **notion.so/my-integrations** → **New integration**
2. Name: "HR Bot" → **Submit**
3. **Copy the Integration Token** (starts with `secret_`)
4. **Share your HR database** with this integration
5. **Copy Database ID** from your database URL

### 3. Deploy to Render (10 minutes)

1. **Upload these files to a new GitHub repository**
2. Go to **render.com** → **New Web Service**
3. **Connect your GitHub** → Select your repository
4. **Settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Environment Variables** (click "Add Environment Variable"):
   - `SLACK_BOT_TOKEN` = your bot token from step 1
   - `SLACK_SIGNING_SECRET` = your signing secret from step 1
   - `NOTION_TOKEN` = your Notion token from step 2 (optional)
   - `NOTION_DATABASE_ID` = your database ID from step 2 (optional)
6. **Create Web Service** → Wait for deployment

### 4. Connect Slack App to Your Bot (2 minutes)

1. **Back in api.slack.com/apps** → Your app → **Event Subscriptions**
2. **Enable Events** → **Request URL**: `https://your-app-name.onrender.com/slack/events`
3. **Subscribe to Bot Events**:
   - `message.channels`
   - `app_mention`
4. **Save Changes**
5. **Add bot to your Slack channels**: `/invite @HR Bot`

## How to Customize Responses

Edit the `keywordResponses` object in `app.js` to add/modify responses:

```javascript
'your_topic': {
  keywords: ['keyword1', 'keyword2', 'phrase'],
  response: "Your custom response here"
}
```

Then commit changes to GitHub - Render will auto-deploy.

## Testing

1. **In Slack**: Type "Do we have Juneteenth off?" in a channel with the bot
2. **Should respond**: "📅 Yes! Juneteenth (June 19th) is a company holiday..."
3. **Try @mentions**: "@HR Bot what's our PTO policy?"

## Troubleshooting

- **Bot not responding**: Check Environment Variables in Render
- **"URL verification failed"**: Make sure Request URL ends with `/slack/events`
- **Permission errors**: Verify Bot Token Scopes in Slack app settings
- **Notion not working**: Check database is shared with integration

## Need Help?

1. Check Render logs for error messages
2. Verify all environment variables are set correctly
3. Make sure bot is added to the channels where you're testing

---

**Ready to deploy?** Just upload these 4 files to GitHub and follow the setup guide!
