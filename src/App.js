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

  const [noteText, setNoteText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");


  const [groupColor, setGroupColor] = useState("#ff4d4d"); // default
  const colors = ["#ff4d4d", "#4da6ff", "#4dff88", "#ffb84d", "#b84dff"];



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

    const updatedGroups = groups.map(group =>
      group.id === selectedGroupId
        ? { ...group, notes: [noteText, ...group.notes] } // <-- prepend note
        : group
    );

    setGroups(updatedGroups);
    setNoteText("");
  };
  const getInitials = (name) => {
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };
  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  return (
    <div className="container">

      {isMobileView ? (
        selectedGroupId === null ? (

          <div className="mobile-groups">


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
                onClick={() =>
                  setSelectedGroupId(null)
                }
              >
                ←
              </button>
              <h3>{selectedGroup?.title}</h3>
            </div>

            <div className="notes">
              {selectedGroup?.notes.map(
                (note, index) => (
                  <div
                    key={index}
                    className="note"
                  >
                    {note}
                  </div>
                )
              )}
            </div>

            <div className="input-section">
              <input
                type="text" id="inputmobile"
                value={noteText}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addNote();
                  }
                }}
                onChange={e =>
                  setNoteText(e.target.value)
                }
                placeholder="Enter note..."
              />
              <button id="addbuttonmob" onClick={addNote}>
                Add
              </button>
            </div>
          </div>
        )
      ) : (

        <>
          <div className="sidebar">
            <h3>Pocket Notes</h3>

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

          <div className="content">
            <h2>{selectedGroup ? selectedGroup.title : "No Group Selected"}</h2>

            <div className="notes">
              {selectedGroup &&
                selectedGroup.notes.map((note, index) => (
                  <div key={index} className="note">
                    {note}
                  </div>
                ))}
            </div>

            {selectedGroup && (
              <div className="input-section">
                <input
                  type="text"
                  id="ibar"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter note..."
                />
                <button id="addbutton" onClick={addNote}>
                  Add
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Group</h3>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />

            <div className="color-picker">
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