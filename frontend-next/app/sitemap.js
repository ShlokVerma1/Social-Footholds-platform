export default async function sitemap() {
  const baseUrl = 'https://socialfootholds.com';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic blog pages — fetch from Supabase
  let blogPages = [];
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const { data: blogs } = await supabase
      .from('blogs')
      .select('id, updated_at')
      .eq('published', true);

    if (blogs) {
      blogPages = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.id}`,
        lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
    }
  } catch (err) {
    // Silently skip if Supabase is unavailable during build
    console.error('Sitemap: failed to fetch blog slugs', err);
  }

  return [...staticPages, ...blogPages];
}
