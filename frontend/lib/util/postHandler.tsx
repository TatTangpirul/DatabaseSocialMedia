// lib/util/postHandler.ts

export async function handlePost(content: string, imageUrl?: string, onSuccess?: () => void) {
    if (!content.trim()) return;

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
    // placeholder for raw image upload logic
    console.log('Upload raw image:', file);
    return null;
}