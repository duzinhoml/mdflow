import { useState, useRef, useEffect } from "react";
import { useToggleVisible } from "../../contexts/ToggleVisibleContext.jsx";

import SearchBar from "./SearchBar.jsx";
import List from "./List.jsx";
import './index.css';

function Sidebar() {
    const { visible, toggleVisible, setVisible } = useToggleVisible();
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const touchStartRef = useRef(null);
    const touchStartTimeRef = useRef(null);

    // Reset swipe offset when sidebar closes
    useEffect(() => {
        if (!visible.sidebar) {
            setSwipeOffset(0);
            setIsSwiping(false);
        }
    }, [visible.sidebar]);

    // Touch swipe-to-close gestures (swipe rightward towards edge)
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        touchStartRef.current = touch.clientX;
        touchStartTimeRef.current = Date.now();
    };

    const handleTouchMove = (e) => {
        if (touchStartRef.current === null) return;
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartRef.current;

        // Swiping rightward towards closing edge
        if (deltaX > 5) {
            setIsSwiping(true);
            setSwipeOffset(deltaX);
        }
    };

    const handleTouchEnd = () => {
        if (touchStartRef.current === null) return;
        const deltaX = swipeOffset;
        const timeElapsed = Date.now() - (touchStartTimeRef.current || Date.now());
        const velocity = deltaX / Math.max(1, timeElapsed);

        // Threshold check: > 60px or flick velocity > 0.35
        if (deltaX > 60 || velocity > 0.35) {
            setSwipeOffset(380);
            setTimeout(() => {
                setVisible(prev => ({ ...prev, sidebar: false }));
                setSwipeOffset(0);
                setIsSwiping(false);
            }, 180);
        } else {
            setSwipeOffset(0);
            setIsSwiping(false);
        }

        touchStartRef.current = null;
        touchStartTimeRef.current = null;
    };

    // Calculate dynamic transform based on swipe
    const getSidebarStyle = () => {
        const baseStyle = { height: '100%', zIndex: 100 };
        if (isSwiping && swipeOffset > 0) {
            return {
                ...baseStyle,
                transform: `translateX(${swipeOffset}px)`,
                transition: 'none'
            };
        }
        if (swipeOffset > 0) {
            return {
                ...baseStyle,
                transform: `translateX(${swipeOffset}px)`,
                transition: 'transform 0.2s cubic-bezier(0.18, 0.67, 0.6, 1.22)'
            };
        }
        return baseStyle;
    };

    return (
        <>
            {/* Mobile/Tablet Backdrop Overlay */}
            {visible.sidebar && (
                <div 
                    className="sidebar-backdrop"
                    onClick={() => toggleVisible('sidebar')}
                    title="Tap to close library"
                />
            )}

            <div 
                className={`position-absolute end-0 top-0 d-flex flex-column overflow-hidden sidebar ${visible.sidebar ? 'show' : 'hide'}`}
                style={getSidebarStyle()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                {/* Header with Title and Close Button */}
                <div className="sidebar-header">
                    <div className="sidebar-title">
                        <i className="fa-solid fa-folder-open text-primary"></i>
                        <span>Library Browser</span>
                    </div>
                    <button 
                        type="button"
                        className="btn btn-sm text-muted p-1"
                        style={{ minWidth: '36px', minHeight: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'manipulation' }}
                        onClick={() => toggleVisible('sidebar')}
                        title="Close sidebar"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Quick Search */}
                <SearchBar />

                {/* Tabbed List (Setlists / Songs) */}
                <List />
            </div>
        </>
    );
};

export default Sidebar;