
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

const SimpleMarkdown: React.FC<{ text: string }> = React.memo(({ text }) => {
    const content = text.split('\n').map((line, i) => {
        if (line.trim().startsWith('* ')) {
            return <li key={i}>{line.substring(line.indexOf('* ') + 2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>;
        }
        if (line.trim() === '') {
            return <br key={i}/>;
        }
        const formattedLine = { __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') };
        return <p key={i} dangerouslySetInnerHTML={formattedLine}></p>;
    });

    return <>{content}</>;
});

const AIAssistant: React.FC = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleQuery = useCallback(async (currentQuery: string) => {
        if (!currentQuery.trim()) return;

        setIsLoading(true);
        setError('');
        setResponse('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const result = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: currentQuery,
                config: {
                    systemInstruction: "Eres un asistente experto en comercio exterior y logística de Chile. Responde las preguntas de los usuarios de manera clara, concisa y profesional, usando formato de listas o negritas si es necesario. Basa tus respuestas en la normativa y prácticas chilenas.",
                }
            });
            setResponse(result.text);
        } catch (e) {
            console.error(e);
            setError('Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleExampleClick = (exampleQuery: string) => {
        setQuery(exampleQuery);
        handleQuery(exampleQuery);
    }

    const exampleQueries = [
        "¿Qué es el Incoterm CIF?",
        "Explica el rol del SAG en la importación.",
        "¿Cómo se calcula el Dólar Aduanero?"
    ];

    return (
        <section className="bg-white rounded-lg shadow-lg p-6 my-8 border-t-4 border-accent">
            <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div>
                    <h3 className="text-2xl font-bold text-primary">Asistente de Comercio Exterior</h3>
                    <p className="text-gray-500">Haz una pregunta y obtén una respuesta de nuestra IA experta.</p>
                </div>
            </div>
            
            <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">O prueba con un ejemplo:</p>
                <div className="flex flex-wrap gap-2">
                    {exampleQueries.map(ex => (
                        <button key={ex} onClick={() => handleExampleClick(ex)} className="text-xs bg-light text-secondary font-semibold py-1 px-3 rounded-full hover:bg-secondary hover:text-white transition-colors">
                            {ex}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuery(query)}
                    placeholder="Ej: ¿Qué documentos se necesitan para exportar fruta?"
                    className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                    disabled={isLoading}
                />
                <button
                    onClick={() => handleQuery(query)}
                    disabled={isLoading}
                    className="bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary transition-colors disabled:bg-gray-400 flex items-center justify-center"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Consultar'}
                </button>
            </div>

            {(response || error || isLoading) && (
                <div className="mt-6 p-4 bg-light rounded-lg min-h-[100px]">
                    {isLoading && <p className="text-center text-gray-500">Pensando...</p>}
                    {error && <p className="text-red-600">{error}</p>}
                    {response && <div className="text-dark space-y-2"><SimpleMarkdown text={response} /></div>}
                </div>
            )}
        </section>
    );
};

export default AIAssistant;
