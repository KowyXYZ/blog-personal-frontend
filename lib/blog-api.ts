import { BlogPost } from "./types";

const API_BASE_URL = "https://blog-webapi.onrender.com/api/blogposts";

export interface CreatePostData {
  title: string;
  slug: string;
  content: string;
}

export interface UpdatePostData {
  id: number;
  title: string;
  slug: string;
  content: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  
  // Check if response has content before parsing JSON
  const contentType = response.headers.get("content-type");
  const contentLength = response.headers.get("content-length");
  
  // If content-length is 0 or status is 204 No Content, return empty object
  if (response.status === 204 || contentLength === "0") {
    return {} as T;
  }
  
  // Read the response body once
  const text = await response.text();
  
  // If response is empty, return empty object
  if (!text || text.trim() === "") {
    return {} as T;
  }
  
  // Try to parse as JSON
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    // If JSON parsing fails and content-type suggests JSON, throw error
    if (contentType && contentType.includes("application/json")) {
      throw new Error(`Failed to parse JSON response: ${text.substring(0, 100)}`);
    }
    // Otherwise, return empty object (might be text/html or other format)
    return {} as T;
  }
}

export async function getPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(API_BASE_URL, {
      cache: "no-store", // Always fetch fresh data
    });
    return handleResponse<BlogPost[]>(response);
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function getPostById(id: number): Promise<BlogPost> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      cache: "no-store",
    });
    return handleResponse<BlogPost>(response);
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  try {
    const response = await fetch(`${API_BASE_URL}/slug/${slug}`, {
      cache: "no-store",
    });
    return handleResponse<BlogPost>(response);
  } catch (error) {
    console.error(`Error fetching post by slug ${slug}:`, error);
    throw error;
  }
}

export async function createPost(data: CreatePostData): Promise<BlogPost> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<BlogPost>(response);
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function updatePost(
  id: number,
  data: UpdatePostData
): Promise<BlogPost> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    // Check if response has content
    const contentType = response.headers.get("content-type");
    const text = await response.text();
    
    // If response is empty, fetch the updated post
    if (!text || text.trim() === "") {
      // API returned success but no body, fetch the updated post
      return getPostById(id);
    }
    
    // Try to parse JSON
    try {
      return JSON.parse(text) as BlogPost;
    } catch (error) {
      // If parsing fails but status is OK, fetch the post
      console.warn("Failed to parse update response, fetching post:", error);
      return getPostById(id);
    }
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error;
  }
}

export async function deletePost(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
}

