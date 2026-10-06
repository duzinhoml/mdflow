import { DYNAMIC_LEVELS } from './CurrentTab.jsx';

export function PaletteDragOverlay({ activeItem }) {
    if (!activeItem) return null;
    const { category, item } = activeItem;

    if (category === 'section') {
        return (
            <div 
                className="palette-drag-preview section-drag-preview"
                style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: `2px solid ${item.color || 'var(--accent-primary)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(124, 77, 255, 0.4)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'grabbing',
                    pointerEvents: 'none',
                    transform: 'scale(1.05) rotate(1deg)',
                    zIndex: 99999
                }}
            >
                <span 
                    className="section-dot" 
                    style={{ 
                        backgroundColor: item.color, 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%',
                        boxShadow: `0 0 8px ${item.color}`
                    }}
                ></span>
                <span>{item.label}</span>
                <span 
                    className="badge ms-2"
                    style={{ 
                        backgroundColor: 'rgba(124, 77, 255, 0.25)', 
                        color: 'var(--accent-primary)',
                        fontSize: '10px',
                        padding: '3px 6px',
                        border: '1px solid rgba(124, 77, 255, 0.4)'
                    }}
                >
                    <i className="fa-solid fa-arrow-down me-1"></i> Add Section
                </span>
            </div>
        );
    }

    if (category === 'dynamic') {
        const level = item.level || DYNAMIC_LEVELS?.[item.label] || { musicalSymbol: 'mf', color: '#f59e0b' };
        return (
            <div 
                className="palette-drag-preview dynamic-drag-preview"
                style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: `2px solid ${level.color || 'var(--color-warning)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.35)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'grabbing',
                    pointerEvents: 'none',
                    transform: 'scale(1.05) rotate(1deg)',
                    zIndex: 99999
                }}
            >
                <span className="fw-bold" style={{ color: level.color, fontSize: '15px' }}>
                    {level.musicalSymbol}
                </span>
                <span>{item.label}</span>
                <span 
                    className="badge ms-2"
                    style={{ 
                        backgroundColor: 'rgba(245, 158, 11, 0.2)', 
                        color: level.color,
                        fontSize: '10px',
                        padding: '3px 6px',
                        border: `1px solid ${level.color}`
                    }}
                >
                    <i className="fa-solid fa-bullseye me-1"></i> Drop on Card
                </span>
            </div>
        );
    }

    if (category === 'instrument') {
        let catIcon = 'fa-solid fa-music';
        const label = item.label || '';
        if (label.includes('Drum') || label.includes('Perc') || label.includes('Loop')) catIcon = 'fa-solid fa-drum';
        else if (label.includes('Bass')) catIcon = 'fa-solid fa-guitar';
        else if (label.includes('Guitar')) catIcon = 'fa-solid fa-guitar';
        else if (label.includes('Piano') || label.includes('Key') || label.includes('Organ')) catIcon = 'fa-solid fa-keyboard';

        return (
            <div 
                className="palette-drag-preview instrument-drag-preview"
                style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '2px solid var(--color-info)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.35)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'grabbing',
                    pointerEvents: 'none',
                    transform: 'scale(1.05) rotate(1deg)',
                    zIndex: 99999
                }}
            >
                <i className={catIcon} style={{ color: 'var(--color-info)', fontSize: '14px' }}></i>
                <span>{item.label}</span>
                <span 
                    className="badge ms-2"
                    style={{ 
                        backgroundColor: 'rgba(56, 189, 248, 0.2)', 
                        color: 'var(--color-info)',
                        fontSize: '10px',
                        padding: '3px 6px',
                        border: '1px solid var(--color-info)'
                    }}
                >
                    <i className="fa-solid fa-bullseye me-1"></i> Drop on Card
                </span>
            </div>
        );
    }

    return null;
}

export default PaletteDragOverlay;
