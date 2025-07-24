require('dotenv').config();
const { App } = require('@slack/bolt');
const { Client } = require('@notionhq/client');

// Initialize Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Initialize Notion client (only if tokens exist)
let notion = null;
if (process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID) {
  notion = new Client({ auth: process.env.NOTION_TOKEN });
}

// Static keyword responses based on your HR database
const keywordResponses = {
  'equity': {
    keywords: ['equity', 'stock', 'stock options', 'strike price', 'exercise equity'],
    response: "📈 Equity grants vary by role. Check your offer letter, Grant info in your Carta profile, or on our Stock info page."
  },
  'parental': {
    keywords: ['parental leave', 'baby', 'family', 'maternity', 'paternity'],
    response: "👶 16 weeks paid leave. All parents welcome. Full policy details available in our HR portal."
  },
  'vacation': {
    keywords: ['vacation', 'pto', 'time off', 'paid time off'],
    response: "🏖️ Flexible PTO — PTO guidelines and how to request in Lattice can all be found in our policy docs."
  },
  'benefits': {
    keywords: ['benefits', 'health insurance', 'dental', 'vision', 'medical'],
    response: "🏥 Our benefits are via Sequoia PEO. You can see your plans and update info on Sequoia portal."
  },
  'payroll': {
    keywords: ['payroll', 'paid', 'payment', 'salary', 'pay date'],
    response: "💰 Payroll runs on the 15th and end of each month via Sequoia. Direct deposit is required for FTE."
  },
  'stipend': {
    keywords: ['wfh stipend', 'equipment stipend', 'home office', 'equipment'],
    response: "💻 Check our equipment stipend policy in the employee handbook or contact HR for current stipend amounts."
  },
  'reviews': {
    keywords: ['performance reviews', 'review cycle', 'feedback', 'performance'],
    response: "📊 Performance reviews happen quarterly. Check your review schedule and submit feedback through our HR system."
  },
  'expenses': {
    keywords: ['expenses', 'reimbursements', 'expense report', 'receipts'],
    response: "🧾 Submit expenses through our expense system. Keep receipts and follow the expense policy guidelines."
  },
  'travel': {
    keywords: ['travel', 'business trip', 'travel policy', 'flight'],
    response: "✈️ Check our travel policy for booking guidelines and expense limits. Pre-approval may be required."
  },
  'offboarding': {
    keywords: ['offboarding', 'quitting', 'resigning', 'last day', 'exit'],
    response: "👋 Please follow our offboarding checklist and work with HR on your transition timeline."
  },
  // Holiday responses
  'juneteenth': {
    keywords: ['juneteenth', 'june 19', 'juneteenth off'],
    response: "📅 Yes! Juneteenth (June 19th) is a company holiday. The office will be closed and it's a paid day off for all employees."
  },
  'memorial': {
    keywords: ['memorial day', 'memorial day off'],
    response: "🇺🇸 Memorial Day is a company holiday. We're closed on the last Monday in May."
  },
  'labor': {
    keywords: ['labor day', 'labor day off'],
    response: "👷 Labor Day (first Monday in September) is a company holiday with paid time off."
  }
};

// Search Notion database for dynamic responses
async function searchNotionDatabase(query) {
  if (!notion || !process.env.NOTION_DATABASE_ID) {
    return null;
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        or: [
          {
            property: 'Topic 1', // Adjust this to match your actual column name
            rich_text: { contains: query }
          }
        ]
      }
    });

    if (response.results.length > 0) {
      const page = response.results[0];
      const answer = page.properties.Answer?.rich_text?.[0]?.plain_text || 
                    page.properties.Answer?.title?.[0]?.plain_text ||
                    "Found a match but couldn't extract the answer.";
      return `📋 From HR database: ${answer}`;
    }
    return null;
  } catch (error) {
    console.error('Notion search error:', error);
    return null;
  }
}

// Find static responses first
function findStaticResponse(text) {
  const lowerText = text.toLowerCase();
  
  for (const [key, config] of Object.entries(keywordResponses)) {
    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return config.response;
      }
    }
  }
  return null;
}

// Main response function - tries static first, then Notion
async function findResponse(text) {
  // Try static responses first (faster)
  const staticResponse = findStaticResponse(text);
  if (staticResponse) return staticResponse;
  
  // Then try Notion if available
  if (notion) {
    const notionKeywords = ['equity', 'stock', 'parental', 'benefits', 'payroll', 'stipend', 'performance', 'expenses', 'travel', 'offboarding'];
    const lowerText = text.toLowerCase();
    
    for (const keyword of notionKeywords) {
      if (lowerText.includes(keyword)) {
        const notionResponse = await searchNotionDatabase(keyword);
        if (notionResponse) return notionResponse;
      }
    }
  }
  
  return null;
}

// Listen for messages in channels
app.message(async ({ message, say, client }) => {
  try {
    // Skip bot messages
    if (message.subtype === 'bot_message') return;
    
    const response = await findResponse(message.text);
    if (response) {
      // Respond in thread to keep channel clean
      await say({
        text: response,
        thread_ts: message.ts
      });
      
      // Add reaction to show bot processed the message
      try {
        await client.reactions.add({
          channel: message.channel,
          timestamp: message.ts,
          name: 'robot_face'
        });
      } catch (reactionError) {
        // Ignore reaction errors (bot might not have permission)
        console.log('Could not add reaction:', reactionError.message);
      }
    }
  } catch (error) {
    console.error('Message handling error:', error);
  }
});

// Listen for direct mentions (@botname)
app.event('app_mention', async ({ event, say }) => {
  try {
    const response = await findResponse(event.text);
    if (response) {
      await say({
        text: `<@${event.user}> ${response}`,
        thread_ts: event.ts
      });
    } else {
      await say({
        text: `<@${event.user}> I didn't find an answer for that. Try asking about equity, PTO, benefits, payroll, holidays, or other HR topics!`,
        thread_ts: event.ts
      });
    }
  } catch (error) {
    console.error('Mention handling error:', error);
  }
});

// Health check endpoint for Render
app.receiver.app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the app
(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ HR Bot is running on port ${port}`);
  console.log('Notion integration:', notion ? 'Enabled' : 'Disabled (no tokens provided)');
})();