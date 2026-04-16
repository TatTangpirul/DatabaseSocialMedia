export interface SearchResult {
    id: number;
    username: string;
    profile_image_url: string | null;
}

export async function searchUsers(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) return data.users;
        return [];
    } catch {
        return [];
    }
}