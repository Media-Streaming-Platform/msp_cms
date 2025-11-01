const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; 

export async function fetchContent() {
  const response = await fetch(`${BASE_URL}/media/get-all`);
  if (!response.ok) {
    throw new Error('Failed to fetch medias');
  }
  return response.json();
}

export async function createContent(contentData: any) {
  const response = await fetch(`${BASE_URL}/media/upload-media`, {
    method: 'POST',
    body: contentData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create category');
  }

  return response.json();
}

