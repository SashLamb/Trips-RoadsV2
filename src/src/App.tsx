import { Routes, Route } from 'react-router-dom'
import TripsList from './pages/TripsList'
import TripDetail from './pages/TripDetail'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<TripsList />} />
            <Route path="/trips/:id" element={<TripDetail />} />
        </Routes>
    )
}
