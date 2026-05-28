import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Art', 'Travel', 'Food', 'Fashion', 'Technology', 'Architecture', 'Nature'];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const observer = useRef();

  const fetchPosts = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    const currentPage = reset ? 1 : page;
    const { data } = await api.get('/posts', { params: { category, search, page: currentPage } });
    setPosts(prev => reset ? data : [...prev, ...data]);
    setHasMore(data.length === 20);
    if (!reset) setPage(p => p + 1);
    setLoading(false);
  }, [category, search, page, loading]);

  useEffect(() => { setPosts([]); setPage(1); fetchPosts(true); }, [category, search]);

  const lastPostRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) fetchPosts();
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
      {/* Search */}
      <div style={{ padding: '16px 0', display: 'flex', justifyContent: 'center' }}>
        <input
          placeholder="Search posts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '600px', padding: '12px 20px', borderRadius: '24px', border: '1.5px solid #ddd', fontSize: '15px', outline: 'none' }}
        />
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '8px 0 16px', scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{ padding: '8px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '13px', whiteSpace: 'nowrap',
              background: category === cat ? '#111' : '#f0f0f0', color: category === cat ? '#fff' : '#333', transition: 'all 0.2s' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div style={{ columns: 'auto 236px', columnGap: '16px' }}>
        {posts.map((post, i) => (
          <Link to={`/post/${post._id}`} key={post._id}
            ref={i === posts.length - 1 ? lastPostRef : null}
            style={{ display: 'block', marginBottom: '16px', textDecoration: 'none', breakInside: 'avoid' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#f0f0f0', position: 'relative', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.querySelector('.overlay').style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.querySelector('.overlay').style.opacity = '0'}>
              <img src={post.imageUrl} alt={post.title} style={{ width: '100%', display: 'block' }} loading="lazy" />
              <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '12px' }}>
                <p style={{ color: '#fff', fontWeight: '600', margin: 0, fontSize: '14px' }}>{post.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '2px 0 0' }}>by {post.author?.username}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>Loading...</div>}
    </div>
  );
}