import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const { user } = useAuth();

  useEffect(() => { api.get(`/posts/${id}`).then(r => setPost(r.data)); }, [id]);

  const handleLike = async () => {
    const { data } = await api.put(`/posts/${id}/like`);
    setPost(p => ({ ...p, likes: data.likes }));
  };

  const handleSave = async () => { await api.put(`/posts/${id}/save`); };

  const handleComment = async (e) => {
    e.preventDefault();
    const { data } = await api.post(`/posts/${id}/comment`, { text: comment });
    setPost(p => ({ ...p, comments: data }));
    setComment('');
  };

  if (!post) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
      <img src={post.imageUrl} alt={post.title} style={{ width: '100%', borderRadius: '24px' }} />
      <div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem' }}>
          <button onClick={handleLike} style={{ padding: '10px 20px', borderRadius: '20px', background: post.likes?.includes(user?.id) ? '#e60023' : '#f0f0f0', color: post.likes?.includes(user?.id) ? '#fff' : '#333', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
            ♥ {post.likes?.length}
          </button>
          <button onClick={handleSave} style={{ padding: '10px 20px', borderRadius: '20px', background: '#e60023', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Save</button>
        </div>
        <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>{post.title}</h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>{post.description}</p>
        <p style={{ fontSize: '13px', color: '#999' }}>by {post.author?.username} · {post.category}</p>

        <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Comments ({post.comments?.length})</h3>
          {post.comments?.map((c, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <span style={{ fontWeight: '600', fontSize: '13px' }}>{c.user?.username}</span>
              <p style={{ margin: '2px 0', fontSize: '14px' }}>{c.text}</p>
            </div>
          ))}
          {user && (
            <form onSubmit={handleComment} style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
              <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..."
                style={{ flex: 1, padding: '10px 14px', borderRadius: '20px', border: '1.5px solid #ddd', fontSize: '14px' }} />
              <button type="submit" style={{ padding: '10px 18px', background: '#e60023', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600' }}>Post</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}