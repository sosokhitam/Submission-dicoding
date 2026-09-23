import ThreadItem from './ThreadItem.jsx';

function ThreadList({ threads, users }) {
  if (!threads.length) {
    return <p className="empty">Belum ada thread pada kategori ini.</p>;
  }

  return (
    <div className="thread-list">
      {threads.map((thread) => {
        const owner = users.find((u) => u.id === thread.ownerId);
        return <ThreadItem key={thread.id} thread={thread} owner={owner} />;
      })}
    </div>
  );
}

export default ThreadList;
