# Scripts & Sheets Mastery 2025
## Workshop Handout - Amsterdam

## 1. Introduction & Overview

### Why you're here
- Mastering Scripts and Sheets are rare & valuable skills
- Extract & analyze data from Google Ads
- Automate repetitive tasks in your work/agency
- Use AI to generate automated insights from your data
- Many businesses run on spreadsheets & they need help!
- *You'll probably be able to charge more for your services*

### Agenda for today
1. Introduction & Overview of Scripts, Sheets & AI
2. Mastery in 2025 vs 2024
3. Hands-on: Writing scripts with AI
4. Google Sheets integration & best practices
5. Debugging techniques & troubleshooting
6. APIs & expanding script capabilities
7. Building "thinking scripts" with OpenAI API
8. Mini apps & implementation ideas
9. Mindset & confidence building
10. Resources & next steps

### The Adjacent Possible

## 2. Mastery in 2024 vs 2025

### In the past, we would have
- Learnt the QTS System (Query, Template, Sheet)
- Learnt the basics of SQL (Select, From, Where)
- Started with JavaScript (variables, functions, loops)
- Then write basic scripts using Query Builder
- And dive deep into 12+ Sheets formulas

### But it's 2025
- Use AI to write all our code
- Learn some scripting 'lego blocks'
- No need to learn JavaScript (it'll help a bit)
- Use different AI models & a tool called Cursor
- Still use Sheets to visualize data (but just 1 main 'trick')
- Build a script that 'thinks'
- Look at a 'mini app' (using AI)

## 3. Writing Scripts with AI

### First Script Exercise
- Write a script to find all the negative keywords in your account
- Ask AI to:
  - NOT make any changes to your account
  - Put the output into a new Google sheet (& log the URL)
- Run it in your account using PREVIEW
- (Optional: use a different AI to check it won't make changes)

### Working with AI: 3 Ways
1. **Task** - Direct the AI to complete specific tasks
2. **Think** - Use AI for analysis and problem-solving
3. **Teach** - Have AI explain concepts and approaches

### Automation vs. AI
- Know when to use Automation vs AI (data analysis)
- Automation: Zapier, Make, n8n
- AI in 3 flavors: Chat, Workflows, Agents
- (Chat & Reasoning models converging)
- For code: Claude 3.7 Sonnet

**Other AI (not today)**:
- For images: Midjourney, FAL
- For audio: ElevenLabs
- For video: VEO2, Runway, Synthesia

### Prompting AI
- Evolution of prompt size and complexity
- How output has changed
- Mega prompt concept for Google Ads scripts
- Compare one-shot vs few-shot learning
- A quick note about RAG

**You no longer need phrases like:**
- "Take a deep breath"
- "I will tip you $2000"
- "My grandmother will die..."

### The Mega Prompt
- Save typing the same instructions every time (you can also save this to a project)
- Gives the AI much more context:
  - Overview
  - Guidelines
  - Requirements
  - Structure
  - Lots of examples

### Second Script Exercise
- Use the **mega prompt** to write a Negative Keyword script
- Run it in your account using PREVIEW
- Try to fix errors by pasting logs back into the AI

**Suggested models**:
- Claude 3.7 Sonnet
- GPT-o3-mini

## 4. Google Sheets Integration

### In 2024, We Needed to Know
- QUERY
- COUNTIF
- SUMIF
- UNIQUE
- SORT
- FILTER
- TRANSPOSE
- XLOOKUP
- ARRAYFORMULA
- IMPORTRANGE
- IFNA
- IFERROR

### Now You Just Need to Know
- Move data from a tab/sheet
- Count, Sum & Average metrics
- Dedupe data
- Sort & Filter data
- Find data in a table based on a value
- One formula for all rows (array)
- Remove errors
- **Named Ranges**

### Creating a Simple Script & Sheet
- Copy the 'simple search term' script from GitHub
- Make a copy of the sheet (in the comments)
- Enter your sheet URL in the script (SHEET_URL)
- Run the script (Preview mode makes it easy to see logs)
- Add named ranges for search terms, clicks, cost & conversions

### Data Visualization Notes
- Charts are what humans often need to make sense of data
- Sheets has a few charting options
- Focus on mastering basic line charts
- For bonus points, study the PMax sheet to see 'dynamic' charts
- Book: Storytelling with Data (Cole Nussbaumer Knaflic)
- Ask AI for ideas to improve a given screenshot

### Sheets Best Practices
- A great complement to scripts
- Do as much data processing in the script as you can
- Use named ranges to make your sheet easier to get data from
- Ask AI to write formulas for you
- Show AI screenshot of your chart - ask it for suggestions

## 5. APIs & Expanding Capabilities

### What is an API?
- API = Application Programming Interface
- Waiter analogy: fetches what you need from the kitchen
- A way for scripts to interact with other tools
- We'll just use OpenAI API today
- But they're used everywhere: Google Ads, Slack, Shopify, etc.

### How to Use an API
- API keys are like passwords
- Keep them secret (don't share them in workshops)
- They're usually free (but you do need an account)
- You get a limit (but you can often ask for more)
- You can use them in Google Ads scripts!

### A Step Towards Agents
- Agents are Autonomous AI that can use Tools (& Memory & Actions)
- We'll use OpenAI API to create a (very) simple 'agent' inside a script
- Model selection: trade-off speed vs performance vs cost
- Over time you'll develop intuition for what's needed

## 6. Coding Like a Pro

### Cursor (IDE)
- Stop editing scripts in a Google Doc! (or even in Google Ads)
- Cursor is an AI-powered coding assistant
- It is probably more than you need for scripts!
- It's free to use (or $20/m for Pro version)
- I use Claude 3.7 all day & don't hit any daily limits in Cursor
- It's a great way to learn how to code
- A useful place to store all your scripts & prompts
- It writes the code for you (so we can use it instead of the Claude/chatGPT apps)

### Coding is 95% Debugging
- Logs and error messages are written in a language you don't speak
- But AI speaks that language
- All Google Ads Scripts errors are plain text
- Just copy & paste the error log back into the AI
- 'Pls Fix'!
- *Errors are normal. You're not breaking anything. Expect them.*

### Troubleshooting Techniques
- You might not know enough to **describe** the problem
- Ask the AI to add debugging logs to the script
- Datasets: Ask it to log the first couple of rows of data
- Large scripts: Log which 'part' of the script is currently running
- Ask it to log the values of variables
- *You don't need to understand the code or the error messages*

## 7. Building Thinking Scripts

### Adding AI to Our Script
- Integrate AI reasoning through API calls
- You don't need to know how to code an API call
- You just need to know that you can
- We're going to get some data & a prompt from a sheet
- Send it to an LLM & get a response
- Then update the sheet with the response

### Creating a Thinking Script
**Start Simple:**
- Explain what you want to build
- Add the 'openai test' script as additional context
- We need:
  - A model - use a cheap one for testing eg gpt-4o-mini
  - An API key - hardcode it in the script for now
  - A prompt - Ask it to get the prompt from a named range in the sheet
  - Data - Ask it to get some data from the sheet (dummy data)

**Pair Exercise:**
- Work with someone you've never spoken to before today
- Spend 5 mins (max) deciding on an idea for a simple thinking script (v1!)
- Fetch data if you want to (or ask an AI to create dummy data to save time)
- Modify the earlier thinking script - build on top of it
- Read the prompt & data from the sheet using Named Ranges
- Send the prompt & data to an LLM
- Update the sheet with the response

## 8. Implementation & Real-World Applications

### Where You Can Have the Most Impact
- Conduct a 'task audit'
- Identify tasks that are repetitive that you don't like doing!
- Think about how you could automate, or use AI for part of it
- Create momentum - get a win
- Even if it only saves you 10m a week
- **You're entering the Adjacent Possible!**

### Document Your Processes
- Record yourself doing the task in Loom
- Transcribe, or create an SOP in Loom
- Paste that into a thinking model (o3, claude 3.7 etc)
- And ask for suggestions to improve or automate it
- **Record everything!!**

### Introduction to Mini Apps
- Concept and benefits of mini apps
- Tools: Cursor (or Replit, Bolt, Lovable, etc)
- Use for yourself, your team or as lead magnets
- Example: https://profitmax.replit.app/
- Example: https://8020agent.com/

## 9. Mindset & Confidence Building

**Imagination is the only constraint**

### Key Mindset Principles
- Agency matters - do you **believe** you have control?
- Make yourself indispensable (to clients, boss, audience)
- Learn how to be the conductor of the tools
- Tactics are great, Strategies are better
- It's a great time to build!

## Confidence
- Watch https://www.youtube.com/watch?v=wBlJ5HbFpYQ

## Final Thoughts
Thank you for attending! Please share what you build and any feedback you have.