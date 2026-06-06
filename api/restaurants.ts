import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const target = ['https://www.googleapis.com/auth/spreadsheets.readonly']
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      target
    )

    const sheets = google.sheets({ version: 'v4', auth: jwt })
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Trang tính1!A2:X', 
    })

    const rows = response.data.values
    if (!rows || rows.length === 0) return res.status(200).json([])

    const restaurants = rows.map((row) => ({
      id: row[0] || '',
      name: row[1] || '',
      address: row[2] || '',
      category: row[3] || '',
      priceRange: row[4] || '',
      personalNotes: row[5] || '',
      // Map thêm các cột khác tương tự theo cấu trúc sheet của bạn...
      visited: row[8] === 'TRUE',
      recommended: row[9] === 'TRUE',
      mapLink: row[14] || '',
      rating: parseFloat(row[7]) || 4.5,
    }))

    // Caching header cho Vercel Edge Network
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    return res.status(200).json(restaurants)
  } catch (error: any) {
    console.error('Google Sheets Error:', error)
    return res.status(500).json({ error: 'Failed to fetch data' })
  }
}