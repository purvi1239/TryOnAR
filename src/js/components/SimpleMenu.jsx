import React from 'react'
import { Link } from 'react-router-dom'

const SimpleMenu = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        color: 'white',
        fontSize: '3rem',
        marginBottom: '2rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Simple Virtual Try-On
      </h1>

      <p style={{
        color: 'white',
        fontSize: '1.2rem',
        marginBottom: '3rem',
        opacity: 0.9
      }}>
        Try on glasses and helmets using WebAR face tracking
      </p>

      <Link
        to="/vto"
        style={{
          display: 'block',
          padding: '20px 40px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#333',
          textDecoration: 'none',
          borderRadius: '15px',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-5px)'
          e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
        }}
      >
        🚀 Start Virtual Try-On
      </Link>
    </div>
  )
}

export default SimpleMenu