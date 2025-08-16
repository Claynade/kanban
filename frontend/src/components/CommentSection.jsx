import React, { useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";

// Utility functions
const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const formatDate = (dateString) => new Date(dateString).toLocaleString();

const CommentSection = ({
  comments,
  canComment,
  handleAddComment,
  handleAddReply,
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const submitComment = () => {
    if (!newComment.trim()) return;
    handleAddComment(newComment);
    setNewComment("");
  };

  const submitReply = (parentId) => {
    if (!replyContent.trim()) return;
    handleAddReply(parentId, replyContent);
    setReplyContent("");
    setReplyTo(null);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <AiOutlineMessage className="h-4 w-4" />
        <span className="text-sm font-medium">
          Comments ({comments.length})
        </span>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-[var(--background)] dark:bg-card p-4 rounded-md shadow-sm border border-border"
          >
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
                {getInitials(comment.author?.username)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {comment.author?.username || "Unknown User"}
                  </span>
                  <span className="text-xs px-2 py-0.5 border rounded border-border text-muted-foreground">
                    {comment.author?.role || "user"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  {comment.content}
                </p>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-4 mt-3 space-y-2 border-l-2 border-muted pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="flex items-start gap-2">
                        <div className="h-6 w-6 flex items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
                          {getInitials(reply.author?.username)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">
                              {reply.author?.username || "Unknown User"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {replyTo === comment._id ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full min-h-[4rem] p-2 border border-border rounded-md text-sm bg-background text-foreground"
                    />
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
                        onClick={() => submitReply(comment._id)}
                      >
                        Reply
                      </button>
                      <button
                        className="px-3 py-1 text-sm border border-border rounded text-muted-foreground"
                        onClick={() => setReplyTo(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  canComment && (
                    <button
                      className="mt-2 h-6 px-2 text-xs text-muted-foreground hover:underline"
                      onClick={() => setReplyTo(comment._id)}
                    >
                      Reply
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment */}
      {canComment && (
        <div className="mt-4 space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full min-h-[5rem] p-2 border border-border rounded-md text-sm bg-background text-foreground"
          />
          <button
            onClick={submitComment}
            disabled={!newComment.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
          >
            <AiOutlineMessage className="h-4 w-4" />
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
