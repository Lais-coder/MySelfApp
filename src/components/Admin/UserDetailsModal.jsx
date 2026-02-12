
import React from 'react';
import { X, User, Heart, Utensils, Clipboard } from 'lucide-react';

export default function UserDetailsModal({ user, onClose }) {
    if (!user) return null;

    // The data is already parsed by the backend in listUsers
    const questionnaire = user.questionnaire_data || {};
    const health = user.health_data || {};

    const hasData = Object.keys(questionnaire).length > 0 || Object.keys(health).length > 0;

    // Helper to format labels from keys
    const formatLabel = (key) => {
        const labels = {
            nome: 'Nome Completo',
            genero: 'Gênero',
            idade: 'Idade',
            estado_civil: 'Estado Civil',
            profissao: 'Profissão',
            carga_horaria: 'Carga Horária',
            pq_procurou: 'Motivo da Consulta',
            quem_indicou: 'Indicação',
            possui_doenca: 'Possui Doenças',
            historico_familiar: 'Histórico Familiar',
            ultimo_dia_menstruacao: 'Última Menstruação',
            objetivo_principal: 'Objetivo Principal',
            alergias: 'Alergias/Intolerâncias',
            comidas_nao_gosta: 'O que NÃO gosta',
            atividade_fisica: 'Atividade Física',
            exames_laboratoriais: 'Exames',
        };
        return labels[key] || key.replace(/_/g, ' ');
    };

    const mealTypes = ['Café da Manhã', 'Lanche da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar', 'Ceia'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-[#40804b] flex items-center gap-2">
                        <User size={24} />
                        Perfil do Aluno: {user.username}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {!hasData ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-lg text-gray-500 font-medium">Este aluno ainda não completou o perfil.</p>
                            <p className="text-sm text-gray-400 mt-2">Aguarde o preenchimento dos dados de saúde e questionário.</p>
                        </div>
                    ) : (
                        <>
                            {/* Dados Pessoais (Etapa 1) */}
                            <section>
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

                            {/* Saúde (Etapa 2) */}
                            <section>
                                <h3 className="text-lg font-bold text-[#7B67A6] mb-4 flex items-center gap-2 border-b border-[#7B67A6] pb-2">
                                    <Heart size={20} />
                                    Saúde e Biometria
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DetailItem label="Possui Doenças" value={health.possui_doenca || 'Não'} />
                                    <DetailItem label="Histórico Familiar" value={health.historico_familiar || '-'} />
                                    <DetailItem label="Alergias" value={health.alergias || 'Nenhuma'} fullWidth />
                                    <DetailItem label="Menstruação" value={health.ultimo_dia_menstruacao || '-'} />
                                    <DetailItem label="Atividade Física" value={health.atividade_fisica || '-'} />
                                </div>
                            </section>

                            {/* Hábitos Alimentares (Recordatório) */}
                            <section>
                                <h3 className="text-lg font-bold text-[#7B67A6] mb-4 flex items-center gap-2 border-b border-[#7B67A6] pb-2">
                                    <Utensils size={20} />
                                    Habitos Alimentares (Recordatório)
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
                            </section>
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
