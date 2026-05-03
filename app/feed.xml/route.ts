import { getAllPosts } from '@/lib/blog/posts';

const SITE_URL = 'https://cashcast.money';

export async function GET() {
  const posts = getAllPosts();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Cashcast Blog - Freelancer Finance Tips</title>
    <description>Expert guides on managing irregular income, cash flow forecasting, and financial planning for freelancers, solopreneurs, and self-employed professionals.</description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>support@cashcast.money (Cashcast Team)</managingEditor>
    <webMaster>support@cashcast.money (Cashcast Team)</webMaster>
    <image>
      <url>${SITE_URL}/icon-512x512.png</url>
      <title>Cashcast Blog</title>
      <link>${SITE_URL}</link>
    </image>
    <copyright>Copyright ${new Date().getFullYear()} Cashcast. All rights reserved.</copyright>
    <category>Finance</category>
    <category>Freelance</category>
    <category>Budgeting</category>
    <ttl>60</ttl>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>support@cashcast.money (${post.author.name})</author>
      <category>${post.category}</category>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
