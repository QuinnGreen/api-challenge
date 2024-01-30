// Importing necessary React and external modules
import React, { useEffect, useState } from "react";
import { getAllSpells } from "./api";
import "./app.css";
import Modal from 'react-modal';
import ReactDOM from 'react-dom';

// Styling for the modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Component representing a single spell card
export function SpellCard({ spell, onSpellClick }) {
  return (
    <li className="spell-card" onClick={() => onSpellClick(spell)}>
      <hgroup>
        <h4>{spell.name}</h4>
        <small>
          {spell.level > 0 && `Level ${spell.level} `}
          {spell.school.name}
          {spell.level === 0 && " cantrip"}
        </small>
      </hgroup>
      <div className="stats">
        <p>
          <strong>Casting Time</strong>
          {spell.casting_time}
        </p>
        <p>
          <strong>Range</strong>
          {spell.range}
        </p>
        <p>
          <strong>Components</strong>
          {spell.components.join(", ")}
        </p>
        <p>
          <strong>Duration</strong>
          {spell.duration}
        </p>
      </div>
    </li>
  );
}

// Set the root element for the modal
Modal.setAppElement(document.getElementById('root'));

// Main App component
export default function App() {
  // State for storing spells, selected spell, and modal state
  const [spells, setSpells] = useState([]);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [modalIsOpen, setIsOpen] = React.useState(false);

  // Function to open the modal
  function openModal() {
    setIsOpen(true);
  }

  // Function to close the modal
  function closeModal() {
    setIsOpen(false);
  }

  // Function to handle the click on a spell card
  function handleSpellClick(spell) {
    setSelectedSpell(spell);
    openModal();
  }

  // Function to apply styles after the modal has opened
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }
  
  // Effect hook to fetch spells on component mount
  useEffect(() => {
    // Retrieve saved spells from local storage
    const savedSpells = localStorage.getItem("spells");
    if (savedSpells) setSpells(JSON.parse(savedSpells));
    
    // Fetch all spells and update state
    getAllSpells().then((spells) => {
      setSpells(spells);
      // Save fetched spells to local storage
      localStorage.setItem("spells", JSON.stringify(spells));
    });
  }, []); // Empty dependency array ensures that this effect runs only once on component mount

  // Render the main structure of the application
  return (
    <div className="App">
      <h1>API Challenge</h1>
      {/* Render a list of spell cards */}
      <ul className="spell-list">
        {spells.map((spell) => (
          <SpellCard key={spell.index} spell={spell} onSpellClick={handleSpellClick} />
        ))}
      </ul>
      
      {/* Modal component for displaying spell details */}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Spell Details Modal"
      >
        {/* Render details of the selected spell */}
        {selectedSpell && (
          <div>
            <h2>{selectedSpell.name}</h2>
            <p>Level {selectedSpell.level} {selectedSpell.school.name}.<br /> <br />
            {selectedSpell.desc} </p>
            
            {/* Button to close the modal */}
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Render the main App component into the root element
ReactDOM.render(<App />, document.getElementById('root'));