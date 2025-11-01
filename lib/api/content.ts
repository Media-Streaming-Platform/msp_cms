const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchContent() {
  const response = await fetch(`${BASE_URL}/media/get-all`);
  if (!response.ok) {
    throw new Error("Failed to fetch content");
  }
  return response.json();
}

export async function createContent(contentData: {
  title: string;
  description: string;
  type: "video" | "audio";
  category: string;
  published: boolean;
}) {
  const response = await fetch(`${BASE_URL}/content/create-content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create content");
  }

  return response.json();
}

export async function updateContent(
  id: string,
  contentData: {
    title: string;
    description: string;
    type: "video" | "audio";
    category: string;
    published: boolean;
  }
) {
  const response = await fetch(`${BASE_URL}/content/update-content/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update content");
  }
  return response.json();
}

export async function deleteContent(id: string) {
  const response = await fetch(`${BASE_URL}/content/delete-content/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete content");
  }

  return response.json();
}

export async function fetchSingleContent(id: string) {
  const response = await fetch(`${BASE_URL}/media/get-by-id/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch content");
  }
  return response.json();
}
