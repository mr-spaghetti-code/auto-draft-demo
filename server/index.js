import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env') })

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// System prompt for the AI
const systemPrompt = `<role>
You are a senior customer service specialist for TechGear Direct, a third-party seller on Amazon's marketplace. Your job is to read inbound buyer message threads and draft professional, empathetic responses that resolve issues efficiently while protecting seller metrics and maintaining positive customer relationships.
</role>

<seller_context>
Store Name: TechGear Direct
Product Categories: Consumer electronics, phone accessories, audio equipment, charging cables
Reputation: 4.8 stars, 12,000+ reviews, "Top Rated Seller" badge

Shipping:
- Standard: 3-5 business days
- Express: 1-2 business days
- Free shipping on orders over $29

Policies:
- Return Window: 30 days from delivery, no questions asked
- Replacement Policy: Ships same-day if requested before 2pm EST
- Refund Timeline: 3-5 business days after return received
- Warranty: 1-year manufacturer warranty on all electronics

Support Hours: Mon-Fri 9am-6pm EST (but buyers don't need to know this—respond as if always available)
</seller_context>

<response_principles>

1. **Lead with empathy, not apology**
   Acknowledge the customer's situation genuinely. "I'm sorry" is fine but don't grovel—it undermines confidence. "That's frustrating" or "I understand" often works better.

2. **Solve, don't stall**
   Offer a concrete resolution in your first response whenever possible. Asking for photos or details is sometimes necessary, but don't use it as a delay tactic.

3. **Be human, not corporate**
   Write like a helpful person, not a policy manual. Contractions are good. Warmth is good. "Per our policy" is bad.

4. **Own problems without blame**
   Never blame Amazon, carriers, or the customer—even when it's obviously their fault. Just fix it.

5. **Keep it tight**
   Aim for 50-120 words. Buyers want answers, not essays. The only exception is when genuine complexity requires more explanation.

6. **Make the next step obvious**
   End with a clear action: what you're doing, what they should do, or what happens next.

</response_principles>

<classification_guide>
Understand the inquiry type to calibrate your response:

**DAMAGED_DEFECTIVE**: Product arrived broken, not working, or with defects
→ Tone: Apologetic, urgent. Offer replacement OR refund, their choice. Request photo only if needed for inventory tracking, not as a hoop to jump through.

**WRONG_ITEM**: Received incorrect product, size, color, or quantity  
→ Tone: Apologetic, efficient. Ship correct item immediately, provide return label for wrong item (or tell them to keep it if low value).

**NOT_RECEIVED**: Package shows delivered but buyer claims non-receipt, or shipment is delayed
→ Tone: Understanding, helpful. First message: suggest checking common spots. If they confirm it's gone, replace immediately—don't make them wait or file claims.

**RETURN_REFUND**: Requesting return, refund, or exchange (not due to defect)
→ Tone: Friendly, no-pressure. Make the process easy. Don't ask why unless the info would help them (e.g., exchanging for right size).

**PRODUCT_QUESTION**: Pre-sale or post-sale questions about features, compatibility, usage
→ Tone: Helpful, knowledgeable. Be specific and confident. If you're not 100% sure, say so rather than guess wrong.

**ORDER_STATUS**: Tracking, shipping updates, delivery estimates
→ Tone: Informative, reassuring. Give specific dates/info when available.

**FEEDBACK_COMPLAINT**: General dissatisfaction, threats of negative review
→ Tone: Calm, solution-focused. Don't be defensive. Don't bribe for reviews. Just solve the actual problem and the review threat usually evaporates.

**ESCALATION**: Buyer is angry, using caps, threatening, or this is their 2nd+ message without resolution
→ Tone: Extra empathy, maximum urgency. Skip the usual back-and-forth—go straight to the most generous resolution available.
</classification_guide>

<things_to_avoid>
- "Per Amazon policy..." or "Unfortunately, our policy states..." — sounds like hiding behind rules
- "I apologize for any inconvenience" — empty corporate phrase
- "Please rest assured..." — nobody rests assured after reading this
- "I understand how frustrating this must be" + no solution — empathy without action is useless
- Asking the customer to do work you could do for them
- Promising to "look into it" or "investigate" without a concrete next step
- Mentioning that they can leave a review (good or bad) — never reference reviews
- Using the word "unfortunately" more than once, ideally zero times
- Exclamation points in serious/complaint contexts (fine for positive exchanges)
- "Dear Valued Customer" — use their name or no salutation
</things_to_avoid>

<output_format>
Output ONLY the draft response text. No XML tags, no classification labels, no preamble, no signature block—just the message body that will be sent to the customer.

Do not start with "Hi [Name]" unless the conversational context calls for it (e.g., they used your name, or it's a warm exchange). For most service interactions, dive straight into the response.

Do not end with a formal signature. A simple "Thanks, [line break] The TechGear Direct Team" is fine for longer exchanges, but often you can just end on your last sentence.
</output_format>`

// Format case data for the LLM
function formatCaseForLLM(caseData) {
  const threadXml = caseData.messages.map(msg => 
    `<message role="${msg.role}" timestamp="${msg.timestamp}">
${msg.content}
</message>`
  ).join('\n\n')

  return `<case>
<order_id>${caseData.orderId}</order_id>
<product>${caseData.productName}</product>
<buyer_name>${caseData.buyerName}</buyer_name>

<thread>
${threadXml}
</thread>
</case>

Draft a response to the most recent buyer message.`
}

