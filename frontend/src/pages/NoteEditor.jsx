import { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { NOTE_COLORS, TAGS } from '../constants';
import { microLabel } from '../constants/styles';
import { useColorCycle } from '../hooks/useColorCycle';
import FmtBtn, { Divider } from '../components/FmtBtn';
import '../styles/NoteEditor.css';

export default function NoteEditor({ note, onSave, onCancel }) {
  const isNew = !note?.id;
  const [title, setTitle] = useState(note?.title || '');
  // note.color (jab existing note edit ho rahi ho) hex value hota hai (e.g. '#FF6B00'),
  // isliye yahan usay NOTE_COLORS ke 'border' se match kar ke sahi id nikal rahe hain.
  const [color, setColor] = useState(() => {
    if (!note?.color) return 'coral';
    const match = NOTE_COLORS.find(x => x.border === note.color);
    return match ? match.id : 'coral';
  });
  const [tags, setTags] = useState(note?.tags || []);
  const [pinned, setPinned] = useState(note?.pinned || false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [wordCount, setWordCount] = useState(note?.wordCount || 0);
  // NEW: error state
  const [saveError, setSaveError] = useState(''); 
  const editorRef = useRef(null);

  const c = NOTE_COLORS.find(x => x.id === color);

  useEffect(() => {
    // Sanitize before injecting: note.content comes from storage and could
    // contain malicious HTML (script/onerror attrs) if it ever bypassed
    // server-side checks. Never assign raw stored HTML to innerHTML.
    if (editorRef.current && note?.content) {
      editorRef.current.innerHTML = DOMPurify.sanitize(note.content);
    }
  }, []);

  const format = (cmd, val) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  };

  const handleSave = async () => {
    // Sanitize what we're about to persist too (defense in depth).
    const content = DOMPurify.sanitize(editorRef.current?.innerHTML || '');
    setSaving(true);
    // Clear previous error
    setSaveError(''); 
    try {
      await onSave({
        id: note?.id,
        title: title || 'Untitled',
        content,
        color: c.border,
        tags,
        pinned,
        wordCount,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    } catch (err) {
      setSaveError('Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const saveBtn = useColorCycle(saved ? '#34C77B' : '#FF6B00');

  const colorStyle = {
    backgroundColor: c.bg,
    borderColor: c.border,
    accentColor: c.accent,
  };

  return (
    <div className="note-editor screen-enter" style={{ backgroundColor: c.bg }}>
      <header className="note-editor-header" style={{ borderBottomColor: `${c.border}60` }}>
        <div className="note-editor-header-left">
          <button
            type="button"
            onClick={onCancel}
            className="back-button"
          >
            ← Back
          </button>
          <span className="note-editor-status">
            {isNew ? 'New Note' : 'Editing'}
          </span>
        </div>

        <div className="note-editor-header-right">
          <span className="word-count">
            {wordCount} words
          </span>
          
          <button
            type="button"
            onClick={() => setPinned(p => !p)}
            className={`pin-button ${pinned ? 'pinned' : ''}`}
            aria-label={pinned ? 'Unpin note' : 'Pin note'}
            aria-pressed={pinned}
          >
            {pinned ? '📌' : '📍'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            onMouseEnter={saveBtn.start}
            onMouseLeave={saveBtn.stop}
            disabled={saving}
            className="save-button"
            style={{
              backgroundColor: saved ? '#34C77B' : saveBtn.bg,
              color: saved ? '#111' : '#fff',
              boxShadow: `0 3px 12px ${saved ? 'rgba(52,199,123,0.4)' : 'rgba(255,107,0,0.4)'}`,
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = ''}
          >
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Note'}
          </button>
        </div>
      </header>

      <div className="toolbar">
        {[
          { cmd: 'bold', icon: 'B', fw: 700 },
          { cmd: 'italic', icon: 'I', fi: 'italic' },
          { cmd: 'underline', icon: 'U', td: 'underline' },
          { cmd: 'strikeThrough', icon: 'S̶' },
        ].map(({ cmd, icon, fw, fi, td }) => (
          <FmtBtn key={cmd} onClick={() => format(cmd)}>
            <span style={{ fontWeight: fw, fontStyle: fi, textDecoration: td }}>{icon}</span>
          </FmtBtn>
        ))}
        <Divider />
        {[['h2', 'H₁'], ['h3', 'H₂'], ['p', '¶']].map(([val, icon]) => (
          <FmtBtn key={val} onClick={() => format('formatBlock', val)}>{icon}</FmtBtn>
        ))}
        <Divider />
        {[['insertUnorderedList', '•—'], ['insertOrderedList', '1.']].map(([cmd, icon]) => (
          <FmtBtn key={cmd} onClick={() => format(cmd)}>{icon}</FmtBtn>
        ))}
        <Divider />
        {NOTE_COLORS.map(nc => (
          <button
            type="button"
            key={nc.border}
            onClick={() => format('foreColor', nc.border)}
            className="color-dot"
            aria-label={`Set text color to ${nc.label}`}
            style={{ backgroundColor: nc.border }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.35)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          />
        ))}
      </div>

      <div className="note-editor-body">
        {/* Error Message */}
        {saveError && (
          <p style={{ color: '#FF4444', fontSize: '0.75rem', padding: '0 0 8px 0', margin: 0 }}>
            {saveError}
          </p>
        )}

        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title..."
          className="note-title-input"
          style={{ borderBottomColor: `${c.border}60` }}
          onFocus={e => e.target.style.borderBottomColor = c.border}
          onBlur={e => e.target.style.borderBottomColor = c.border + '60'}
        />

        <div className="note-meta-controls">
          <div className="color-selector">
            <span className="meta-label">Color:</span>
            {NOTE_COLORS.map(nc => (
              <button
               type="button"
                key={nc.id}
                onClick={() => setColor(nc.id)}
                title={nc.label}
                aria-label={`Set note color to ${nc.label}`}
                aria-pressed={color === nc.id}
                className={`color-option ${color === nc.id ? 'active' : ''}`}
                style={{
                  backgroundColor: nc.bg,
                  borderColor: nc.border,
                  boxShadow: color === nc.id ? `0 0 0 2.5px #111, 0 0 0 4.5px ${nc.border}` : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.25)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
              />
            ))}
          </div>

          <div className="tags-selector">
            <span className="meta-label">Tags:</span>
            {TAGS.map(tag => {
              const on = tags.includes(tag);
              return (
                <button 
                  type="button"
                  key={tag}
                  onClick={() => setTags(p => on ? p.filter(t => t !== tag) : [...p, tag])}
                  className={`tag-button ${on ? 'active' : ''}`}
                  aria-pressed={on}
                  style={{
                    borderColor: on ? c.border : '#11111130',
                    backgroundColor: on ? c.border + '20' : 'transparent',
                    color: on ? c.accent : '#11111160',
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="rich-editor"
          data-placeholder="Start writing your note..."
          onInput={() => {
            const txt = editorRef.current?.innerText || '';
            setWordCount(txt.trim().split(/\s+/).filter(Boolean).length);
          }}
        />

        <div className="note-footer" style={{ borderTopColor: `${c.border}30` }}>
          <span>{wordCount} words · {note?.createdAt ? `Created ${note.createdAt}` : 'New note'}</span>
          <span style={{ color: c.accent }}>{c.label} theme</span>
        </div>
      </div>
    </div>
  );
}