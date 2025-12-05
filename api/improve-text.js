import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, instruction } = req.body

  if (!text || !instruction) {
    return res.status(400).json({ error: 'Both text and instruction are required' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'API key not configured. Please set ANTHROPIC_API_KEY environment variable.' 
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
      model: 'claude-sonnet-4-5',
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
}

