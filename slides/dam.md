---
theme: neversink

lineNumbers: false
drawings:
  persist: false
title: Scripts & Sheets Mastery 2025
titlewidth: is-4
neversink_slug: 'SSM25'
---

# Scripts & Sheets Mastery 2025

Welcome to Amsterdam!

---
layout: section
color: dark
---

# LowLander Guest WiFi password: 
# ilovelowlander

---
layout: full
color: white
---

<div class="flex items-center justify-center h-full">
  <img src="/amsterdam.jpg" style="max-width: 115%;" />
</div>

---
layout: section
color: dark
---

# 1. Introduction & Overview

---
layout: side-title
align: rm-lm
color: indigo
---

::title::
# Why you're here

::content::
- Mastering Scripts and Sheets are a rare & valuable skills.
- Extract & analyze data from Google Ads.
- Automate repetitive tasks in your work/agency.
- Use AI to generate automated insights from your data.
- Many businesses run on spreadsheets & they need help!

<StickyNote v-drag="[250,350,120,120,-10]" color="amber-light">
You'll probably be able to charge more for your services :)
</StickyNote>

---
layout: side-title
align: rm-lm
color: indigo
---

::title::
# Agenda for today

::content::
1️⃣ Introduction & Overview of Scripts, Sheets & AI

2️⃣ Mastery in 2025 vs 2024

3️⃣ Hands-on: Writing scripts with AI

4️⃣ Google Sheets integration & best practices

5️⃣ Debugging techniques & troubleshooting

6️⃣ APIs & expanding script capabilities

7️⃣ Building "thinking scripts" with OpenAI API

8️⃣ Mini apps & implementation ideas

🧠 Mindset & confidence building

📚 Resources & next steps

---
layout: full
color: white
---

<div class="flex items-center justify-center h-full">
  <img src="/door.avif" style="max-width: 115%;" />
</div>

---
layout: section
color: dark
---

# 2. Mastery in 2024 vs 2025

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# In the past, 
# we would have

::content::
- Learnt my QTS System (Query, Template, Sheet)
- Learnt the basics of SQL (Select, From, Where)
- Started with JavaScript (variables, functions, loops)
- Then write basic scripts using Query Builder
- And dive deep into 12+ Sheets formulas

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# But it's 2025

