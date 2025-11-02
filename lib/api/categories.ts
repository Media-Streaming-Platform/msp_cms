const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/category/get-all-categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

export async function createCategory(categoryData: { name: string }) {
  const response = await fetch(`${BASE_URL}/category/create-category`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create category");
  }

  return response.json();
}

export async function getSingleCategory(id: string) {
  const response = await fetch(`${BASE_URL}/category/get-by-id/:id'/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }
  return response.json();
}

export async function deleteCategory(id: string) {
  const response = await fetch(`${BASE_URL}/category/delete-category/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete category");
  }

  return response.json();
}
