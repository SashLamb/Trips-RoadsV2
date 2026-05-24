import { useParams, useNavigate } from 'react-router-dom'

export default function TripDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <header className="max-w-3xl mx-auto mb-10 flex items-center gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="text-slate-400 hover:text-white transition text-sm"
                >
                    ← Retour
                </button>
                <h1 className="text-3xl font-bold text-emerald-400">Road trip #{id}</h1>
            </header>

            <main className="max-w-3xl mx-auto">
                <p className="text-slate-500 text-sm">Détail du trip — à construire.</p>
            </main>
        </div>
    )
}
