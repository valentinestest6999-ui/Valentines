import { useState, useEffect, useRef } from 'react';

export default function App() {
  // State to track if "Yes" was clicked
  const [accepted, setAccepted] = useState(false);
  
  // State to track the "No" button position
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [isNoButtonPositioned, setIsNoButtonPositioned] = useState(false);
  const [noButtonRotation, setNoButtonRotation] = useState(0);
  const [hasNoButtonMoved, setHasNoButtonMoved] = useState(false);
  
  // Ref for the "No" button to track its position
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const runAwayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handle "Yes" button click
   * Clears the proposal and shows celebration
   */
  const handleYesClick = () => {
    setAccepted(true);
  };

  /**
   * Handle mouse movement near the "No" button
   * Makes the button run away from the cursor
   */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (accepted || !noButtonRef.current) return;

    const button = noButtonRef.current;
    const rect = button.getBoundingClientRect();
    
    // Calculate distance from cursor to button center
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    const distanceX = e.clientX - buttonCenterX;
    const distanceY = e.clientY - buttonCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Increased threshold for earlier detection - makes it more playful
    const threshold = 200;
    if (distance < threshold) {
      // Clear any existing timeout to prevent jerky movements
      if (runAwayTimeoutRef.current) {
        clearTimeout(runAwayTimeoutRef.current);
      }

      // Calculate direction away from cursor (normalized)
      const angle = Math.atan2(buttonCenterY - e.clientY, buttonCenterX - e.clientX);
      
      // Move button away from cursor in the opposite direction
      const escapeDistance = 250; // How far the button moves away
      let newX = buttonCenterX + Math.cos(angle) * escapeDistance;
      let newY = buttonCenterY + Math.sin(angle) * escapeDistance;
      
      // Add slight random variation for unpredictability (smaller than before)
      newX += (Math.random() - 0.5) * 50;
      newY += (Math.random() - 0.5) * 50;
      
      // Keep button within viewport with generous padding from edges
      const padding = 100; // Minimum distance from edge
      const maxX = window.innerWidth - padding - rect.width;
      const maxY = window.innerHeight - padding - rect.height;
      
      newX = Math.max(padding, Math.min(maxX, newX));
      newY = Math.max(padding, Math.min(maxY, newY));
      
      // Add random rotation for extra playfulness
      const randomRotation = (Math.random() - 0.5) * 30;
      
      setNoButtonPosition({ x: newX, y: newY });
      setNoButtonRotation(randomRotation);
      setIsNoButtonPositioned(true);
      setHasNoButtonMoved(true);
    }
  };

  /**
   * Prevent "No" button from being clicked
   */
  const handleNoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Button runs away before this can happen, but just in case
    return false;
  };

  // If "Yes" was clicked, show celebration screen
  if (accepted) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffe0e9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem'
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#ff1744',
            textAlign: 'center',
            animation: 'heartbeat 1.5s infinite',
            textShadow: '0 0 20px rgba(255, 23, 68, 0.5)'
          }}>
            Yay! 💕
          </h1>
          
          <img 
            src="https://images.unsplash.com/photo-1706514930206-f7aafb8951c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFydHMlMjBjZWxlYnJhdGlvbiUyMHJvbWFudGljJTIwY29uZmV0dGl8ZW58MXx8fHwxNzcwMDA1Mjc3fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Celebration"
            style={{
              maxWidth: '80%',
              maxHeight: '60vh',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(255, 23, 68, 0.3)',
              animation: 'fadeIn 1s ease-in'
            }}
          />
          
          <p style={{
            fontSize: '2rem',
            color: '#ff1744',
            textAlign: 'center',
            fontWeight: '600',
            animation: 'fadeIn 1.5s ease-in'
          }}>
            Best Valentine's Day Ever! 💝
          </p>
        </div>

        <style>{`
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(1); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // Main proposal screen
  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #ffeef8 0%, #ffe0e9 50%, #ffd4e5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        overflow: 'hidden'
      }}
    >
      {/* Floating hearts background animation */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 20}px`,
              opacity: 0.1,
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Main content container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        zIndex: 1,
        textAlign: 'center',
        padding: '2rem'
      }}>
        {/* Main image - Flork-style character with heart */}
        <div style={{
          animation: 'bounce 2s infinite'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1638736230803-4b3682b24f5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2FydG9vbiUyMGNoYXJhY3RlciUyMGhlYXJ0JTIwbG92ZXxlbnwxfHx8fDE3NzAwMDUyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Cute character holding a heart"
            style={{
              width: '300px',
              height: '300px',
              borderRadius: '20px',
              objectFit: 'cover',
              boxShadow: '0 10px 40px rgba(255, 105, 180, 0.3)'
            }}
          />
        </div>

        {/* Proposal text */}
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#ff1744',
          margin: 0,
          textShadow: '2px 2px 4px rgba(255, 105, 180, 0.2)'
        }}>
          Sanikaaaa, will you be my Valentine? 💘
        </h1>

        {/* Buttons container */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          marginTop: '1rem',
          position: 'relative',
          minHeight: '120px',
          alignItems: 'center'
        }}>
          {/* Yes button - with hover effects and click handler */}
          <button
            onClick={handleYesClick}
            style={{
              padding: '1rem 3rem',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#ff1744',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(255, 23, 68, 0.3)',
              position: 'relative',
              zIndex: 10,
              transform: hasNoButtonMoved ? 'scale(1.3)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              const baseScale = hasNoButtonMoved ? 1.3 : 1;
              e.currentTarget.style.transform = `scale(${baseScale * 1.2})`;
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 23, 68, 0.6)';
            }}
            onMouseLeave={(e) => {
              const baseScale = hasNoButtonMoved ? 1.3 : 1;
              e.currentTarget.style.transform = `scale(${baseScale})`;
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 23, 68, 0.3)';
            }}
          >
            Yes ❤️
          </button>

          {/* No button - runs away from cursor */}
          <button
            ref={noButtonRef}
            onClick={handleNoClick}
            onMouseEnter={(e) => {
              // When mouse enters, calculate escape direction
              const rect = e.currentTarget.getBoundingClientRect();
              const buttonCenterX = rect.left + rect.width / 2;
              const buttonCenterY = rect.top + rect.height / 2;
              
              // Get current mouse position from the event
              const mouseX = e.clientX;
              const mouseY = e.clientY;
              
              // Calculate direction away from cursor
              const angle = Math.atan2(buttonCenterY - mouseY, buttonCenterX - mouseX);
              
              // Move button away from cursor
              const escapeDistance = 250;
              let newX = buttonCenterX + Math.cos(angle) * escapeDistance;
              let newY = buttonCenterY + Math.sin(angle) * escapeDistance;
              
              // Add slight random variation
              newX += (Math.random() - 0.5) * 50;
              newY += (Math.random() - 0.5) * 50;
              
              // Keep button within viewport with padding
              const padding = 100;
              const maxX = window.innerWidth - padding - rect.width;
              const maxY = window.innerHeight - padding - rect.height;
              
              newX = Math.max(padding, Math.min(maxX, newX));
              newY = Math.max(padding, Math.min(maxY, newY));
              
              const randomRotation = (Math.random() - 0.5) * 30;
              setNoButtonPosition({ x: newX, y: newY });
              setNoButtonRotation(randomRotation);
              setIsNoButtonPositioned(true);
              setHasNoButtonMoved(true);
            }}
            style={{
              padding: '1rem 3rem',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#9e9e9e',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(158, 158, 158, 0.3)',
              position: isNoButtonPositioned ? 'fixed' : 'relative',
              left: isNoButtonPositioned ? `${noButtonPosition.x}px` : 'auto',
              top: isNoButtonPositioned ? `${noButtonPosition.y}px` : 'auto',
              zIndex: 10,
              transform: isNoButtonPositioned ? `rotate(${noButtonRotation}deg)` : 'none',
              transition: isNoButtonPositioned ? 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
              willChange: isNoButtonPositioned ? 'transform' : 'auto'
            }}
          >
            No 💔
          </button>
        </div>

        {/* Helpful hint */}
        <p style={{
          fontSize: '1rem',
          color: '#ff69b4',
          fontStyle: 'italic',
          marginTop: '1rem',
          opacity: 0.7
        }}>
          (Psst... there's only one right answer 😉)
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-50px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
}