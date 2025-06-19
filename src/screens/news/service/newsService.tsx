const API_URL = import.meta.env.VITE_ADMINNEWS_API_URL;

export async function fetchNewsFromAPI(): Promise<any[]> {
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
            return json.result.data;
        } else {
            console.error('API Error:', json);
            return [];
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        return [];
    }
}

export async function fetchNewsById(newsId: number): Promise<any | null> {
    try {
        const response = await fetch(`${API_URL}/${newsId}`, {
            method: "GET",
            headers: {
                'ngrok-skip-browser-warning': 'any',
            },
        });

        console.log("🔍 fetchNewsById status", response.status);

        const text = await response.text();
        console.log("📄 Raw Response (ById):", text);

        const json = JSON.parse(text);

        if (json.massage === 'success') {
            return json.result;
        } else {
            console.error('API Error:', json);
            return null;
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}



