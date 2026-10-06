import { useState } from "react";
import { useSongData } from "../contexts/SongDataContext.jsx";
import { useSong } from "../contexts/SongContext.jsx";
import {
  useUpdateSongTitle,
  useUpdateSetlistTitle,
  useUpdateSongBpm,
  useUpdateSongTimeSignature,
} from "../lib/constants.js";

const COMMON_TIME_SIGNATURES = ["4/4", "3/4", "6/8", "2/4", "12/8", "5/4"];

function SongTitle() {
  const { songData, setSongData, setlistData } = useSongData();
  const { currentSetlist, currentSong, setCurrentSong, prevSong, nextSong } =
    useSong();

  const handleSongTitleChange = useUpdateSongTitle();
  const handleSetlistTitleChange = useUpdateSetlistTitle();
  const { bpm, handleBpmChange } = useUpdateSongBpm();
  const { timeSignature, handleTimeSignatureChange } =
    useUpdateSongTimeSignature();

  const [isTimeSigOpen, setIsTimeSigOpen] = useState(false);
  const [customTimeSig, setCustomTimeSig] = useState("");

  const songs = currentSetlist?.songs || [];
  const currentIndex = currentSong
    ? songs.findIndex((s) => s._id === currentSong._id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < songs.length - 1;

  const handleCreateNewSong = () => {
    setCurrentSong(null);
    setSongData({
      title: "",
      bpm: 120,
      timeSignature: "4/4",
      sections: [],
    });
  };

  const handleBpmStep = (delta) => {
    const currentBpm = Number(bpm) || 120;
    handleBpmChange(currentBpm + delta);
  };

  const handleSelectTimeSig = (ts) => {
    handleTimeSignatureChange(ts);
    setIsTimeSigOpen(false);
  };

  const handleCustomTimeSigSubmit = (e) => {
    e.preventDefault();
    if (customTimeSig.trim()) {
      handleTimeSignatureChange(customTimeSig.trim());
      setCustomTimeSig("");
      setIsTimeSigOpen(false);
    }
  };

  return (
    <div
      className="session-transport-bar px-3 px-lg-4 py-2"
      style={{
        backgroundColor: "var(--bg-surface-elevated)",
        borderBottom: "1px solid var(--border-default)",
        minHeight: "52px",
      }}
    >
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100 session-transport-content">
        {/* LEFT & CENTER WRAPPER: SETLIST TITLE + DIVIDER + SONG TITLE */}
        <div
          className="d-flex align-items-center flex-wrap gap-2 flex-grow-1 session-transport-primary"
          style={{ minWidth: "0" }}
        >
          {/* 1. SETLIST TITLE PILL */}
          <div
            className="session-pill-box d-flex align-items-center px-3"
            title={
              currentSetlist
                ? `Active Setlist: ${currentSetlist.title}`
                : "Name your setlist to create one"
            }
            style={{
              height: "38px",
              backgroundColor: "var(--bg-input)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-full)",
              maxWidth: "300px",
              minWidth: "150px",
              flexShrink: 1,
            }}
          >
            <i
              className={`fa-solid ${currentSetlist ? "fa-list-check" : "fa-folder-plus"} me-2`}
              style={{
                color: currentSetlist
                  ? "var(--accent-primary)"
                  : "var(--text-muted)",
                fontSize: "13px",
              }}
            ></i>

            <span
              className="text-muted d-none d-sm-inline me-1"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              Setlist:
            </span>

            <input
              name={currentSetlist ? "currentSetlistTitle" : "setlistTitle"}
              type="text"
              className="session-pill-input flex-grow-1"
              placeholder="Setlist name..."
              onChange={handleSetlistTitleChange}
              value={setlistData.title}
              autoComplete="off"
              style={{
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: "13px",
                fontWeight: 500,
                minWidth: "70px",
                width: "100%",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            />

            {currentSetlist && (
              <span
                className="badge bg-dark bg-opacity-50 text-secondary ms-1 d-none d-md-inline"
                style={{ fontSize: "10px", padding: "3px 6px" }}
              >
                {songs.length}
              </span>
            )}
          </div>

          {/* HIERARCHICAL BREADCRUMB SEPARATOR */}
          <span
            className="text-muted d-none d-sm-inline-flex align-items-center justify-content-center"
            style={{ fontSize: "14px", opacity: 0.5, userSelect: "none" }}
          >
            /
          </span>

          {/* 2. SONG TRANSPORT & TITLE STRIP */}
          <div
            className="session-song-strip d-flex align-items-center flex-grow-1"
            style={{
              minWidth: "220px",
              maxWidth: "440px",
              height: "38px",
              backgroundColor: "var(--bg-input)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-full)",
              overflow: "hidden",
            }}
          >
            {/* Stepper Prev */}
            <button
              type="button"
              className="btn btn-sm text-light p-0 d-flex align-items-center justify-content-center session-song-stepper-btn session-song-prev-btn"
              style={{
                width: "32px",
                height: "100%",
                backgroundColor: "transparent",
                border: "none",
                borderRight: "1px solid var(--border-default)",
                borderRadius: "0",
                boxShadow: "none",
                opacity: hasPrev ? 1 : 0.35,
                cursor: hasPrev ? "pointer" : "not-allowed",
                color: "var(--text-secondary)",
              }}
              onClick={() => prevSong(currentSong)}
              disabled={!hasPrev}
              title="Previous Song in Setlist"
            >
              <i
                className="fa-solid fa-backward-step"
                style={{ fontSize: "11px" }}
              ></i>
            </button>

            {/* Song Title Pill Input */}
            <div
              className="d-flex align-items-center px-2 flex-grow-1 session-song-box"
              style={{
                height: "100%",
                backgroundColor: "transparent",
                border: "none",
                minWidth: "120px",
              }}
            >
              <i
                className="fa-solid fa-music mx-1"
                style={{
                  color: currentSong
                    ? "var(--color-info)"
                    : "var(--text-muted)",
                  fontSize: "12px",
                }}
              ></i>

              <input
                name={currentSong ? "currentSongTitle" : "songTitle"}
                type="text"
                className="w-100 text-center fw-semibold session-song-input"
                placeholder={
                  currentSetlist
                    ? "Enter song title..."
                    : "Setlist needed first"
                }
                onChange={handleSongTitleChange}
                value={songData.title}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  cursor: currentSetlist ? "text" : "not-allowed",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
                autoComplete="off"
                disabled={!currentSetlist}
              />

              {currentSetlist && (
                <span
                  className="text-muted d-none d-lg-inline me-1"
                  style={{
                    fontSize: "11px",
                    fontFamily: "'JetBrains Mono', monospace",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentIndex >= 0
                    ? `${currentIndex + 1}/${songs.length}`
                    : ""}
                </span>
              )}
            </div>

            {/* Stepper Next */}
            <button
              type="button"
              className="btn btn-sm text-light p-0 d-flex align-items-center justify-content-center session-song-stepper-btn session-song-next-btn"
              style={{
                width: "32px",
                height: "100%",
                backgroundColor: "transparent",
                border: "none",
                borderLeft: "1px solid var(--border-default)",
                borderRadius: "0",
                boxShadow: "none",
                opacity: hasNext ? 1 : 0.35,
                cursor: hasNext ? "pointer" : "not-allowed",
                color: "var(--text-secondary)",
              }}
              onClick={() => nextSong(currentSong)}
              disabled={!hasNext}
              title="Next Song in Setlist"
            >
              <i
                className="fa-solid fa-forward-step"
                style={{ fontSize: "11px" }}
              ></i>
            </button>
          </div>
        </div>

        {/* RIGHT CONTROLS: BPM + TIME SIGNATURE + "+ NEW SONG" */}
        <div className="d-flex align-items-center gap-2 flex-wrap ms-auto session-transport-secondary">
          {/* 3. BPM METRONOME WIDGET */}
          <div
            className="d-flex align-items-center px-2"
            title="Song Tempo (Beats Per Minute)"
            style={{
              height: "38px",
              backgroundColor: "var(--bg-input)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <i
              className="fa-solid fa-gauge-high me-1"
              style={{ color: "var(--accent-hover)", fontSize: "12px" }}
            ></i>

            <button
              type="button"
              className="btn btn-link p-0 text-muted"
              onClick={() => handleBpmStep(-1)}
              disabled={!currentSong || Number(bpm) <= 20}
              style={{
                textDecoration: "none",
                fontSize: "11px",
                lineHeight: 1,
              }}
              title="Decrease BPM"
            >
              <i className="fa-solid fa-minus"></i>
            </button>

            <div className="d-flex align-items-center mx-1">
              <input
                type="number"
                min="20"
                max="320"
                className="text-center fw-bold"
                value={bpm}
                onChange={(e) => handleBpmChange(e.target.value)}
                disabled={!currentSong}
                style={{
                  width: "42px",
                  border: "none",
                  backgroundColor: "transparent",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontFamily: "'JetBrains Mono', monospace",
                  padding: "0",
                }}
              />
              <span
                className="text-muted"
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                BPM
              </span>
            </div>

            <button
              type="button"
              className="btn btn-link p-0 text-muted"
              onClick={() => handleBpmStep(1)}
              disabled={!currentSong || Number(bpm) >= 320}
              style={{
                textDecoration: "none",
                fontSize: "11px",
                lineHeight: 1,
              }}
              title="Increase BPM"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>

          {/* 4. TIME SIGNATURE SELECTOR */}
          <div className="position-relative">
            <button
              type="button"
              className="btn btn-sm d-flex align-items-center gap-1"
              onClick={() => currentSong && setIsTimeSigOpen(!isTimeSigOpen)}
              disabled={!currentSong}
              title="Song Time Signature"
              style={{
                height: "38px",
                backgroundColor: "var(--bg-input)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                padding: "0 10px",
                fontSize: "12px",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
              }}
            >
              <span style={{ color: "var(--color-info)" }}>
                {timeSignature || "4/4"}
              </span>
              <i
                className="fa-solid fa-chevron-down text-muted ms-1"
                style={{ fontSize: "9px" }}
              ></i>
            </button>

            {/* Dropdown Popover */}
            {isTimeSigOpen && (
              <div
                className="position-absolute end-0 mt-1 p-2 rounded shadow-lg"
                style={{
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--radius-md)",
                  zIndex: 1050,
                  minWidth: "150px",
                }}
              >
                <div
                  className="text-muted mb-1 px-1"
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Time Signature
                </div>
                <div
                  className="d-grid gap-1 mb-2"
                  style={{ gridTemplateColumns: "1fr 1fr" }}
                >
                  {COMMON_TIME_SIGNATURES.map((sig) => (
                    <button
                      key={sig}
                      type="button"
                      className={`btn btn-sm py-1 ${timeSignature === sig ? "btn-primary" : "btn-dark"}`}
                      onClick={() => handleSelectTimeSig(sig)}
                      style={{
                        fontSize: "12px",
                        fontFamily: "'JetBrains Mono', monospace",
                        border:
                          timeSignature === sig
                            ? "none"
                            : "1px solid var(--border-default)",
                      }}
                    >
                      {sig}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={handleCustomTimeSigSubmit}
                  className="d-flex gap-1 pt-1 border-top border-secondary border-opacity-25"
                >
                  <input
                    type="text"
                    placeholder="Other..."
                    className="form-control form-control-sm"
                    value={customTimeSig}
                    onChange={(e) => setCustomTimeSig(e.target.value)}
                    style={{
                      fontSize: "11px",
                      backgroundColor: "var(--bg-input)",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-default)",
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-sm btn-outline-primary py-0 px-2"
                    style={{ fontSize: "11px" }}
                  >
                    Set
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* 5. "+ NEW SONG" BUTTON */}
          {currentSetlist && (
            <button
              type="button"
              className="btn btn-sm d-flex align-items-center gap-1 new-song-btn"
              style={{
                height: "38px",
                backgroundColor: "var(--accent-light)",
                border: "1px solid rgba(124, 77, 255, 0.4)",
                color: "var(--text-primary)",
                borderRadius: "var(--radius-md)",
                fontSize: "12px",
                fontWeight: 500,
                padding: "0 12px",
                whiteSpace: "nowrap",
              }}
              onClick={handleCreateNewSong}
              title="Add a new song to this setlist"
            >
              <i className="fa-solid fa-plus text-primary"></i>
              <span className="d-none d-sm-inline">New Song</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SongTitle;
