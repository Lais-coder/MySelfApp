export default function Footer() {
  return (
    <footer className="w-full bg-white border-t mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-marcellus text-xl text-slate-800">MYF'SP</h3>
          <p className="text-sm text-gray-600 mt-2">Construindo hábitos saudáveis com pequenas vitórias diárias.</p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-800">Links</h4>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            <li><a href="/plano-alimentar" className="hover:underline">Plano Alimentar</a></li>
            <li><a href="/calendario" className="hover:underline">Calendário</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-800">Contato</h4>
          <p className="text-sm text-gray-600 mt-2">Suporte: contato@myfsp.example</p>
          <p className="text-sm text-gray-500 mt-4">© {new Date().getFullYear()} MYF'SP</p>
        </div>
      </div>
    </footer>
  )
}
