// lib/util/postHandler.ts

export async function handlePost(content: string, imageUrl?: string, onSuccess?: () => void) {
    if (!content.trim() && !imageUrl) return;
    
    try {
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, image_url: imageUrl }),
        });

        const data = await res.json();

        if (res.ok) {
            onSuccess?.();
        } else {
            console.error(data.error);
        }
    } catch (err) {
        console.error('Failed to post:', err);
    }
}

export async function handleImageUpload(file: File): Promise<string | null> {
    try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY!);

        const res = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();

        if (data.success) {
            return data.data.url; // returns the image URL
        }
        return null;
    } catch (err) {
        console.error('Image upload failed:', err);
        return null;
    }
}