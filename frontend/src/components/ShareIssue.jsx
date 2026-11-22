import { Share2, Copy, Link2, Mail, X as XIcon } from "lucide-react";

export default function ShareIssue({ issue, baseUrl = window.location.origin }) {
  const issueUrl = `${baseUrl}/issue/${issue.id}`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(issueUrl);
      return true;
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = issueUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    }
  }

  return (
    <div className="share-panel">
      <div className="share-header">
        <Share2 size={16} />
        <span>Share This Report</span>
      </div>

      <div className="share-link-row">
        <input
          type="text"
          className="share-link-input"
          value={issueUrl}
          readOnly
        />
        <button
          type="button"
          className="btn-copy-link"
          onClick={handleCopyLink}
          title="Copy link to clipboard"
        >
          <Copy size={14} />
        </button>
      </div>

      <div className="share-actions">
        <button
          type="button"
          className="btn-share-twitter"
          onClick={() => {
            const text = `Check out this civic issue on JanDrishti: ${issue.title} (${issue.id})`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(issueUrl)}`, "_blank", "width=550,height=420");
          }}
          title="Share on X (Twitter)"
        >
          <XIcon size={16} />
          <span>X</span>
        </button>

        <button
          type="button"
          className="btn-share-mail"
          onClick={() => {
            const subject = `JanDrishti: ${issue.title} (${issue.id})`;
            const body = `I found this civic issue report on JanDrishti and thought you should see it.\n\n${issue.title}\n${issue.description}\nLocation: ${issue.ward}\nStatus: ${issue.status}\n\nView it here: ${issueUrl}`;
            window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          }}
          title="Share via Email"
        >
          <Mail size={16} />
          <span>Email</span>
        </button>

        <button
          type="button"
          className="btn-share-link"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `JanDrishti - ${issue.title}`,
                text: issue.description,
                url: issueUrl,
              }).catch(() => {});
            } else {
              handleCopyLink();
            }
          }}
          title="Share link"
        >
          <Link2 size={16} />
          <span>Link</span>
        </button>
      </div>

      <div className="share-qr-note">
        <small>Share the link so others can view, upvote, and track this issue.</small>
      </div>
    </div>
  );
}