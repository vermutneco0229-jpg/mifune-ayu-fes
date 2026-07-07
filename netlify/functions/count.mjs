// あゆ王決定戦 予約数カウンター
// Netlify Forms API からフォーム送信数を取得して返す
const CAPACITY = 20;
const FORM_NAME = "ayuoh-entry";

export default async () => {
  const token = process.env.FORMS_API_TOKEN;
  const siteId = process.env.AYU_SITE_ID;

  if (!token || !siteId) {
    return Response.json(
      { error: "not configured", capacity: CAPACITY },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return Response.json(
      { error: "upstream error", capacity: CAPACITY },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }

  const forms = await res.json();
  const form = forms.find((f) => f.name === FORM_NAME);
  const count = Math.min(form ? form.submission_count : 0, CAPACITY);

  return Response.json(
    { count, capacity: CAPACITY, remaining: CAPACITY - count },
    { headers: { "Cache-Control": "no-store" } }
  );
};
