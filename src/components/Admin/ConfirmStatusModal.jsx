import React from 'react';
import { AlertTriangle, Ban, CheckCircle } from 'lucide-react';

export default function ConfirmStatusModal({ isOpen, onClose, onConfirm, userName, newStatus }) {
    if (!isOpen) return null;

    const isActivating = newStatus === 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">

                {/* Header */}
                <div className={`px-6 py-4 flex items-center gap-3 ${isActivating ? 'bg-green-50' : 'bg-red-50'}`}>
                    {isActivating ? (
                        <div className="p-2 bg-green-100 rounded-full text-green-600">
                            <CheckCircle size={24} />
                        </div>
                    ) : (
                        <div className="p-2 bg-red-100 rounded-full text-red-600">
                            <Ban size={24} />
                        </div>
                    )}
                    <h3 className={`text-lg font-bold ${isActivating ? 'text-green-800' : 'text-red-800'}`}>
                        {isActivating ? 'Ativar Usuário' : 'Inativar Usuário'}
                    </h3>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 mb-2">
                        Tem certeza que deseja {isActivating ? <strong>ativar</strong> : <strong>bloquear</strong>} o acesso do usuário:
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center font-medium text-lg text-gray-800 mb-4">
                        {userName}
                    </div>

                    {!isActivating && (
                        <div className="flex gap-2 items-start text-sm text-amber-600 bg-amber-50 p-3 rounded-md mb-2">
                            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                            <p>O usuário não conseguirá mais fazer login no sistema até ser reativado.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white font-bold rounded-lg shadow-md transition-transform active:scale-95 flex items-center gap-2 ${isActivating
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-600 hover:bg-red-700'
                            }`}
                    >
                        {isActivating ? 'Confirmar Ativação' : 'Confirmar Bloqueio'}
                    </button>
                </div>
            </div>
        </div>
    );
}
