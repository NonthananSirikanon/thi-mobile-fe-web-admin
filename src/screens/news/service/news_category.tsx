const API_URL = import.meta.env.VITE_GETCATEGORY_API_URL;
const API_ADMIN_URL = import.meta.env.VITE_ADMINCATEGORY_API_URL;

export async function fetchCategoryFromAPI(): Promise<any[]> {
    try {
        console.log("🌐 API_URL:", API_ADMIN_URL);

        const response = await fetch(API_ADMIN_URL, {
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

export async function createNewsCategory(name: string, status: boolean, createdBy: number) {
  try {
    const response = await fetch(`${API_ADMIN_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        "name": name,
        "status": status,
        "createdBy": createdBy,
       }),
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

export async function deleteNewsCategory(categoryId: number, deletedBy: number ) {
  try {
    const response = await fetch(`${API_ADMIN_URL}/${categoryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "deletedBy" : deletedBy }),
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