import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { BLOG_POSTS } from './Blog';
import logo from '../assets/logo.jpeg';

function renderMarkdown(content: string) {
  const lines = content.trim().split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl font-black text-black mt-8 mb-3">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-black text-black mt-10 mb-4">{line.slice(3)}</h2>);
    } else if (line.startsWith('|')) {
      // Table — collect all rows, skip separator rows (---|---)
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        const cells = lines[i].split('|').slice(1, -1).map(c => c.trim());
        const isSeparator = cells.every(c => /^[-: ]+$/.test(c));
        if (!isSeparator) rows.push(cells);
        i++;
      }
      const [header, ...body] = rows;
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-black text-white">
                {header.map((cell, j) => (
                  <th key={j} className="px-4 py-3 text-left font-bold">{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-uber-gray-50'}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 border-t border-uber-gray-200">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    } else if (line.startsWith('- ') || line.startsWith('**')) {
      // Bold inline or list item — handle inline bold
      const rendered = renderInline(line.startsWith('- ') ? line.slice(2) : line);
      if (line.startsWith('- ')) {
        elements.push(<li key={i} className="text-uber-gray-700 leading-relaxed mb-1">{rendered}</li>);
      } else {
        elements.push(<p key={i} className="text-uber-gray-700 leading-relaxed mb-4">{rendered}</p>);
      }
    } else if (line.trim() === '') {
      // blank
    } else {
      elements.push(<p key={i} className="text-uber-gray-700 leading-relaxed mb-4">{renderInline(line)}</p>);
    }
    i++;
  }

  // Wrap adjacent <li> in <ul>
  const wrapped: React.ReactNode[] = [];
  let listBuffer: React.ReactNode[] = [];
  elements.forEach((el, idx) => {
    if ((el as React.ReactElement).type === 'li') {
      listBuffer.push(el);
    } else {
      if (listBuffer.length > 0) {
        wrapped.push(<ul key={`ul-${idx}`} className="list-disc list-inside space-y-1 mb-6 ml-4">{listBuffer}</ul>);
        listBuffer = [];
      }
      wrapped.push(el);
    }
  });
  if (listBuffer.length > 0) {
    wrapped.push(<ul key="ul-end" className="list-disc list-inside space-y-1 mb-6 ml-4">{listBuffer}</ul>);
  }
  return wrapped;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(<strong key={match.index} className="font-bold text-black">{match[1]}</strong>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-white pb-20">
      <Helmet>
        <title>{post.title} | Lintel</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={`${post.category.toLowerCase()}, lintel blog, home services bethesda md, home maintenance montgomery county, ${post.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').slice(0, 5).join(', ')}`} />
        <link rel="canonical" href={`https://uselintel.pro/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={`https://uselintel.pro/blog/${post.slug}`} />
        <meta property="og:image" content="https://uselintel.pro/og-image.png" />
        <meta property="og:site_name" content="Lintel" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content="https://uselintel.pro/og-image.png" />
      </Helmet>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        author: { '@type': 'Organization', name: 'Lintel' },
        publisher: { '@type': 'Organization', name: 'Lintel', url: 'https://uselintel.pro', logo: { '@type': 'ImageObject', url: 'https://uselintel.pro/android-chrome-512x512.png' } },
        image: 'https://uselintel.pro/og-image.png',
        url: `https://uselintel.pro/blog/${post.slug}`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://uselintel.pro/blog/${post.slug}` },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://uselintel.pro/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://uselintel.pro/blog' },
          { '@type': 'ListItem', position: 3, name: post.title, item: `https://uselintel.pro/blog/${post.slug}` },
        ],
      }) }} />

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="lintel" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-white text-xl font-black tracking-tight">lintel</span>
          </Link>
          <nav className="hidden md:flex items-center">
            <Link to="/#services"      className="px-4 h-10 flex items-center text-white/70 hover:text-white text-sm font-medium transition-colors">Services</Link>
            <Link to="/#how-it-works"  className="px-4 h-10 flex items-center text-white/70 hover:text-white text-sm font-medium transition-colors">How it works</Link>
            <Link to="/worker/register" className="px-4 h-10 flex items-center text-white/70 hover:text-white text-sm font-medium transition-colors">Earn with us</Link>
            <Link to="/blog"           className="px-4 h-10 flex items-center text-white text-sm font-medium transition-colors border-b-2 border-white">Blog</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 h-9 flex items-center text-white text-sm font-semibold rounded-full hover:bg-white/10 transition-colors">Log in</Link>
            <Link to="/login" className="px-4 h-9 flex items-center bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-colors">Sign up</Link>
          </div>
        </div>
      </header>

      {/* Article */}
      <div className="pt-16">
        <div className="max-w-2xl mx-auto px-6 py-12">

          <Link to="/blog" className="inline-flex items-center gap-2 text-uber-gray-500 text-sm font-semibold hover:text-black transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 h-7 flex items-center bg-black text-white text-xs font-bold rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-uber-gray-500 text-xs">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <span className="text-uber-gray-400 text-xs">{post.date}</span>
          </div>

          <h1 className="text-4xl font-black text-black leading-tight mb-8">
            {post.title}
          </h1>

          <div className="prose-lintel">
            {renderMarkdown(post.content)}
          </div>

          {/* CTA */}
          {post.category === 'For Professionals' ? (
            <div className="mt-14 bg-black rounded-3xl p-8">
              <p className="text-white text-2xl font-black mb-2">Ready to earn?</p>
              <p className="text-uber-gray-400 text-sm mb-6">Sign up in 5 minutes. No fees, no commitments — just real work for real pay.</p>
              <Link
                to="/worker/register"
                className="inline-flex items-center gap-2 px-6 h-11 bg-white text-black text-sm font-bold rounded-xl hover:bg-uber-gray-100 transition-colors"
              >
                Sign up as a pro
              </Link>
            </div>
          ) : (
            <div className="mt-14 bg-black rounded-3xl p-8">
              <p className="text-white text-2xl font-black mb-2">Ready to book?</p>
              <p className="text-uber-gray-400 text-sm mb-6">Enter your address and get started in under 2 minutes.</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 h-11 bg-white text-black text-sm font-bold rounded-xl hover:bg-uber-gray-100 transition-colors"
              >
                See prices in my area
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
