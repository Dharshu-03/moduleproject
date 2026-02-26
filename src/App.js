import React, { useState, useEffect } from "react";
import "./App.css";



function App() {

  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem("notesApp");
    return saved ? JSON.parse(saved) : [];
  });

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [selectedGroupId, setSelectedGroupId] = useState(() => {
    const savedSelected = localStorage.getItem("selectedGroupId");
    return savedSelected ? JSON.parse(savedSelected) : null;
  });
  const selectedGroup = groups.find(g => g.id === selectedGroupId);
  const hasNotes = selectedGroup && selectedGroup.notes.length > 0;
  const [noteText, setNoteText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const isTextEmpty = !noteText.trim();

  const [groupColor, setGroupColor] = useState("#B38BFA"); // default
  const colors = ["#B38BFA", "#FF79F2", "#43E6FC", "#F19576", "#0047FF", "#6691FF"];



  useEffect(() => {
    localStorage.setItem("notesApp", JSON.stringify(groups));
  }, [groups]);


  useEffect(() => {
    localStorage.setItem("selectedGroupId", JSON.stringify(selectedGroupId));
  }, [selectedGroupId]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const createGroup = () => {
    const trimmedName = groupName.trim();


    if (trimmedName.length < 3) {
      alert("Group name must be at least 3 characters long.");
      return;
    }

    const duplicate = groups.some(
      (group) =>
        group.title.trim().toLowerCase() ===
        trimmedName.toLowerCase()
    );

    if (duplicate) {
      alert("Group already exists!");
      return;
    }

    const newGroup = {
      id: Date.now(),
      title: trimmedName,
      color: groupColor,
      notes: []
    };

    setGroups([...groups, newGroup]);
    setSelectedGroupId(newGroup.id);
    setGroupName("");
    setGroupColor(colors[0]);
    setShowModal(false);
  };

  const addNote = () => {
    if (!noteText.trim() || selectedGroupId === null) return;

    const now = new Date();


    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).replace(" ", "");

    const newNote = {
      id: Date.now(),
      text: noteText,
      date: formattedDate,
      time: formattedTime,
    };

    const updatedGroups = groups.map((group) =>
      group.id === selectedGroupId
        ? { ...group, notes: [newNote, ...group.notes] }
        : group
    );

    setGroups(updatedGroups);
    setNoteText("");
  };


  const getInitials = (name) => {
    if (!name) return "";


    const words = name.trim().split(/\s+/);

    if (words.length === 1) {

      return words[0][0].toUpperCase();
    }


    return (words[0][0] + words[1][0]).toUpperCase();
  };


  return (
    <div className="container">

      {isMobileView ? (
        selectedGroupId === null ? (

          <div className="mobile-groups">
            <h1>Pocket Notes</h1>

            {groups.map((group) => (
              <div
                key={group.id}
                className={`group ${group.id === selectedGroupId ? "active" : ""}`}
                onClick={() => setSelectedGroupId(group.id)}
              >
                <div
                  className="group-avatar"
                  style={{ backgroundColor: group.color }}
                >
                  {getInitials(group.title)}
                </div>

                <span>{group.title}</span>
              </div>
            ))}
            <button
              className="add-btn"
              onClick={() => setShowModal(true)}
            >
              +
            </button>
          </div>
        ) : (

          <div className="mobile-notes">
            <div className="mobile-header">
              <button
                className="back-btn"
                onClick={() => setSelectedGroupId(null)}
              >
                ←
              </button>

              <div
                className="header-avatar"
                style={{ backgroundColor: selectedGroup.color }}
              >
                {getInitials(selectedGroup.title)}
              </div>

              <h3 className="header-title">
                {selectedGroup.title}
              </h3>
            </div>

            <div className="notes">
              {selectedGroup?.notes.map((note) => (
                <div key={note.id} className="note">
                  <div>{note.text}</div>
                  <small className="note-date">
                    {note.date} • {note.time}
                  </small>
                </div>
              ))}
            </div>
            <form
              className="input-section"
              onSubmit={(e) => {
                e.preventDefault();
                addNote();
              }}
            >
              <div className="input-cover">
                <textarea
                  type="text" id="inputmobile"
                  value={noteText}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      addNote();
                    }
                  }}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter your text here..........."
                />

                <button
                  type="submit"
                  disabled={isTextEmpty}
                  className={`send-button ${isTextEmpty ? "disabled" : ""}`}
                >
                  <img id="addbuttonmob"
                    src="/images/send.png"
                    alt="send"
                  />
                </button>
              </div>
            </form>
          </div>
        )
      ) : (

        <>
          <div className="sidebar">
            <p>Pocket Notes</p>

            <div className="groups-list">
              {groups.map(group => (
                <div
                  key={group.id}
                  className={`group ${group.id === selectedGroupId ? "active" : ""}`}
                  onClick={() => setSelectedGroupId(group.id)}
                >
                  <div
                    className="group-avatar"
                    style={{ backgroundColor: group.color }}
                  >
                    {getInitials(group.title)}
                  </div>

                  <span>{group.title}</span>
                </div>
              ))}
            </div>


            <button
              className="add-btn-sidebar"
              onClick={() => setShowModal(true)}
            >
              +
            </button>
          </div>

          <div className={`content ${hasNotes ? "no-bg" : ""}`}>
            {selectedGroup && (
              <div className="notes-header">
                <div
                  className="header-avatar"
                  style={{ backgroundColor: selectedGroup.color }}
                >
                  {getInitials(selectedGroup.title)}
                </div>

                <h3 className="header-title">
                  {selectedGroup.title}
                </h3>
              </div>
            )}
            {!hasNotes && (
              <div className="welcome-overlay">
                <h1>Pocket Notes</h1>
                <p>
                  Send and receive messages without keeping your phone online.
                  <br />
                  Use Pocket Notes on up to 4 linked devices and 1 mobile phone
                </p>

                <div className="lock-text">
                  <img src="/images/lock3.png" alt="" />
                  end-to-end encrypted
                </div>
              </div>
            )}
            <div className="notes">
              {selectedGroup?.notes.map((note) => (
                <div key={note.id} className="note">
                  <div>{note.text}</div>
                  <small className="note-date">
                    {note.date} • {note.time}
                  </small>
                </div>
              ))}
            </div>

            {selectedGroup && (
              <form
                className="input-section"
                onSubmit={(e) => {
                  e.preventDefault();
                  addNote();
                }}
              >
                <div className="input-cover">
                  <textarea
                    type="text"
                    id="ibar"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter your text here..........."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        addNote();
                      }
                    }}
                  />

                  <button
                    type="button"
                    disabled={isTextEmpty}
                    onClick={addNote}
                    className={`send-button ${isTextEmpty ? "disabled" : ""}`}
                  >
                    <img id="sendimg"
                      src="/images/send.png"
                      alt="send"
                    />
                  </button>

                </div>
              </form>
            )}
          </div>
        </>
      )
      }

      {
        showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Create New Group</h3>
              <br />
              <p>Group Name</p>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
              />
              <br />

              <div className="color-picker">
                <p >
                  Choose Color
                </p>
                {colors.map(color => (
                  <div
                    key={color}
                    className={`color-circle ${groupColor === color ? "selected" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setGroupColor(color)}
                  />
                ))}
              </div>

              <div className="modal-buttons">

                <button id="createbutton" onClick={createGroup}>Create</button>

              </div>
            </div>
          </div >
        )
      }
    </div >

  );
}



export default App;