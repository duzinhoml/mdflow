import { useSong } from '../contexts/SongContext.jsx';
import { useToggleVisible } from '../contexts/ToggleVisibleContext.jsx';

function SongLayout({ children }) {
    const { currentSong, currentSections, currentSection } = useSong();
    const { visible, toggleVisible } = useToggleVisible();

    const handleOpenArrangement = () => {
        if (!visible.selector) {
            toggleVisible('selector');
        }
    };

    return (
        <div className="flex-grow-1 d-flex flex-column overflow-hidden px-2 px-md-3 px-lg-4 py-2">
            {/* Timeline Toolbar Header */}
            <div className="d-flex align-items-center justify-content-between mb-2 px-1">
                <div className="d-flex align-items-center gap-2">
                    <span className="badge-tag" style={{ backgroundColor: 'rgba(124, 77, 255, 0.15)', color: 'var(--accent-primary)', border: '1px solid rgba(124, 77, 255, 0.3)' }}>
                        <i className="fa-solid fa-layer-group"></i>
                        Arrangement Timeline
                    </span>

                    {currentSong && currentSections?.length > 0 && (
                        <div className="d-none d-md-flex align-items-center gap-1 ms-2" style={{ maxWidth: '45vw', overflowX: 'auto', scrollbarWidth: 'none' }}>
                            {currentSections.map((sec, idx) => (
                                <span 
                                    key={sec._id || idx}
                                    className="d-flex align-items-center gap-1 text-light"
                                    style={{ fontSize: '11px', opacity: currentSection?._id === sec._id ? 1 : 0.7 }}
                                >
                                    <span 
                                        className="rounded-pill px-2 py-0 fw-semibold"
                                        style={{ 
                                            backgroundColor: sec.color || '#7c4dff',
                                            fontSize: '10px',
                                            color: '#fff',
                                            boxShadow: currentSection?._id === sec._id ? '0 0 8px rgba(124, 77, 255, 0.6)' : 'none'
                                        }}
                                    >
                                        {sec.label}
                                    </span>
                                    {idx < currentSections.length - 1 && (
                                        <i className="fa-solid fa-angle-right text-muted" style={{ fontSize: '9px' }}></i>
                                    )}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="d-flex align-items-center gap-2">
                    {currentSong && (
                        <span className="text-muted" style={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
                            {currentSections?.length || 0} {currentSections?.length === 1 ? 'section' : 'sections'}
                        </span>
                    )}

                    <button 
                        type="button"
                        className="btn btn-sm text-light d-flex align-items-center gap-1"
                        style={{
                            backgroundColor: visible.selector ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '12px',
                            fontWeight: 500,
                            padding: '6px 12px',
                            minHeight: '36px',
                            touchAction: 'manipulation'
                        }}
                        onClick={handleOpenArrangement}
                        title="Toggle Arrangement Palette"
                    >
                        <i className="fa-solid fa-plus"></i>
                        <span className="d-none d-sm-inline">Add Elements</span>
                    </button>
                </div>
            </div>

            {/* Horizontal Timeline Track Container */}
            <div 
                className="flex-grow-1 d-flex overflow-x-auto p-2"
                style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-lg)',
                    minHeight: 'clamp(180px, 28vh, 260px)',
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.4)',
                    touchAction: 'pan-x pan-y'
                }}
            >
                <div className="d-flex align-items-stretch">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SongLayout;