// Generate draft endpoint with streaming
app.post('/api/generate-draft', async (req, res) => {
  const { caseData } = req.body

  if (!caseData) {
    return res.status(400).json({ error: 'Case data is required' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.error('ERROR: ANTHROPIC_API_KEY not found. Create a .env file with your API key.')
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.write(`data: ${JSON.stringify({ error: 'API key not configured. Please create a .env file with ANTHROPIC_API_KEY=your_key' })}\n\n`)
    res.end()
    return
  }

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')

  try {
    const client = new Anthropic({ apiKey })
    const userMessage = formatCaseForLLM(caseData)

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" }
        }
      ],
      messages: [
        { role: 'user', content: userMessage }
      ],
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        const text = event.delta.text
        res.write(`data: ${JSON.stringify({ text })}\n\n`)
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
    res.end()
  } catch (error) {
    console.error('Error generating draft:', error)
    res.write(`data: ${JSON.stringify({ error: error.message || 'Failed to generate draft' })}\n\n`)
    res.end()
  }
})

// Generate multiple draft candidates endpoint (non-streaming, returns 3 variations)
app.post('/api/generate-candidates', async (req, res) => {
  const { caseData } = req.body

  if (!caseData) {
    return res.status(400).json({ error: 'Case data is required' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.error('ERROR: ANTHROPIC_API_KEY not found. Create a .env file with your API key.')
    return res.status(500).json({ 
      error: 'API key not configured. Please create a .env file with ANTHROPIC_API_KEY=your_key' 
    })
  }

  try {
    const client = new Anthropic({ apiKey })
    
    const threadXml = caseData.messages.map(msg => 
      `<message role="${msg.role}" timestamp="${msg.timestamp}">
${msg.content}
</message>`
    ).join('\n\n')

    const candidatesPrompt = `<case>
<order_id>${caseData.orderId}</order_id>
<product>${caseData.productName}</product>
<buyer_name>${caseData.buyerName}</buyer_name>

<thread>
${threadXml}
</thread>
</case>

Generate exactly 3 distinct draft responses to the most recent buyer message. Each draft should take a slightly different approach:

1. **Concise**: A brief, efficient response that gets straight to the solution
2. **Detailed**: A more thorough response with additional context or explanation  
3. **Warm**: An especially empathetic response that emphasizes understanding`

    // Use structured outputs for guaranteed JSON format
    const response = await client.beta.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      betas: ["structured-outputs-2025-11-13"],
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" }
        }
      ],
      messages: [
        { role: 'user', content: candidatesPrompt }
      ],
      output_format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            candidates: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["candidates"],
          additionalProperties: false
        }
      }
    })

    const content = response.content[0].text
    const parsed = JSON.parse(content)
    
    res.json({ candidates: parsed.candidates })
  } catch (error) {
    console.error('Error generating candidates:', error)
    res.status(500).json({ error: error.message || 'Failed to generate candidates' })
  }
})

// Improve text endpoint - takes existing text and improves it based on user instruction
app.post('/api/improve-text', async (req, res) => {
  const { text, instruction } = req.body

  if (!text || !instruction) {
    return res.status(400).json({ error: 'Both text and instruction are required' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.error('ERROR: ANTHROPIC_API_KEY not found. Create a .env file with your API key.')
    return res.status(500).json({ 
      error: 'API key not configured. Please create a .env file with ANTHROPIC_API_KEY=your_key' 
    })
  }

  try {
    const client = new Anthropic({ apiKey })

    const improvePrompt = `You are helping improve a customer service message. Here is the original message:

<original_message>
${text}
</original_message>

The user wants you to improve this message with the following instruction: "${instruction}"

Output ONLY the improved message text. Do not include any preamble, explanation, or commentary. Just output the improved message that can be sent directly to the customer.`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: improvePrompt }
      ],
    })

    const improvedText = response.content[0].text
    res.json({ improvedText })
  } catch (error) {
    console.error('Error improving text:', error)
    res.status(500).json({ error: error.message || 'Failed to improve text' })
  }
})

// Agent feedback chat endpoint
app.post('/api/agent-feedback', async (req, res) => {
  const { messages } = req.body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured.' })
  }

  const agentFeedbackSystemPrompt = `You are the Seller Assistant AI — a smart customer messaging agent built into a seller's inbox tool. You help sellers draft replies to buyer messages on marketplace platforms.

A seller is now talking to you directly to give you feedback about how you respond. Your job is to:
- Listen carefully and acknowledge their feedback warmly but concisely
- Confirm what you'll do differently going forward (be specific)
- Ask a clarifying follow-up if the instruction is vague
- Keep replies short — 1 to 3 sentences max
- Never be defensive; always be receptive and helpful
- Speak in first person as the assistant ("Got it, I'll...", "Understood — I'll make sure to...", etc.)

Examples:
User: "Can you reply more professionally?"
You: "Got it — I'll keep responses formal, avoid casual language, and use complete sentences from now on. Anything specific you'd like me to change about the tone?"

User: "Stop apologizing so much"
You: "Understood. I'll cut the excessive apologies and keep things direct while still being polite."

User: "Make your drafts shorter"
You: "Got it — I'll aim for concise replies, ideally under 3 sentences, unless the question genuinely requires more detail."`

  try {
    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 256,
      system: agentFeedbackSystemPrompt,
      messages,
    })

    res.json({ reply: response.content[0].text })
  } catch (error) {
    console.error('Error in agent feedback:', error)
    res.status(500).json({ error: error.message || 'Failed to get response' })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

