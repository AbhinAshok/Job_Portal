import { useEffect, useState } from "react";
import { MessageSquare, Send, ArrowLeft } from "lucide-react";
import { messagesApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/client";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

export default function Messages() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [thread, setThread] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast, show } = useToast();

  async function load() {
    const { data } = await messagesApi.list();
    setItems(Array.isArray(data) ? data : data.results || []);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  async function openThread(userId) {
    setSelected(userId);
    try {
      const { data } = await messagesApi.thread(userId);
      setThread(Array.isArray(data) ? data : data.results || []);
    } catch (e) {
      show(getErrorMessage(e), "error");
    }
  }

  async function send(e) {
    e.preventDefault();
    if (!content.trim() || !selected) return;
    setSending(true);
    try {
      await messagesApi.send({ recipient: selected, content });
      setContent("");
      await openThread(selected);
      await load();
    } catch (e) {
      show(getErrorMessage(e), "error");
    } finally {
      setSending(false);
    }
  }

  // Build a deduplicated list of conversation partners (everyone who is NOT the current user)
  const myId = user?.id;
  const participants = [
    ...new Map(
      items.flatMap(m => {
        const other = m.sender?.id !== myId ? m.sender : m.recipient;
        return other?.id ? [[other.id, other]] : [];
      })
    ).values()
  ];

  return (
    <div>
      <PageHeader title="Messages" subtitle="Communicate with candidates and recruiters connected to your applications." />
      <div className="messaging">
        <aside className="thread-list">
          <div className="thread-title"><MessageSquare size={17} /> Conversations</div>
          {loading ? <Loader /> : participants.length ? (
            participants.map(u => (
              <button className={selected === u.id ? "selected" : ""} key={u.id} onClick={() => openThread(u.id)}>
                <div className="avatar">{(u.username || u.first_name || "U")[0]}</div>
                <div>
                  <strong>{u.first_name ? `${u.first_name} ${u.last_name || ""}` : u.username}</strong>
                  <span>Open conversation</span>
                </div>
              </button>
            ))
          ) : (
            <EmptyState title="No messages" text="Messages related to your applications will appear here." />
          )}
        </aside>
        <section className="chat">
          <div className="chat-head">
            {selected ? (
              <>
                <button className="mobile-back icon-btn" onClick={() => setSelected(null)}><ArrowLeft /></button>
                <strong>Conversation</strong>
              </>
            ) : <span>Select a conversation</span>}
          </div>
          <div className="chat-body">
            {selected ? thread.map((m, i) => (
              <div className={`bubble-row ${m.sender?.id === myId ? "outgoing" : "incoming"}`} key={m.id || i}>
                <div className="bubble">
                  {m.content}
                  <small>{m.created_at ? new Date(m.created_at).toLocaleString() : ""}</small>
                </div>
              </div>
            )) : (
              <div className="chat-empty">
                <MessageSquare size={30} />
                <h3>Your inbox</h3>
                <p>Select a conversation to start messaging.</p>
              </div>
            )}
          </div>
          {selected && (
            <form className="chat-compose" onSubmit={send}>
              <input value={content} onChange={e => setContent(e.target.value)} placeholder="Write a message…" />
              <button className="btn primary" disabled={sending}><Send size={16} /></button>
            </form>
          )}
        </section>
      </div>
      <Toast toast={toast} />
    </div>
  );
}
