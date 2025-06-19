const API_URL = import.meta.env.VITE_ADMINAGENCY_API_URL;

export async function fetchAgencyFromAPI(): Promise<any[]> {
    try {
        console.log("🌐 API_URL:", API_URL);

        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                'ngrok-skip-browser-warning': 'any',
            },
        });
        console.log("🔍 status", response.status);
        console.log("🔍 headers", [...response.headers.entries()]);

        const text = await response.text();

        console.log("📄 Raw Response:", text);

        const json = JSON.parse(text);

        if (json.massage === 'success') {
            return json.result;
        } else {
            console.error('API Error:', json);
            return [];
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        return [];
    }
}

export async function createNewsAgency(name: string) {
  try {
    const response = await fetch(`${API_URL}/category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to create category');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error creating category:', error);
    throw error;
  }
}