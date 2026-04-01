import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { FaArrowLeft, FaCalendar, FaUser } from 'react-icons/fa';

// ── Server-side metadata for Google SEO ──────────────────────────────────────
export async function generateMetadata({ params }) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: blog } = await supabase
      .from('blogs')
      .select('title, excerpt')
      .eq('id', params.id)
      .single();

    if (!blog) return { title: 'Blog Post Not Found' };

    return {
      title: blog.title,
      description: blog.excerpt || `Read "${blog.title}" on Social Footholds.`,
      openGraph: {
        title: blog.title,
        description: blog.excerpt || `Read "${blog.title}" on Social Footholds.`,
        type: 'article',
      },
    };
  } catch {
    return { title: 'Blog Post' };
  }
}

// ── Server Component — no 'use client' needed ─────────────────────────────────
export default async function BlogDetail({ params }) {
  let blog = null;

  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', params.id)
      .single();
    blog = data;
  } catch (error) {
    console.error('Error fetching blog:', error);
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Blog Not Found</h1>
          <Link href="/blogs" className="text-purple-400 hover:text-purple-300">
            <FaArrowLeft className="inline mr-2" /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navbar */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Social Footholds
            </Link>
            <div className="flex gap-4">
              <Link href="/blogs" className="text-gray-300 hover:text-white transition px-4 py-2 rounded-lg hover:bg-white/10">
                Blog
              </Link>
              <Link href="/login" className="text-gray-300 hover:text-white transition px-4 py-2 rounded-lg hover:bg-white/10">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/blogs" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <FaArrowLeft className="mr-2" /> Back to Blogs
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{blog.title}</h1>

        <div className="flex items-center gap-6 text-gray-400 mb-8 pb-8 border-b border-purple-500/20">
          <span className="flex items-center">
            <FaUser className="mr-2" /> {blog.author}
          </span>
          <span className="flex items-center">
            <FaCalendar className="mr-2" /> {new Date(blog.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {blog.content}
          </div>
        </div>
      </article>
    </div>
  );
}
