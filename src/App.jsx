import React, { useState, useEffect, useRef } from 'react';
import bgPark from './assets/bg_park.png';
import boySprite from './assets/boy.png';
import girlSprite from './assets/girl.png';
import letterIcon from './assets/letter.png';

// Typewriter Component for the retro text effect
const TypewriterText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
        if (onComplete) onComplete();
      }
    }, 50); // Speed of typing
    
    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return <span>{displayedText}</span>;
};

const scenes = [
  {
    type: 'dialogue',
    bg: bgPark,
    characters: ['boy'], // Only boy on screen
    speaker: 'Christian',
    text: 'Hola baby...',
  },
  {
    type: 'dialogue',
    bg: bgPark,
    characters: ['boy', 'girl'], // Girl appears
    speaker: 'Christian',
    text: 'Qué bueno verte hoy (como siempre jejeje).',
  },
  {
    type: 'dialogue',
    bg: bgPark,
    characters: ['boy', 'girl'],
    speaker: 'Ferpe',
    text: '¡Hola! Yo también me alegro mucho de verte.',
  },
  {
    type: 'dialogue',
    bg: bgPark,
    characters: ['boy', 'girl'],
    speaker: 'Christian',
    text: 'Por cierto... Neo y Checo te extrañan mucho.',
  },
  {
    type: 'dialogue',
    bg: bgPark,
    characters: ['boy', 'girl'],
    speaker: 'Christian',
    text: 'Pero bueno, hoy es un día muy especial para nosotros.',
  },
  {
    type: 'dialogue',
    bg: bgPark,
    characters: ['boy', 'girl'],
    speaker: 'Christian',
    text: 'Así que quise prepararte este pequeño detalle retro...',
  },
  {
    type: 'dialogue',
    bg: bgPark,
    characters: ['boy', 'girl', 'letter'], // Letter icon appears floating
    speaker: 'Christian',
    text: 'Espero que te guste.',
  },
  {
    type: 'letter',
    text: `¡Feliz mes, baby! 🎉

Hoy cumplimos meses y no quería dejar pasar la oportunidad de decirte lo mucho que te amo.

Te agradezco por siempre pensar en nosotros, por pensar en familia y por crear un equipo tan increíble juntos.

Estoy tan orgulloso de ti, como siempre lo estoy. Eres mi persona favorita.

Te amo con todo mi corazón.

Con cariño,
Christian`
  },
  {
    type: 'dialogue',
    bg: bgPark,
    characters: ['boy', 'girl'],
    speaker: 'Ferpe',
    text: '¡Awww! ¡Me encantó! Yo también te amo muchísimo.',
  },
  {
    type: 'end',
    bg: bgPark,
    characters: ['boy', 'girl'],
    text: '¡Feliz Mes! 💖'
  }
];

function App() {
  const [started, setStarted] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [hearts, setHearts] = useState([]);
  const containerRef = useRef(null);

  const scene = scenes[currentScene];

  const handleStart = () => {
    setStarted(true);
    setIsTyping(true);
  };

  const handleNext = () => {
    if (!started) return;
    
    // If typing, skip to end of text
    if (isTyping) {
      setIsTyping(false);
      return;
    }

    // Go to next scene
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
      if (scenes[currentScene + 1].type === 'dialogue') {
        setIsTyping(true);
      }
    }
  };

  const spawnHearts = (e) => {
    if (scene.type === 'end') {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newHeart = { id: Date.now(), x, y };
      setHearts(prev => [...prev, newHeart]);
      
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, 3000);
    }
  };

  if (!started) {
    return (
      <div className="title-screen" onClick={handleStart}>
        <div className="title-text">
          Nuestra<br/>Historia<br/>8-Bits
        </div>
        <div className="start-btn">▶ Toca para iniciar</div>
      </div>
    );
  }

  return (
    <div 
      className="game-container" 
      style={{ backgroundImage: `url(${scene.bg})` }}
      onClick={(e) => { handleNext(); spawnHearts(e); }}
      ref={containerRef}
    >
      {/* Characters Layer */}
      {scene.characters && scene.characters.includes('boy') && (
        <div 
          className="character boy fade-in" 
          style={{ backgroundImage: `url(${boySprite})` }} 
        />
      )}
      
      {scene.characters && scene.characters.includes('girl') && (
        <div 
          className="character girl fade-in" 
          style={{ backgroundImage: `url(${girlSprite})` }} 
        />
      )}

      {scene.characters && scene.characters.includes('letter') && (
        <div 
          className="letter-item" 
          style={{ backgroundImage: `url(${letterIcon})` }} 
        />
      )}

      {/* Hearts (Ending Interaction) */}
      {hearts.map(h => (
        <div key={h.id} className="heart" style={{ left: h.x, top: h.y }}>
          ❤️
        </div>
      ))}

      {/* Letter Full Screen Layer */}
      {scene.type === 'letter' && (
        <div className="letter-full">
          <div className="letter-content" onClick={(e) => e.stopPropagation()}>
            {scene.text.split('\n').map((line, i) => (
              <p key={i} style={{ minHeight: '1.8em' }}>{line}</p>
            ))}
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button 
                onClick={handleNext}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: '10px', color: '#e11d48',
                  animation: 'blink 1s infinite'
                }}
              >
                ▶ Cerrar Carta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Screen Layer */}
      {scene.type === 'end' && (
        <div className="letter-full" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <h1 style={{ color: '#fff', fontSize: '18px', textAlign: 'center', lineHeight: '1.5' }}>
            {scene.text}<br/><br/>
            <span style={{ fontSize: '10px', color: '#aaa', animation: 'blink 1s infinite' }}>
              Toca la pantalla para corazones
            </span>
          </h1>
        </div>
      )}

      {/* Dialogue Box */}
      {scene.type === 'dialogue' && (
        <div className="dialog-box">
          <div className="dialog-name">{scene.speaker}</div>
          <div className="dialog-text">
            {isTyping ? (
              <TypewriterText 
                text={scene.text} 
                onComplete={() => setIsTyping(false)} 
              />
            ) : (
              <span>{scene.text}</span>
            )}
          </div>
          {!isTyping && (
            <div className="dialog-continue">▶ Continuar</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
