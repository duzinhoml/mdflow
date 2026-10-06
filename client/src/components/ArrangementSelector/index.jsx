import { useState, useRef, useEffect } from "react";
import { useToggleVisible } from '../../contexts/ToggleVisibleContext.jsx';
import { useSong } from '../../contexts/SongContext.jsx';
import { usePaletteDrag } from '../../contexts/PaletteDragContext.jsx';
import { INPUT_POOL } from '../../lib/constants.js';

import Tabs from "./Tabs.jsx";
import CurrentTab from "./CurrentTab.jsx";
import './index.css';

function ArrangementSelector() {
    const [currentTab, setCurrentTab] = useState(INPUT_POOL[0]);
    const { visible, toggleVisible, setVisible } = useToggleVisible();
    const { currentSong, currentSection, setCurrentSection } = useSong();
    const { isDraggingPalette, setIsSwipingPalette } = usePaletteDrag();

    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const touchStartRef = useRef(null);
    const touchStartTimeRef = useRef(null);

    const isCreateTab = currentTab?.id === 4;

    // Auto-close and prevent opening palette when no active song is selected
    useEffect(() => {
        if (!currentSong && visible.selector) {
            setVisible(prev => ({ ...prev, selector: false }));
        }
    }, [currentSong, visible.selector, setVisible]);

    // Reset swipe offset when visibility changes
    useEffect(() => {
        if (!visible.selector) {
            setSwipeOffset(0);
            setIsSwiping(false);
            setIsSwipingPalette(false);
        }
    }, [visible.selector, setIsSwipingPalette]);

    // Do not render the Arrangement Palette unless a song is active
    if (!currentSong) return null;

    // Touch Swipe-to-Close Gestures for Tablet and Mobile
    const handleTouchStart = (e) => {
        if (isDraggingPalette) return;
        const touch = e.touches[0];
        touchStartRef.current = touch.clientY;
        touchStartTimeRef.current = Date.now();
    };

    const handleTouchMove = (e) => {
        if (isDraggingPalette || touchStartRef.current === null) return;
        const touch = e.touches[0];
        const deltaY = touch.clientY - touchStartRef.current;

        // Downward swipe intent
        if (deltaY > 5) {
            setIsSwiping(true);
            setIsSwipingPalette(true);
            setSwipeOffset(deltaY);
        }
    };

    const handleTouchEnd = () => {
        if (touchStartRef.current === null) return;
        const deltaY = swipeOffset;
        const timeElapsed = Date.now() - (touchStartTimeRef.current || Date.now());
        const velocity = deltaY / Math.max(1, timeElapsed);

        // Threshold check: > 75px or flick velocity > 0.4
        if (deltaY > 75 || velocity > 0.4) {
            // Dismiss panel
            setSwipeOffset(400);
            setTimeout(() => {
                setVisible(prev => ({ ...prev, selector: false }));
                setSwipeOffset(0);
                setIsSwiping(false);
                setIsSwipingPalette(false);
            }, 180);
        } else {
            // Spring back to open
            setSwipeOffset(0);
            setIsSwiping(false);
            setIsSwipingPalette(false);
        }

        touchStartRef.current = null;
        touchStartTimeRef.current = null;
    };

    // Calculate dynamic transform based on swipe gesture
    const getSelectorStyle = () => {
        if (isSwiping && swipeOffset > 0) {
            return {
                transform: `translateY(${swipeOffset}px)`,
                transition: 'none'
            };
        }
        if (swipeOffset > 0) {
            return {
                transform: `translateY(${swipeOffset}px)`,
                transition: 'transform 0.2s cubic-bezier(0.18, 0.67, 0.6, 1.22)'
            };
        }
        return undefined;
    };

    return (
        <div 
            className={`selector ${visible.selector ? 'show' : 'hide'} ${isCreateTab ? 'is-create-tab' : ''} ${isDraggingPalette ? 'is-dragging-item' : ''}`}
            style={getSelectorStyle()}
        >
            {/* Visual Touch Swipe Handle Indicator (Tablets & Mobile) */}
            <div 
                className="palette-swipe-indicator-bar d-flex justify-content-center py-1 d-lg-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                style={{ cursor: 'grab', touchAction: 'none' }}
                title="Swipe down to close"
            >
                <span 
                    className="rounded-pill"
                    style={{ 
                        width: '36px', 
                        height: '4px', 
                        backgroundColor: 'var(--text-muted)', 
                        opacity: 0.5 
                    }}
                ></span>
            </div>

            {/* Target Section Banner & Quick Close */}
            <div 
                className={`palette-target-banner ${currentSection ? 'active' : 'idle'}`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                <div className="d-flex align-items-center gap-2 text-truncate">
                    {currentSection ? (
                        <>
                            <i className="fa-solid fa-sliders text-primary"></i>
                            <span>Target Section:</span>
                            <span 
                                className="target-badge"
                                style={{ backgroundColor: currentSection.color || '#7c4dff' }}
                            >
                                {currentSection.label}
                            </span>
                            <span className="text-secondary d-none d-md-inline" style={{ fontSize: '12px' }}>
                                — Click or drag any dynamic or instrument below to attach
                            </span>
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-circle-info text-muted"></i>
                            <span>Arrangement Palette:</span>
                            <span className="text-muted d-none d-sm-inline" style={{ fontSize: '12px' }}>
                                Click or drag a section to song, or click a card above to add details
                            </span>
                        </>
                    )}
                </div>

                <div className="d-flex align-items-center gap-2">
                    {currentSection && (
                        <button 
                            type="button"
                            className="btn btn-sm text-secondary p-0 px-2"
                            style={{ fontSize: '12px', minHeight: '32px', touchAction: 'manipulation' }}
                            onClick={() => setCurrentSection(null)}
                            title="Deselect section"
                        >
                            <i className="fa-solid fa-xmark me-1"></i> Deselect
                        </button>
                    )}

                    <button 
                        type="button"
                        className="btn btn-sm text-muted p-1"
                        style={{ minWidth: '36px', minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'manipulation' }}
                        onClick={() => toggleVisible('selector')}
                        title="Close arrangement palette"
                    >
                        <i className="fa-solid fa-chevron-down"></i>
                    </button>
                </div>
            </div>

            {/* Segmented Category Tabs */}
            <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />

            {/* Active Category Content */}
            <CurrentTab currentTab={currentTab} />
        </div>
    );
};

export default ArrangementSelector;