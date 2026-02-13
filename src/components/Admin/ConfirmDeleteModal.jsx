import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, userName }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">

                {/* Header */}
                <div className="px-6 py-4 flex items-center gap-3 bg-red-50">
                    <div className="p-2 bg-red-100 rounded-full text-red-600">
                        <Trash2 size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-red-800">
                        Excluir Usuário
                    </h3>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 mb-2">
                        Tem certeza que deseja <strong>excluir permanentemente</strong> o usuário:
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center font-medium text-lg text-gray-800 mb-4">
                        {userName}
                    </div>

                    <div className="flex gap-2 items-start text-sm text-red-600 bg-red-50 p-3 rounded-md mb-2">
                        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                        <p>Essa ação é irreversível. Todos os dados do usuário, incluindo histórico e check-ins, serão apagados.</p>
                    </div>
                </div>

                {/* Footer - Ajustado para manter botões lado a lado */}
                <div className="px-6 py-4 bg-gray-50 flex flex-row items-center justify-end gap-3 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 text-white font-bold rounded-lg shadow-md transition-transform active:scale-95 flex items-center gap-2 bg-red-600 hover:bg-red-700 whitespace-nowrap"
                    >
                        Confirmar Exclusão
                    </button>
                </div>
            </div>
        </div>
    );
}