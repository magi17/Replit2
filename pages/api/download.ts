import type { NextApiRequest, NextApiResponse } from "next";
import { ttdl, ytmp3, ytmp4, igdl, fbdl } from "ruhend-scraper";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }

    const { url } = req.query;
    if (!url || typeof url !== "string") {
        return res.status(400).json({ success: false, error: "Missing or invalid 'url' parameter" });
    }

    try {
        const media = await fetchMedia(url);
        if (!media.url && !media.video && !media.audio) {
            throw new Error("No media found for this URL.");
        }
        res.json({ success: true, data: media });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// Detect platform based on URL
function detectPlatform(url: string): string | null {
    if (url.includes("tiktok.com")) return "tiktok";
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("instagram.com")) return "instagram";
    if (url.includes("facebook.com")) return "facebook";
    return null;
}

// Fetch media URLs based on platform
async function fetchMedia(url: string) {
    const platform = detectPlatform(url);
    if (!platform) throw new Error("Unsupported URL");

    try {
        switch (platform) {
            case "tiktok": {
                const tiktok = await ttdl(url);
                return { platform, url: tiktok.video };
            }

            case "youtube": {
                const videoData = await ytmp4(url);
                const audioData = await ytmp3(url);
                return {
                    platform,
                    title: videoData.title,
                    author: videoData.author,
                    description: videoData.description,
                    duration: videoData.duration,
                    quality: videoData.quality || "Unknown",
                    views: videoData.views,
                    upload: videoData.upload,
                    thumbnail: videoData.thumbnail,
                    video: videoData.video || null,
                    audio: audioData.audio || null
                };
            }

            case "instagram": {
                const ig = await igdl(url);
                return { platform, url: ig.data.length > 0 ? ig.data[0].url : null };
            }

            case "facebook": {
                const fb = await fbdl(url);
                return { platform, url: fb.data.length > 0 ? fb.data[0].url : null };
            }

            default:
                throw new Error("Platform not supported");
        }
    } catch (error) {
        console.error(`Error fetching ${platform} media:`, error);
        throw new Error(`Failed to fetch ${platform} media.`);
    }
}
