---
theme: neversink

lineNumbers: false
drawings:
  persist: false
title: Building Tools that Think
titlewidth: is-4
neversink_slug: 'SSM25'
---

# Building Tools that Think

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
layout: full
color: white
---

<div class="flex items-center justify-center h-full">
  <img src="/data-info.png" style="max-width: 85%;" />
</div>

---
layout: side-title
align: rm-lm
color: indigo
---

::title::
# Why you're here

::content::
- Automating Data into Useful Information is the first step
- But using AI we can add 'thinking' to our automation
- Creating AI Assistants that can help you with your work
<br>
<br>
**Goal for today:**
<br>
Introduce some 'lego blocks' that you can use to build your own Tools, Mental Models, Code snippets, Prompts etc.

---
layout: side-title
align: rm-lm
color: indigo
---

::title::
# Building a
# tool that thinks

::content::
- But AI can do so much more
- We'll build a suite of tools that can:
  - Fetch your Google Ads data
  - Combine it with a prompt
  - Send all that to an LLM
  - Generate an insight

<StickyNote v-drag="[220,350,120,120,-10]" color="amber-light">
The first goal is freeing up time
</StickyNote>

---
layout: full
color: white
---

<div class="flex items-center justify-center h-full">
  <img src="/wk2-workflow.png" style="max-width: 100%;" />
</div>

---
layout: side-title
align: rm-lm
color: indigo
---

::title::
# Agenda for today

::content::
1️⃣ Introduction & Overview of Scripts, Sheets & AI

2️⃣ Writing Google Ads Scripts using AI

3️⃣ A note on Google Sheets

4️⃣ Building "thinking scripts" with AI

5️⃣ Tools that will help

---
layout: section
color: dark
---

# 2: We'll start with a simple script

---
layout: top-title
color: emerald
---

::title::
# If we had more time, you'd create this (with AI)

::content::
- Here's one I created for you https://8020agent.com/slides
- I'll give you the **mega prompt** so you can create this later
<br>
- Create a new blank sheet & enter the URL in the script (top row)
- Run the script in your account using PREVIEW (see logs)
- Check the data in the sheet

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
# In the olden days (2024)

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
layout: side-title
align: cm-lm
color: indigo
---

::title::
# In 2025

::content::
- Know how to use Named Ranges (makes code cleaner)
- Hardcode your sheet URL in the script (SHEET_URL)
- Test with small amounts of data (time!)

---
layout: full
color: white
---

<div class="flex items-center justify-center h-full">
  <img src="/terms.png" style="max-width: 90%;" />
</div>

---
layout: section
color: dark
---

# 4. Now let's add the 'brain'

---
layout: side-title
align: rm-lm
color: indigo
---

::title::
# OpenAI API & Code Snippets

::content::
- We'll use the OpenAI API to add 'thinking' to our script
- In the interest of time, I'll give you the finished classification script at https://8020agent.com/slides
- Use https://8020agent.com/4Cs to get more sample code snippets 
- Get your API Key from https://platform.openai.com/settings/organization/api-keys (you need to fund this with $5 min)

---
layout: side-title
align: rm-lm
color: indigo
---

::title::
# What we're building

::content::
- Fetch top Search Terms from the sheet (named range)
- Combine them with a prompt (to classify the intent)
- Send all that to an LLM (GPT-4o-mini using our API key)
- Generate an insight (the intent)
- Add the insight back to the sheet (results table)

---
layout: side-title
align: rm-lm
color: indigo
---

::title::
# A note on our prompt

::content::
- We're using a very simple prompt to classify the intent
- The point here is to show you how to use the OpenAI API
- To give you a building block for your own tools

---
layout: full
color: black
---

<div class="flex items-center justify-center h-full">
  <img src="/prompt.png" style="max-width: 85%;" />
</div>

---
layout: side-title
align: rm-lm
color: indigo
---

::title::
# Why run this in Google Ads?

::content::
- We're using Google Ads as the 'host' for our code
- Google handles all the details of running it
- We don't have to host/deploy/maintain any servers
- We can use this pattern with pretty much any API call (eg slack, weather, etc)
- Hint: Imagination is the only constraint here

---
layout: full
color: white
---

<div class="flex items-center justify-center h-full">
  <img src="/results.png" style="max-width: 85%;" />
</div>

---
layout: section
color: dark
---

# 5. Tools that will help

---
layout: side-title
align: rm-lm
color: indigo
---

::title::
# Recommended

::content::
- Cursor: AI coding tool, writes most code for you
- Prompt generator: from Anthropic, helps build great prompts
   https://console.anthropic.com/dashboard
- Megaprompt: helps write Google Ads scripts
- https://8020agent.com/4Cs sample code snippets

---
layout: section
color: dark
---

# 6. Recap & Next Steps

---
layout: full
color: white
---

<div class="flex items-center justify-center h-full">
  <img src="/wk2-workflow.png" style="max-width: 85%;" />
</div>

---
layout: side-title
align: cm-lm
color: indigo
---

::title::
# Next Steps

::content::
1. Practice writing code
2. Build v1 of something new 
3. Consider the next Build the Agent Workshop!
4. Have fun building (it's addictive!)
