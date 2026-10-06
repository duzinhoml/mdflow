import { useState, useRef, useEffect, useCallback } from 'react';
import { useSong } from '../../../contexts/SongContext.jsx';
import { useToggleVisible } from '../../../contexts/ToggleVisibleContext.jsx';
import { parseSectionRepetition } from '../../../lib/constants.js';

function MobileSongLayout({ children }) {
    const { currentSong, currentSections, currentSection } = useSong();
    const { visible, toggleVisible } = useToggleVisible();

    const trackRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const isProgrammaticScrollRef = useRef(false);
    const programmaticTimerRef = useRef(null);
    const scrollEndTimerRef = useRef(null);
    const lastExternalSectionIdRef = useRef(currentSection?._id);

    const hasSections = currentSections && currentSections.length > 0;
    const totalSections = currentSections?.length || 0;

    // Smoothly scroll to a specific section index with programmatic lock
    const scrollToSection = useCallback((index) => {
        if (!trackRef.current || !hasSections) return;
        const targetIndex = Math.max(0, Math.min(index, totalSections - 1));
        const clientWidth = trackRef.current.clientWidth;
        if (!clientWidth) return;

        // Lock manual scroll updates during programmatic scroll animation
        isProgrammaticScrollRef.current = true;
        if (programmaticTimerRef.current) clearTimeout(programmaticTimerRef.current);
        if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);

        setActiveIndex(targetIndex);

        trackRef.current.scrollTo({
            left: targetIndex * clientWidth,
            behavior: 'smooth'
        });

        // Release lock after animation finishes
        programmaticTimerRef.current = setTimeout(() => {
            isProgrammaticScrollRef.current = false;
        }, 450);
    }, [hasSections, totalSections]);

    // Handle user manual swiping with hysteresis deadband (prevents rapid flipping/flashing)
    const handleScroll = useCallback(() => {
        if (isProgrammaticScrollRef.current || !trackRef.current || !hasSections) return;

        const { scrollLeft, clientWidth } = trackRef.current;
        if (!clientWidth) return;

        // Calculate progress: e.g. 0.0 -> 1.0 -> 2.0
        const progress = scrollLeft / clientWidth;
        const baseIndex = Math.floor(progress);
        const fraction = progress - baseIndex;

        // Apply hysteresis: only switch index when user has clearly committed past 60%
        let resolvedIndex = activeIndex;
        if (fraction > 0.6) {
            resolvedIndex = baseIndex + 1;
        } else if (fraction < 0.4) {
            resolvedIndex = baseIndex;
        }

        resolvedIndex = Math.max(0, Math.min(resolvedIndex, totalSections - 1));

        if (resolvedIndex !== activeIndex) {
            setActiveIndex(resolvedIndex);
        }

        // Debounce final settlement check
        if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
        scrollEndTimerRef.current = setTimeout(() => {
            if (trackRef.current) {
                const finalLeft = trackRef.current.scrollLeft;
                const finalIndex = Math.round(finalLeft / clientWidth);
                const clamped = Math.max(0, Math.min(finalIndex, totalSections - 1));
                setActiveIndex(clamped);
            }
        }, 120);
    }, [hasSections, totalSections, activeIndex]);

    // Listen to native scrollend event for precise snap settlement
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const handleNativeScrollEnd = () => {
            isProgrammaticScrollRef.current = false;
            const clientWidth = track.clientWidth;
            if (!clientWidth || !hasSections) return;
            const finalIndex = Math.round(track.scrollLeft / clientWidth);
            const clamped = Math.max(0, Math.min(finalIndex, totalSections - 1));
            setActiveIndex(clamped);
        };

        track.addEventListener('scrollend', handleNativeScrollEnd);
        return () => track.removeEventListener('scrollend', handleNativeScrollEnd);
    }, [hasSections, totalSections]);

    // Sync only when currentSection is changed from an external component (e.g. palette, drawer)
    useEffect(() => {
        if (!currentSection?._id || !hasSections) return;
        if (currentSection._id !== lastExternalSectionIdRef.current) {
            lastExternalSectionIdRef.current = currentSection._id;
            const idx = currentSections.findIndex(s => s._id === currentSection._id);
            if (idx !== -1 && idx !== activeIndex) {
                scrollToSection(idx);
            }
        }
    }, [currentSection?._id, hasSections, currentSections, activeIndex, scrollToSection]);

    // Keep activeIndex within bounds when sections change
    useEffect(() => {
        if (activeIndex >= totalSections && totalSections > 0) {
            setActiveIndex(totalSections - 1);
        }
    }, [totalSections, activeIndex]);

    // Cleanup timers
    useEffect(() => {
        return () => {
            if (programmaticTimerRef.current) clearTimeout(programmaticTimerRef.current);
            if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
        };
    }, []);

    const handleOpenArrangement = () => {
        if (!currentSong) return;
        if (!visible.selector) {
            toggleVisible('selector');
        }
    };

    const activeSec = hasSections && activeIndex < totalSections ? currentSections[activeIndex] : null;
    const { baseLabel: activeBaseLabel } = activeSec ? parseSectionRepetition(activeSec.label) : { baseLabel: '' };
    const activeColor = activeSec?.color || 'var(--accent-primary)';

    return (
        <div className="flex-grow-1 d-flex flex-column overflow-hidden px-2 py-2 mobile-timeline-container">
            {/* Timeline Toolbar Header */}
            <div className="d-flex align-items-center justify-content-between mb-2 px-1">
                <div className="d-flex align-items-center gap-2">
                    <span 
                        className="badge-tag" 
                        style={{ 
                            backgroundColor: 'rgba(124, 77, 255, 0.15)', 
                            color: 'var(--accent-primary)', 
                            border: '1px solid rgba(124, 77, 255, 0.3)',
                            fontSize: '11px'
                        }}
                    >
                        <i className="fa-solid fa-layer-group"></i>
                        Arrangement Timeline
                    </span>
                    {currentSong && (
                        <span className="text-muted" style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace" }}>
                            {totalSections} {totalSections === 1 ? 'sec' : 'secs'}
                        </span>
                    )}
                </div>

                <button 
                    type="button"
                    className="btn btn-sm text-light d-flex align-items-center gap-1"
                    style={{
                        backgroundColor: visible.selector ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        fontWeight: 500,
                        padding: '4px 10px',
                        minHeight: '32px',
                        touchAction: 'manipulation',
                        opacity: currentSong ? 1 : 0.45,
                        cursor: currentSong ? 'pointer' : 'not-allowed'
                    }}
                    onClick={handleOpenArrangement}
                    disabled={!currentSong}
                    title={currentSong ? "Toggle Arrangement Palette" : "Select a song first to open arrangement palette"}
                >
                    <i className="fa-solid fa-plus"></i>
                    <span>Add Elements</span>
                </button>
            </div>

            {/* Instagram Reels-Style Carousel Header Bar (Active when multiple sections exist) */}
            {hasSections && totalSections > 1 && (
                <div className="mobile-carousel-nav">
                    <button
                        type="button"
                        className="mobile-carousel-btn"
                        onClick={() => scrollToSection(activeIndex - 1)}
                        disabled={activeIndex === 0}
                        title="Previous section"
                        aria-label="Previous section"
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    <div className="mobile-carousel-indicator">
                        <div className="mobile-carousel-title">
                            <span 
                                className="mobile-carousel-color-badge"
                                style={{
                                    backgroundColor: activeColor,
                                    boxShadow: `0 0 8px ${activeColor}`
                                }}
                            ></span>
                            <span className="mobile-carousel-count">{activeIndex + 1} / {totalSections}</span>
                            <span className="text-muted">•</span>
                            <span className="mobile-carousel-label text-truncate" title={activeBaseLabel}>
                                {activeBaseLabel}
                            </span>
                        </div>

                        {/* Interactive Pagination Dots */}
                        <div className="mobile-carousel-dots">
                            {currentSections.map((sec, idx) => {
                                const isCurrent = idx === activeIndex;
                                const dotColor = sec.color || 'var(--accent-primary)';
                                return (
                                    <button
                                        key={sec._id || idx}
                                        type="button"
                                        className={`mobile-carousel-dot ${isCurrent ? 'active' : ''}`}
                                        style={{
                                            backgroundColor: isCurrent ? dotColor : 'rgba(255, 255, 255, 0.25)',
                                            boxShadow: isCurrent ? `0 0 8px ${dotColor}` : 'none'
                                        }}
                                        onClick={() => scrollToSection(idx)}
                                        title={`Go to section ${idx + 1}: ${sec.label}`}
                                        aria-label={`Go to section ${idx + 1}`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="mobile-carousel-btn"
                        onClick={() => scrollToSection(activeIndex + 1)}
                        disabled={activeIndex === totalSections - 1}
                        title="Next section"
                        aria-label="Next section"
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            )}

            {/* Swipeable Reels Track Container */}
            <div 
                ref={trackRef}
                onScroll={handleScroll}
                className="mobile-timeline-track"
            >
                {children}
            </div>
        </div>
    );
}

export default MobileSongLayout;
