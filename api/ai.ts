import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { prompt, context } = req.body

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    })

    const systemPrompt = `
      Bạn là chuyên gia ẩm thực AI cao cấp của ứng dụng "Hôm Nay Ăn Gì?".
      Phân tích ngữ cảnh người dùng và trả về JSON chuẩn xác:
      {
        "matchScore": number,
        "reason": "string",
        "pros": ["string"],
        "cons": ["string"],
        "alternatives": ["string"],
        "confidenceScore": number
      }
      Dữ liệu quán: ${JSON.stringify(context)}
      Yêu cầu: ${prompt}
    `

    const result = await model.generateContent(systemPrompt)
    const responseText = result.response.text()
    
    return res.status(200).json(JSON.parse(responseText))
  } catch (error) {
    console.error('Gemini API Error:', error)
    return res.status(500).json({ error: 'AI processing failed' })
  }
}