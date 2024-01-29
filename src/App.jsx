import { useEffect, useState } from "react";
import { getAllSpells } from "./api";
import "./app.css";
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import React from "react"

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

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)

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


Modal.setAppElement(document.getElementById('root'));

export default function App() {
  const [spells, setSpells] = useState([]);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }


  function closeModal() {
    setIsOpen(false);
  }

  function handleSpellClick(spell) {
    setSelectedSpell(spell);
    openModal();
  }
  let subtitle;

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }
  
  useEffect(() => {
    const savedSpells = localStorage.getItem("spells");
    if (savedSpells) setSpells(JSON.parse(savedSpells));
    getAllSpells().then((spells) => {
      setSpells(spells);
      localStorage.setItem("spells", JSON.stringify(spells));
    });
  }, []);

  return (
    <div className="App">
      <h1>API Challenge</h1>
      <ul className="spell-list">
        {spells.map((spell) => (
          <SpellCard key={spell.index} spell={spell} onSpellClick={handleSpellClick} />
        ))}
      </ul>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Spell Details Modal"
      >
        {selectedSpell && (
          <div>
            <h2>{selectedSpell.name}</h2>
            <p>Level {selectedSpell.level} {selectedSpell.school.name}.<br /> <br />
            {selectedSpell.desc} </p>
            
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}




ReactDOM.render(<App />, document.getElementById('root'));