::content::
- Use AI to write all our code
- Learn some scripting 'lego blocks' 
- No need to learn JavaScript (it'll help a bit)
- Use different AI models & a tool called Cursor
- Still use Sheets to visualise data (but just 1 main 'trick')
- Build a script that 'thinks'
- Look at a 'mini app' (using AI)

---
layout: section
color: dark
---

# Let's write a script

---
layout: top-title
color: emerald
---

::title::
# You've got 10 minutes, use an AI to:

::content::
- Write a script to find all the negative keywords in your account
- Ask it to:
   - NOT make any changes to your account
   - Put the output into a new Google sheet (& log the url)
- Run it in your account using PREVIEW
- (optional: use a different AI to check it won't make changes)
<br>
<br>
<SpeechBubble position="t" color="emerald-light" shape="round"  maxWidth="200px">
Remember: This won't be perfect
</SpeechBubble>

---
layout: side-title
align: cm-lm
color: emerald
---

::title::
# What did you find?

::content::
- Was the AI any good?
- Did you get errors?
- Were you able to solve them?

<div class="h-full flex items-center justify-center">
  <img src="/error.png" style="max-width: 85%;" />
</div>

---
layout: quote
align: cm
color: amber
---

We need Context

---
layout: section
color: dark
---

# Working with AI

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# 3 Ways:  

::content::
# Task
# Think
# Teach


---
layout: full
background: white
---

<div class="h-full flex items-center justify-center">
  <img src="/task.png" style="max-width: 85%;" />
</div>

---
layout: full
background: white
---

<div class="h-full flex items-center justify-center">
  <img src="/think.png" style="max-width: 85%;" />
</div>

---
layout: full
background: white
---

<div class="h-full flex items-center justify-center">
  <img src="/teach.png" style="max-width: 85%;" />
</div>


---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# Automation vs. AI

::content::
- Know when to use Automation vs AI (data analysis)
- Automation: Zapier, Make, n8n
- AI in 3 flavours: Chat, Workflows, Agents
- (Chat & Reasoning models converging)
- For code: Claude 3.7 Sonnet
<br>
<br>
#### Other AI (not today):
- For images: Midjourney, FAL
- For audio: ElevenLabs, Sesame
- For video: VEO2, Runway, Synthesia

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# Prompting AI
::content::
- Evolution of prompt size and complexity.
- How output has changed.
- Mega prompt concept for Google Ads scripts.
- Compare one-shot vs few-shot learning.
- A quick note about RAG.


---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# Prompting AI
::content::

**You no longer need phrases like:**
- Take a deep breath
- I will tip you $2000
- My grandmother will die...


---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# The Mega Prompt

::content::
- Save typing the same instructions every time
<br>
(you can also save this to a project)

- Gives the AI much more context
<br>
   - Overview
   - Guidelines
   - Requirements
   - Structure
   - Lots of examples


---
layout: section
color: emerald
---

# Let's write a new script

---
layout: top-title
color: emerald
---

::title::
# You've still only got 10 minutes, this time:

::content::
- Use the **mega prompt** to write a Negative Keyword script
- Run it in your account using PREVIEW
- Try to fix errors by pasting logs back into the AI
<br>
<br>

**Suggested models**
- Claude 3.7 Sonnet
- GPT-o3-mini

**Code for Today**
# https://github.com/mikerhodesideas/amsterdam

---
layout: side-title
align: cm-lm
color: emerald
---

::title::
# Reflection

::content::
- Still errors?
- Easier this time?
- Starting to get comfortable?


---
layout: section
color: dark
---

# 3. Google Sheets (for Scripts)

---
layout: top-title-two-cols
color: indigo
---

::title::
# In 2024

::left::
- QUERY
- COUNTIF
- SUMIF
- UNIQUE
- SORT
- FILTER

::right::
- TRANSPOSE
- XLOOKUP
- ARRAYFORMULA
- IMPORTRANGE
- IFNA
- IFERROR

---
layout: top-title-two-cols
color: indigo
---

::title::
# Just need to know

::left::
- Move data from a tab/sheet
- Count, Sum & Average metrics
- Dedupe data
- Sort & Filter data
- Find data in a table based on a value
- One formula for all rows (array)
- Remove errors
- **Named Ranges**

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# Create a simple script & sheet

::content::
- Copy the 'simple search term' script from github
- Create a new sheet (sheet.new)
- Enter your sheet URL in the script (SHEET_URL)
- Run the script (Preview mode makes it easy to see logs)
- Add named ranges for search terms, clicks, cost & conversions
<br>
<br>
<StickyNote color="pink-light" width="150px" title="Note">
We'll use Named Ranges later today
</StickyNote>

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# A quick note on Data Visualisation

::content::
- Charts are what humans often need to make sense of data
- Sheets has a few charting options
- Focus on mastering basic line charts
- For bonus points, study the PMax sheet to see 'dynamic' charts
- Book: Storytelling with Data (Cole Nussbaumer Knaflic)
- Ask AI for ideas to improve a given screenshot

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# Recap of Sheets Best Practices

::content::
- A great complement to scripts
- Do as much data processing in the script as you can
- Use named ranges to make your sheet easier to get data from
- Ask AI to write formulas for you 
- Show AI screenshot of your chart - ask it for suggestions

---
layout: section
color: dark
---

# 4. Introducing APIs

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# What is an API?

::content::
- API = Application Programming Interface
- Waiter analogy: fetches what you need from the kitchen
- A way for scripts to interact with other tools
- We'll just use OpenAI API today
- But they're used everywhere: Google Ads, Slack, Shopify, etc

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# How to use an API

::content:: 
- API keys are like passwords
- Keep them secret (don't share them in workshops)
- They're usually free (but you do need an account)
- You get a limit (but you can often ask for more)
- You can use them in Google Ads scripts!

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# A Step Towards Agents

::content::
- Agents are Autonomous AI that can use Tools (& Memory & Actions)
- We'll use OpenAI API to create a (very) simple 'agent' inside a script
- Model selection: trade-off speed vs performance vs cost
- Over time you'll develop intuition for what's needed

---
layout: section
color: dark
---

# 5. Time to Code like a Pro

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# Cursor (IDE)

::content::
- Stop editing scripts in a Google Doc! (or even in Google Ads)
- Cursor is an AI-powered coding assistant
- It is probably more than you need for scripts!
- It's free to use (or $20/m for Pro version)
- I use Claude 3.7 all day & don't hit any daily limits in Cursor
- It's a great way to learn how to code
- A useful place to store all your scripts & prompts
- It writes the code for you (so we can use it instead of the Claude/chatGPT apps)

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# Coding is 95% Debugging

::content::
- Logs and error messages are written in a language you don't speak
- But AI speaks that language
- All Google Ads Scripts errors are plain text
- Just copy & paste the error log back into the AI
- 'Pls Fix' !

<StickyNote color="amber-light" width="150px" title="Breathe" v-drag="[780,360,150,150,10]">
Errors are normal. You're not breaking anything. Expect them.
</StickyNote>

---
layout: side-title
align: cm-lm
color: indigo
---

::title::

# Troubleshooting Techniques

::content::

- You might not know enough to **describe** the problem
- Ask the AI to add debugging logs to the script
- Datasets: Ask it to log the first couple of rows of data
- Large scripts: Log which 'part' of the script is currently running
- Ask it to log the values of variables

<StickyNote color="amber-light" width="150px" title="It's all Greek">
You don't need to understand the code or the error messages
</StickyNote>

---
layout: section
color: dark
---

# 6. Your First Thinking Script

---
layout: full
color: white
---

<div class="flex items-center justify-center h-full">
  <img src="/data-info.png" style="max-width: 85%;" />
</div>

---
layout: full
color: white
---

<div class="flex items-center justify-center h-full">
  <img src="/4cs.png" style="max-width: 85%;" />
</div>

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# Adding AI 
# to our Script

::content::
- Integrate AI reasoning through API calls.
- You don't need to know how to code an API call
- You just need to know that you can
- We're going to get some data & a prompt from a sheet
- Send it to an LLM & get a response
- Then update the sheet with the response

---
layout: section
color: emerald
---

# Let's write a Thinking Script

---
layout: top-title
color: emerald
---

::title::
# Let's start simple

::content::
- To write your new script, you'll need some instructions:
   - Explain what you want to build
   - Add the 'openai test' script as additional context
<br>
<br>
- We need:
   - A model - use a cheap one for testing eg gpt-4o-mini
   - An API key - hardcode it in the script for now
   - A prompt - Ask it to get the prompt from a named range in the sheet
   - Data - Ask it to get some data from the sheet (dummy data)

---
layout: full
color: pink
---

<div class='border-1px v-full h-full p-5 flex items-center justify-center'>
  <h1 class="text-8xl  text-center">Demo: Thinking Script</h1>
</div>

---
layout: top-title
color: emerald
---

::title::
# Pair up & build something

::content::
- Work with someone you've never spoken to before today
- Spend 5 mins (max) deciding on an idea for a simple thinking script (v1!)
- Fetch data if you want to (or ask an AI to create dummy data to save time)
- Modify the earlier thinking script - build on top of it (give it to Claude + some context)
- Read the prompt & data from the sheet using Named Ranges
- Send the prompt & data to an LLM
- Update the sheet with the response

---
layout: section
color: dark
---

# 7. Implementing Workshop Ideas

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# Where can you have the most impact?

::content::
- Conduct a 'task audit'
- Identify tasks that are repetitive that you don't like doing!
- Think about how you could automate, or use AI for part of it
- Create momentum - get a win
- Even if it only saves you 10m a week
<br>
<br>
**You're entering the Adjacent Possible!**

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# Document Your Processes

::content::
- Record yourself doing the task in Loom
- Transcribe, or create an SOP in Loom
- Paste that into a thinking model (o3, claude 3.7 etc)
- And ask for suggestions to improve or automate it
<br>
<br>
**Record everything!!**

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# Introduction to Mini Apps

::content::
- Concept and benefits of mini apps.
- Tools: Cursor (or Replit, Bolt, Lovable, etc)
- Use for yourself, your team or as lead magnets
- Eg I built:  https://profitmax.replit.app/
- Then I built:  https://8020agent.com/

---
layout: section
color: dark
---

# 8. Mindset & Confidence Building

---
layout: full
color: pink
---

<div class='border-1px v-full h-full p-5 flex items-center justify-center'>
  <h1 class="text-8xl  text-center">Imagination is the only constraint</h1>
</div>

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# Mindset & Confidence

::content::
- Agency matters - do you **believe** you have control?
- Make yourself indispensable (to clients, boss, audience)
- Learn how to be the conductor of the tools
- Tactics are great, Strategies are better
- It's a great time to build!

---
layout: top-title
color: indigo
---

::title::
# Want to build your confidence

::content::
Watch this!

<div class="flex items-center justify-center h-full">
  <img src="/confidence.png" style="max-width: 85%;" />
</div>

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# Final Thoughts

::content::
- Thank you 
- Let me know what you build
- I'd love your feedback
- Now, let's have a beer!