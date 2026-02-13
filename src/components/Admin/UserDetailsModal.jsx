import React from 'react';
import { X, User, Heart, Utensils, Clipboard, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function UserDetailsModal({ user, onClose }) {
    if (!user) return null;

    // The data is already parsed by the backend in listUsers
    const questionnaire = user.questionnaire_data || {};
    const health = user.health_data || {};

    const hasData = Object.keys(questionnaire).length > 0 || Object.keys(health).length > 0;

    // Estado para abas: 'step1' (Dados Pessoais) ou 'step2' (Saúde)
    const [activeTab, setActiveTab] = React.useState('step1');

    const mealTypes = ['Café da Manhã', 'Lanche da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar', 'Ceia'];

    const generatePDF = () => {
        try {
            const doc = new jsPDF();

            // Título do PDF
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.setTextColor(64, 128, 75); // Verde #40804b
            doc.text(`Ficha do Aluno: ${user.username}`, 14, 20);

            // Preparação dos dados
            const bodyData = [
                ['Nome', questionnaire.nome || user.username],
                ['Gênero', questionnaire.genero || '-'],
                ['Idade', questionnaire.idade ? `${questionnaire.idade} anos` : '-'],
                ['Objetivo', health.objetivo_principal || '-'],
                ['Alergias', health.alergias || 'Nenhuma'],
                ['Atividade Física', health.atividade_fisica || '-'],
                ...mealTypes.map(meal => [meal, health[meal] || 'Não informado'])
            ];

            // Geração da Tabela
            autoTable(doc, {
                startY: 30,
                head: [['Campo', 'Informação']],
                body: bodyData,
                headStyles: { fillColor: [123, 103, 166] }, // Roxo #7B67A6
                styles: { font: "helvetica", fontSize: 10 },
                theme: 'striped'
            });

            doc.save(`Ficha_${user.username}.pdf`);
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-[#40804b] flex items-center gap-2">
                        <User size={24} />
                        Perfil do Aluno: {user.username}
                    </h2>

                    <div className="flex items-center gap-2">
                        {hasData && (
                            <button
                                onClick={generatePDF}
                                className="p-2 text-[#40804b] hover:bg-gray-100 rounded-full transition-colors"
                                title="Baixar PDF"
                            >
                                <Download size={22} />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {!hasData ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-lg text-gray-500 font-medium">Este aluno ainda não completou o perfil.</p>
                            <p className="text-sm text-gray-400 mt-2">Aguarde o preenchimento dos dados de saúde e questionário.</p>
                        </div>
                    ) : (
                        <>
                            {/* Tabs Navigation */}
                            <div className="flex border-b border-gray-200 mb-6">
                                <button
                                    onClick={() => setActiveTab('step1')}
                                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 ${activeTab === 'step1'
                                        ? 'border-[#7B67A6] text-[#7B67A6]'
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    Dados Pessoais
                                </button>
                                <button
                                    onClick={() => setActiveTab('step2')}
                                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 ${activeTab === 'step2'
                                        ? 'border-[#40804b] text-[#40804b]'
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    Saúde e Nutrição
                                </button>
                            </div>

                            {/* Dados Pessoais (Etapa 1) */}
                            {activeTab === 'step1' && (
                                <section className="animate-fade-in">
                                    <h3 className="text-lg font-bold text-[#7B67A6] mb-4 flex items-center gap-2 border-b border-[#7B67A6] pb-2">
                                        <Clipboard size={20} />
                                        Dados Gerais
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <DetailItem label="Nome" value={questionnaire.nome || user.username} />
                                        <DetailItem label="Gênero" value={questionnaire.genero || '-'} />
                                        <DetailItem label="Idade" value={questionnaire.idade ? `${questionnaire.idade} anos` : '-'} />
                                        <DetailItem label="Estado Civil" value={questionnaire.estado_civil || '-'} />
                                        <DetailItem label="Profissão" value={questionnaire.profissao || '-'} />
                                        <DetailItem label="Carga Horária" value={questionnaire.carga_horaria || '-'} />
                                        <DetailItem label="Email" value={user.email || '-'} />
                                        <DetailItem label="Objetivo" value={health.objetivo_principal || '-'} />
                                        <DetailItem label="Por que procurou?" value={questionnaire.pq_procurou || '-'} fullWidth />
                                    </div>
                                </section>
                            )}

                            {/* Saúde (Etapa 2) */}
                            {activeTab === 'step2' && (
                                <section className="animate-fade-in space-y-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#40804b] mb-4 flex items-center gap-2 border-b border-[#40804b] pb-2">
                                            <Heart size={20} />
                                            Saúde e Biometria
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <DetailItem label="Possui Doenças" value={health.possui_doenca || 'Não'} />
                                            <DetailItem label="Histórico Familiar" value={health.historico_familiar || '-'} />
                                            <DetailItem label="Alergias" value={health.alergias || 'Nenhuma'} fullWidth />
                                            <DetailItem label="Menstruação" value={health.ultimo_dia_menstruacao || '-'} />
                                            <DetailItem label="Atividade Física" value={health.atividade_fisica || '-'} />

                                            {/* Exames Laboratoriais - Download */}
                                            {health.exames_laboratoriais && (
                                                <div className="col-span-1 md:col-span-2 bg-[#f4fbf6] p-4 rounded-lg border border-[#d1e7d6] flex items-center justify-between">
                                                    <div>
                                                        <span className="block text-xs font-bold text-[#40804b] uppercase tracking-wide mb-1">Exames Laboratoriais</span>
                                                        <span className="text-sm text-gray-600">Arquivo anexado pelo aluno</span>
                                                    </div>
                                                    <a
                                                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${health.exames_laboratoriais}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2 bg-[#40804b] text-white rounded-lg hover:bg-[#346a3d] transition-colors text-sm font-bold"
                                                    >
                                                        <Download size={16} />
                                                        Baixar / Ver
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Hábitos Alimentares (Recordatório) */}
                                    <div>
                                        <h3 className="text-lg font-bold text-[#40804b] mb-4 flex items-center gap-2 border-b border-[#40804b] pb-2">
                                            <Utensils size={20} />
                                            Recordatório Alimentar
                                        </h3>
                                        <div className="space-y-4">
                                            <DetailItem label="O que NÃO gosta" value={health.comidas_nao_gosta || '-'} fullWidth />

                                            <div className="mt-4 bg-[#f9faff] p-4 rounded-lg border border-[#e0e8f0]">
                                                <p className="text-xs font-bold text-[#7B67A6] uppercase mb-3">Consumo Diário</p>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {mealTypes.map(meal => (
                                                        <div key={meal} className="border-l-2 border-[#7B67A6] pl-3 py-1">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{meal}</span>
                                                            <p className="text-sm text-gray-700">{health[meal] || 'Não informado'}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value, fullWidth = false }) {
    return (
        <div className={`bg-[#f9faff] p-3 rounded-lg border border-[#e0e8f0] ${fullWidth ? 'col-span-1 md:col-span-2' : ''}`}>
            <span className="block text-xs font-bold text-[#7B67A6] uppercase tracking-wide mb-1">{label}</span>
            <span className="text-gray-700 font-medium">{value}</span>
        </div>
    );
}