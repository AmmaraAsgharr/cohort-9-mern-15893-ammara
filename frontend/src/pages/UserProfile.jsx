import { useColorCycle } from '../hooks/useColorCycle'
import '../styles/UserProfile.css'

export default function UserProfile({ user, notes, onLogout, onBack }) {
  const totalWords = notes.reduce((s, n) => s + n.wordCount, 0)
  const tagCounts = notes.flatMap(n => n.tags).reduce((a, t) => { a[t] = (a[t] || 0) + 1; return a }, {})
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const { bg: avatarBg, start: avatarStart, stop: avatarStop } = useColorCycle('#FF6B00')
  const { bg: logoutBg, start: logoutStart, stop: logoutStop } = useColorCycle('#FF4444')

  const stats = [
    { label: 'Total Notes', value: notes.length, icon: '📝', color: '#FF6B00' },
    { label: 'Words Written', value: totalWords.toLocaleString(), icon: '✍️', color: '#FFB830' },
    { label: 'Pinned', value: notes.filter(n => n.pinned).length, icon: '📌', color: '#8B5CF6' },
    { label: 'Member Since', value: user.joinedAt, icon: '🗓️', color: '#34C77B' },
  ]

  const tagColors = ['#FF6B00', '#FFB830', '#38AAFF', '#34C77B', '#8B5CF6']

  return (
    <div className="screen-enter user-profile">
      <header className="profile-header">
        <button onClick={onBack} className="back-button">
          ← Dashboard
        </button>
        <span className="profile-title">Profile</span>
        <div className="header-placeholder" />
      </header>

      <main className="profile-main">
        <div className="pop-in profile-card">
          <div className="profile-card-cover">
            <div className="profile-card-cover-pattern" />
          </div>

          <div className="profile-card-content">
            <div
              onMouseEnter={avatarStart}
              onMouseLeave={avatarStop}
              className="profile-avatar"
              style={{
                backgroundColor: avatarBg,
                boxShadow: '0 4px 16px rgba(255,107,0,0.3)',
              }}
            >
              {user.avatar}
            </div>

            <div className="profile-user-info">
              <div className="profile-user-details">
                <h2 className="profile-user-name">{user.name}</h2>
                <p className="profile-user-email">{user.email}</p>
              </div>
              <button
                onMouseEnter={logoutStart}
                onMouseLeave={logoutStop}
                onClick={onLogout}
                className="logout-button"
                style={{
                  backgroundColor: logoutBg,
                  color: '#fff',
                  boxShadow: '0 3px 12px rgba(255,68,68,0.25)',
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map(({ label, value, icon, color }, i) => (
            <div
              key={label}
              className="card-lift stat-card"
              style={{
                borderColor: `${color}40`,
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <div className="stat-icon">{icon}</div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {topTags.length > 0 && (
          <div className="top-tags-card">
            <h3 className="top-tags-title">
              <span className="top-tags-dot" />
              Top Tags
            </h3>
            <div className="top-tags-list">
              {topTags.map(([tag, count], i) => {
                const pct = Math.round((count / notes.length) * 100)
                return (
                  <div key={tag} className="tag-item">
                    <div className="tag-header">
                      <span>{tag}</span>
                      <span className="tag-count">{count} note{count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="tag-bar-track">
                      <div
                        className="tag-bar-fill"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: tagColors[i % tagColors.length],
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}