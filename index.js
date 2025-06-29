"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BASE_URL = 'https://www.ihuaben.com';
const plugin = {
    id: 'ihuaben',
    name: 'Ihuaben',
    async search(keyword) {
        const searchUrl = `${BASE_URL}/search/?q=${encodeURIComponent(keyword)}`;
        const res = await fetch(searchUrl);
        const html = await res.text();
        const regex = /<a class="book-title" href="\/book\/(\d+)\/">(.*?)<\/a>/g;
        const results = [];
        let match;
        while ((match = regex.exec(html))) {
            results.push({
                id: match[1],
                name: match[2].trim(),
                url: `${BASE_URL}/book/${match[1]}/`
            });
        }
        return results;
    },
    async detail(url) {
        const res = await fetch(url);
        const html = await res.text();
        const name = html.match(/<h1 class="title">(.*?)<\/h1>/)?.[1] || 'Không rõ';
        const author = html.match(/<span class="author-name">(.*?)<\/span>/)?.[1] || 'Không rõ';
        const chapterList = [];
        const regex = /<a href="\/chapter\/(\d+)\/(\d+)\.html"[^>]*>(.*?)<\/a>/g;
        let match;
        while ((match = regex.exec(html))) {
            chapterList.push({
                name: match[3].trim(),
                url: `${BASE_URL}/chapter/${match[1]}/${match[2]}.html`
            });
        }
        return {
            name,
            author,
            chapters: chapterList
        };
    },
    async download(chapterUrl) {
        const res = await fetch(chapterUrl);
        const html = await res.text();
        const title = html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] || '';
        const contentMatch = html.match(/<div class="chapter-content[^>]*">([\s\S]*?)<\/div>/);
        let text = contentMatch?.[1] || '';
        text = text.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
        return {
            name: title,
            content: text
        };
    }
};
exports.default = plugin;
