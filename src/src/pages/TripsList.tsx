import { useNavigate } from 'react-router-dom'

export default function TripsList() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <header className="max-w-3xl mx-auto mb-10">
                <h1 className="text-3xl font-bold text-emerald-400">Trips & Roads</h1>
                <p className="text-slate-400 mt-1">Tes road trips</p>
            </header>

            <main className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/trips/1')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-2 px-5 rounded-md transition"
                >
                    + Nouveau road trip
                </button>

                <p className="text-slate-500 mt-8 text-sm">Aucun road trip pour l'instant.</p>
            </main>
        </div>
    )
}
