export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY || 'ae4c776814214951bc9b5ba0a6dda530';

  if (req.method !== 'GET') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
    return;
  }

  try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'News API request failed');
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({
      status: 'error',
      message: error.message || 'Unable to fetch news'
    });
  }
}
