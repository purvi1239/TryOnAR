import React from 'react'
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom'

// Simple menu component
import SimpleMenu from './js/components/SimpleMenu'

// Import AllInOne component
import AllInOne from './js/demos/AllInOne'

export default function SimpleApp() {
  return (
    <Router>
      <Routes>
        <Route path="/vto" element={<AllInOne />} />
        <Route path="/" element={<Navigate to="/vto" replace />} />
      </Routes>
    </Router>
  )
}