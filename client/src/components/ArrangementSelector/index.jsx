import { useState, useRef, useEffect } from "react";
import { useToggleVisible } from '../../contexts/ToggleVisibleContext.jsx';
import { useSong } from '../../contexts/SongContext.jsx';
import { usePaletteDrag } from '../../contexts/PaletteDragContext.jsx';
import { INPUT_POOL } from '../../lib/constants.js';

import Tabs from "./Tabs.jsx";
import CurrentTab from "./CurrentTab.jsx";
import './index.css';

// Helper to reliably detect touch devices (phones, tablets, iPads) or tablet/mobile viewports
function isTabletOrMobileDevice() {
    if (typeof window === 'undefined') return false;
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isSmallOrTabletWidth = window.innerWidth <= 1180;
    return isTouch || isSmallOrTabletWidth;
}

function ArrangementSelector() {
    const [currentTab, setCurrentTab] = useState(INPUT_POOL[0]);
    const { visible, toggleVisible, setVisible } = useToggleVisible();
    const { currentSong, currentSection, setCurrentSection } = useSong();
    const { isDraggingPalette, setIsSwipingPalette } = usePaletteDrag();

    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const selectorRef = useRef(null);
    const panelHeightRef = useRef(320);
    const startYRef = useRef(null);
    const activePointerIdRef = useRef(null);
    const startTimeRef = useRef(null);
    const dismissTimerRef = useRef(null);

    const isCreateTab = currentTab?.id === 4;

    // Track real rendered height of the palette panel
    useEffect(() => {
        if (selectorRef.current && selectorRef.current.offsetHeight > 0) {
            panelHeightRef.current = selectorRef.current.offsetHeight;
        }
    });

    // Cleanup dismiss timer on unmount
    useEffect(() => {
        return () => {
            if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        };
    }, []);

    // Auto-close and prevent opening palette when no active song is selected
    useEffect(() => {
        if (!currentSong && visible.selector) {
            setVisible(prev => ({ ...prev, selector: false }));
        }
    }, [currentSong, visible.selector, setVisible]);

    // Reset swipe offset when visibility changes
    useEffect(() => {
        if (!visible.selector) {
            if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
            setSwipeOffset(0);
            setIsSwiping(false);
            setIsSwipingPalette(false);
        }
    }, [visible.selector, setIsSwipingPalette]);

    // Do not render the Arrangement Palette unless a song is active
    if (!currentSong) return null;

    // Unified drag start handler
    const handleDragStart = (clientY, pointerId = null, target = null) => {
        if (isDraggingPalette) return;
        if (!isTabletOrMobileDevice()) return;

        startYRef.current = clientY;
        startTimeRef.current = Date.now();
        if (pointerId !== null) {
            activePointerIdRef.current = pointerId;
            if (target && target.setPointerCapture) {
                try {
                    target.setPointerCapture(pointerId);
                } catch (_) {}
            }
        }
    };

    // Unified drag move handler
    const handleDragMove = (clientY, e = null) => {
        if (isDraggingPalette || startYRef.current === null) return;
        if (!isTabletOrMobileDevice()) return;

        const deltaY = clientY - startYRef.current;
        if (deltaY > 4) {
            if (e && e.cancelable) {
                e.preventDefault();
            }
            setIsSwiping(true);
            setIsSwipingPalette(true);
            setSwipeOffset(deltaY);
        } else if (isSwiping && deltaY <= 0) {
            setSwipeOffset(0);
        }
    };

    // Unified drag end handler
    const handleDragEnd = (target = null) => {
        if (startYRef.current === null) return;

        if (activePointerIdRef.current !== null && target && target.releasePointerCapture) {
            try {
                target.releasePointerCapture(activePointerIdRef.current);
            } catch (_) {}
        }

        const deltaY = swipeOffset;
        const timeElapsed = Date.now() - (startTimeRef.current || Date.now());
        const velocity = deltaY / Math.max(1, timeElapsed);

        // Threshold check: > 75px or flick velocity > 0.4
        if (deltaY > 75 || velocity > 0.4) {
            // Dismiss panel synchronously with section expansion
            const panelHeight = selectorRef.current?.offsetHeight || panelHeightRef.current || 320;
            setIsSwiping(false);
            setSwipeOffset(panelHeight);
            dismissTimerRef.current = setTimeout(() => {
                setVisible(prev => ({ ...prev, selector: false }));
                setSwipeOffset(0);
                setIsSwiping(false);
                setIsSwipingPalette(false);
            }, 220);
        } else {
            // Spring back to open
            setIsSwiping(false);
            setSwipeOffset(0);
            setIsSwipingPalette(false);
        }

        startYRef.current = null;
        activePointerIdRef.current = null;
        startTimeRef.current = null;
    };

    // Pointer Events (supports mouse drag, Apple Pencil, and touch with pointer capture)
    const onPointerDown = (e) => {
        if (e.target.closest('button, a, input, select')) return;
        handleDragStart(e.clientY, e.pointerId, e.currentTarget);
    };

    const onPointerMove = (e) => {
        if (activePointerIdRef.current === e.pointerId) {
            handleDragMove(e.clientY, e);
        }
    };

    const onPointerUp = (e) => {
        if (activePointerIdRef.current === e.pointerId) {
            handleDragEnd(e.currentTarget);
        }
    };

    const onPointerCancel = (e) => {
        if (activePointerIdRef.current === e.pointerId) {
            handleDragEnd(e.currentTarget);
        }
    };

    // Native Touch Events fallback
    const onTouchStart = (e) => {
        if (e.target.closest('button, a, input, select')) return;
        const touch = e.touches[0];
        handleDragStart(touch.clientY, null, null);
    };

    const onTouchMove = (e) => {
        if (startYRef.current === null) return;
        const touch = e.touches[0];
        handleDragMove(touch.clientY, e);
    };

    const onTouchEnd = () => {
        handleDragEnd(null);
    };

    const handleDismiss = () => {
        if (isTabletOrMobileDevice()) {
            const panelHeight = selectorRef.current?.offsetHeight || panelHeightRef.current || 320;
            setIsSwiping(false);
            setSwipeOffset(panelHeight);
            dismissTimerRef.current = setTimeout(() => {
                setVisible(prev => ({ ...prev, selector: false }));
                setSwipeOffset(0);
                setIsSwiping(false);
                setIsSwipingPalette(false);
            }, 220);
        } else {
            toggleVisible('selector');
        }
    };

    // Calculate dynamic layout style based on swipe gesture (Mobile & Tablet, Desktop untouched)
    const getSelectorStyle = () => {
        if (!isTabletOrMobileDevice()) return undefined;
        if (!visible.selector || isDraggingPalette) return undefined;

        const panelHeight = selectorRef.current?.offsetHeight || panelHeightRef.current || 320;

        if (isSwiping && swipeOffset > 0) {
            const marginOffset = Math.min(swipeOffset, panelHeight);
            const extraTranslate = Math.max(0, swipeOffset - panelHeight);
            return {
                marginBottom: `-${marginOffset}px`,
                transform: extraTranslate > 0 ? `translateY(${extraTranslate}px)` : undefined,
                transition: 'none'
            };
        }

        if (swipeOffset > 0) {
            const marginOffset = Math.min(swipeOffset, panelHeight);
            const extraTranslate = Math.max(0, swipeOffset - panelHeight);
            return {
                marginBottom: `-${marginOffset}px`,
                transform: extraTranslate > 0 ? `translateY(${extraTranslate}px)` : undefined,
                transition: 'margin-bottom 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)'
            };
        }

        return undefined;
    };

    return (
        <div 
            ref={selectorRef}
            className={`selector ${visible.selector ? 'show' : 'hide'} ${isCreateTab ? 'is-create-tab' : ''} ${isDraggingPalette ? 'is-dragging-item' : ''}`}
            style={getSelectorStyle()}
        >
            {/* Visual Touch Swipe Handle Indicator (Tablets & Mobile) */}
            <div 
                className="palette-swipe-indicator-bar d-flex justify-content-center py-1"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchEnd}
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
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchEnd}
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
                        onClick={handleDismiss}
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