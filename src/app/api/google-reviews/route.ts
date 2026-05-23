import { NextResponse } from "next/server";

const PLACE_ID = "ChIJvcKVmzdhpQ0R7-2WqkwP-wQ";

const mockReviews = [
  { author: "Tomasz S.", rating: 5, text: "Very nice restaurant. The staff are extremely friendly and welcoming. The atmosphere is great with two different indoor seating areas and a lovely outdoor terrace.", date: "2 months ago", source: "Google" },
  { author: "Elena P.", rating: 5, text: "Fantastic meal last night! We had the mixed grill followed by creme caramel and tiramisu. The meat was great, desserts were homemade, and the prices were fantastic!", date: "2 months ago", source: "Google" },
  { author: "Sarah M.", rating: 5, text: "The Blacksmith is hands down the best restaurant in Agadir. The chicken tagine with preserved lemon was incredible and the service was impeccable.", date: "4 months ago", source: "Google" },
  { author: "Youssef K.", rating: 5, text: "As a local, I can say this is one of the best restaurants in Agadir. The mixed grill platter is a must-try. Great atmosphere and wonderful staff.", date: "5 months ago", source: "Google" },
  { author: "Aron H.", rating: 4, text: "Very clean, great food. Been 2 times. The pizza is excellent - authentic Italian style.", date: "3 months ago", source: "Google" },
  { author: "Marny C.", rating: 5, text: "Great restaurant! Food was delicious - really enjoyed the garlic bread as starter and shish kebab as main. Mojitos are also great!", date: "1 month ago", source: "Google" },
  { author: "Hel", rating: 4, text: "The waiter was very polite and helpful. Good selection of dishes. The crème brûlée was perfect.", date: "2 months ago", source: "Google" },
];

export async function GET() {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=reviews,rating,userRatingCount`,
        { headers: { "X-Goog-Api-Key": apiKey } }
      );
      if (res.ok) {
        const data = await res.json();
        const reviews = (data.reviews || []).map((r: { author: string; rating: number; text: string }) => ({
          author: r.author,
          rating: r.rating,
          text: r.text,
          source: "Google",
        }));
        return NextResponse.json({ reviews, totalRating: data.rating, totalCount: data.userRatingCount });
      }
    } catch { /* fall through to mock */ }
  }

  return NextResponse.json({ reviews: mockReviews, totalRating: 4.7, totalCount: mockReviews.length });
}
