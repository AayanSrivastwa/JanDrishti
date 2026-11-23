import { useState } from "react";
import { MessageCircle, Clock, Trash2, Edit3 } from "lucide-react";
import {
  addIssueComment,
  deleteIssueComment,
  getStoredComments,
} from "../Services/issueService";

export default function CommentSection({ issueId, currentUser, currentUserRole = "citizen" }) {
  const [prevIssueId, setPrevIssueId] = useState(issueId);
  const [comments, setComments] = useState(() => getStoredComments(issueId));
  const [inputText, setInputText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  if (issueId !== prevIssueId) {
    setPrevIssueId(issueId);
    setComments(getStoredComments(issueId));
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!inputText.trim()) return;
    setSubmitting(true);
    const newComment = addIssueComment(issueId, {
      author: currentUser?.user_metadata?.name || currentUser?.name || "Citizen",
      authorRole: currentUserRole,
      text: inputText.trim(),
      avatar: null,
    });
    setComments([newComment, ...comments]);
    setInputText("");
    setSubmitting(false);
  }

  async function handleDeleteComment(commentId) {
    if (!window.confirm("Delete this comment?")) return;
    const updated = deleteIssueComment(issueId, commentId, currentUser?.user_metadata?.name || currentUser?.name || "Citizen");
    setComments(updated);
  }

  function startEdit(comment) {
    setEditingId(comment.id);
    setEditText(comment.text);
  }

  async function handleSaveEdit(comment) {
    // Simple approach: delete old and add new (prototype-friendly)
    const updated = deleteIssueComment(issueId, comment.id, currentUser?.user_metadata?.name || currentUser?.name || "Citizen");
    const newComment = addIssueComment(issueId, {
      author: comment.author,
      authorRole: comment.authorRole,
      text: editText.trim(),
      avatar: comment.avatar,
    });
    setComments([newComment, ...updated.filter((c) => c.id !== comment.id)]);
    setEditingId(null);
  }

  const isAdmin = currentUserRole === "admin" || currentUserRole === "municipal";

  return (
    <div className="comment-section">
      <div className="comments-header">
        <MessageCircle size={18} />
        <span className="comments-count">{comments.length} Community Discussion</span>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="comments-empty">
            <p>No comments yet. Be the first to share your observation!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={`comment-item ${editingId === comment.id ? "editing" : ""}`}>
              <div className="comment-header">
                <div className="comment-author">
                  {comment.author} {isAdmin && comment.authorRole === "admin" && (
                    <span className="admin-badge">Municipal</span>
                  )}
                </div>
                <div className="comment-time">
                  <Clock size={12} />
                  <span>{new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
              <div className="comment-body">
                {editingId === comment.id ? (
                  <textarea
                    className="edit-textarea"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <p>{comment.text}</p>
                )}
              </div>
              <div className="comment-actions">
                {editingId === comment.id ? (
                  <>
                    <button
                      type="button"
                      className="btn-comment-save"
                      onClick={() => handleSaveEdit(comment)}
                    >
                      <Edit3 size={14} /> Save
                    </button>
                    <button
                      type="button"
                      className="btn-comment-cancel"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {(currentUser?.user_metadata?.name === comment.author || currentUser?.name === comment.author || isAdmin) && (
                      <button
                        type="button"
                        className="btn-comment-edit"
                        onClick={() => startEdit(comment)}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        type="button"
                        className="btn-comment-delete"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddComment} className="comment-form">
        <div className="comment-input-group">
          <input
            type="text"
            placeholder="Add a comment..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={submitting}
          />
          <button
            type="submit"
            className="btn-comment-submit"
            disabled={submitting || !inputText.trim()}
          >
            {submitting ? "Posting..." : (<> <MessageCircle size={14} /> Post</>)}
          </button>
        </div>
      </form>
    </div>
  );
}