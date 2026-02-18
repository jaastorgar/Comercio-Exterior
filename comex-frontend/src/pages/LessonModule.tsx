import React, { useState } from 'react';
import { LESSONS } from '../../constants';
import { Lesson } from '../../types';
import { saveLessonProgress } from "../api/accounts";
import { CheckCircle, Star, Lock, Award, BookOpen, BrainCircuit, Heart, Flame, X, Check, RotateCcw, AlertTriangle } from 'lucide-react';

interface LessonModuleProps {
  xp: number;
  lives: number;
  completedLessonIds: string[];
  onComplete: (lessonId: string, earnedXp: number) => void;
  onLoseLife: () => void;
  onResetLives: () => void;
}

const LessonModule: React.FC<LessonModuleProps> = ({ xp, lives, completedLessonIds, onComplete, onLoseLife, onResetLives }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false); // Estado para feedback de guardado

  const levels = [1, 2, 3];

  const handleStartLesson = (lesson: Lesson) => {
    // Lógica de bloqueo de lecciones basada en IDs completados
    const previousIndex = LESSONS.findIndex(l => l.id === lesson.id) - 1;
    const isFirstLesson = previousIndex === -1;
    const previousCompleted = isFirstLesson || completedLessonIds.includes(LESSONS[previousIndex].id);

    if (lives > 0 && previousCompleted) {
      setActiveLesson(lesson);
      setCurrentQuestionIndex(0);
      setLessonFinished(false);
      setShowFeedback(null);
      setSelectedOption(null);
      setCorrectCount(0);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (showFeedback || lives === 0) return;
    setSelectedOption(index);
    
    const question = activeLesson?.questions?.[currentQuestionIndex];
    if (question && index === question.correctIndex) {
      setShowFeedback('correct');
      setCorrectCount(prev => prev + 1);
    } else {
      setShowFeedback('wrong');
      onLoseLife();
    }
  };

  const isPerfectScore = activeLesson?.questions ? correctCount === activeLesson.questions.length : false;

  // NUEVA FUNCIÓN: Conexión con el backend
  const closeLesson = async () => {
    if (lessonFinished && activeLesson && isPerfectScore) {
      setIsSaving(true);
      try {
        // Guardamos en Django a través de la API
        await saveLessonProgress(activeLesson.id, activeLesson.xp);
        onComplete(activeLesson.id, activeLesson.xp);
        setActiveLesson(null);
      } catch (error) {
        console.error("Error al guardar progreso:", error);
        alert("Error de conexión: No se pudo guardar tu XP.");
      } finally {
        setIsSaving(false);
      }
    } else {
      setActiveLesson(null);
    }
  };

  const retryLesson = () => {
    onResetLives();
    if (activeLesson) {
      setActiveLesson(null);
      setTimeout(() => handleStartLesson(activeLesson), 50);
    }
  };

  if (activeLesson) {
    const questions = activeLesson.questions || [];
    const question = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const precision = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    // Pantalla de Game Over (Sin Vidas)
    if (lives === 0 && !lessonFinished) {
      return (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
          <div className="w-32 h-32 bg-red-500/20 rounded-full flex items-center justify-center mb-8 border-4 border-red-500/50">
            <Heart size={64} className="text-red-500" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 italic uppercase text-center tracking-tighter">¡Academia Suspendida!</h2>
          <div className="flex flex-col w-full max-w-xs gap-4">
            <button onClick={retryLesson} className="bg-[#ff7a00] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3">
              <RotateCcw size={24} /> REINTENTAR
            </button>
            <button onClick={() => setActiveLesson(null)} className="bg-zinc-900 text-zinc-400 py-5 rounded-2xl font-black text-lg">
              SALIR AL PANEL
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col">
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-6">
          <button onClick={() => setActiveLesson(null)} className="text-zinc-500 hover:text-white">
            <X size={32} />
          </button>
          <div className="flex-1 max-w-xl mx-8">
            <div className="h-4 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div 
                className="h-full bg-[#ff7a00] transition-all duration-500" 
                style={{ width: `${lessonFinished ? 100 : progress}%` }} 
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Heart size={24} className="text-red-500 fill-red-500" />
            <span className="font-black text-xl text-white">{lives}</span>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {!lessonFinished ? (
            <div className="max-w-2xl w-full space-y-12">
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">{question?.text}</h2>
              <div className="grid grid-cols-1 gap-4">
                {question?.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={showFeedback !== null}
                    className={`p-5 rounded-3xl text-left border-4 transition-all flex items-center justify-between ${
                      selectedOption === idx
                        ? showFeedback === 'correct' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-red-500/10 border-red-500 text-red-500'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <span className="font-bold text-base md:text-xl">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-8">
               <div className={`w-48 h-48 rounded-full flex items-center justify-center mx-auto border-4 ${isPerfectScore ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-orange-500/20 border-orange-500 text-orange-500'}`}>
                  {isPerfectScore ? <Check size={80} strokeWidth={4} /> : <AlertTriangle size={80} strokeWidth={4} />}
               </div>
               <h2 className="text-4xl font-black italic uppercase text-white">
                 {isPerfectScore ? '¡Certificación Lograda!' : 'Examen No Aprobado'}
               </h2>
               <div className="bg-zinc-900 p-8 rounded-[3rem] border border-zinc-800 flex items-center justify-center gap-12 max-w-sm mx-auto">
                  <div>
                    <div className="text-zinc-500 font-bold uppercase text-[10px]">Premio</div>
                    <div className="text-2xl font-black text-[#ff7a00]">+{isPerfectScore ? activeLesson.xp : 0} XP</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 font-bold uppercase text-[10px]">Aciertos</div>
                    <div className="text-2xl font-black text-[#00d1ff]">{precision}%</div>
                  </div>
               </div>
            </div>
          )}
        </div>

        <footer className={`h-24 md:h-32 border-t border-zinc-800 flex items-center justify-center px-6 transition-all ${
          showFeedback === 'correct' ? 'bg-emerald-900/10' : showFeedback === 'wrong' ? 'bg-red-900/10' : ''
        }`}>
          {showFeedback || lessonFinished ? (
            <div className="max-w-2xl w-full flex items-center justify-between">
               <h4 className="font-black text-xl italic uppercase text-white">
                 {lessonFinished ? (isPerfectScore ? 'LISTO' : 'REINTENTAR') : showFeedback === 'correct' ? '¡Muy Bien!' : '¡Error!'}
               </h4>
               <button 
                onClick={lessonFinished ? (isPerfectScore ? closeLesson : retryLesson) : () => { setShowFeedback(null); setSelectedOption(null); setCurrentQuestionIndex(i => i + 1); }}
                disabled={isSaving}
                className="px-8 py-4 bg-emerald-500 rounded-2xl font-black text-white shadow-xl disabled:opacity-50"
               >
                 {isSaving ? 'GUARDANDO...' : lessonFinished ? 'FINALIZAR' : 'SIGUIENTE'}
               </button>
            </div>
          ) : (
            <button disabled className="bg-zinc-800 text-zinc-600 px-8 py-4 rounded-2xl font-black cursor-not-allowed">
               ELIGE UNA RESPUESTA
            </button>
          )}
        </footer>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Selector de Niveles (UI simplificada para brevedad) */}
      <div className="flex items-center justify-between mb-8 bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20 text-white">
            <Star className="text-[#00d1ff]" size={16} fill="currentColor" />
            <span className="font-black">{xp} XP</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart key={i} size={18} className={i < lives ? "text-red-500 fill-red-500" : "text-zinc-700"} />
          ))}
        </div>
      </div>

      <div className="space-y-24 relative">
        {levels.map((level) => (
          <div key={level} className="relative z-10 space-y-12">
            <div className="flex justify-center">
              <div className="bg-zinc-900 border-2 border-zinc-800 px-12 py-4 rounded-3xl font-black text-[#ff7a00] tracking-widest uppercase">
                UNIDAD {level}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {LESSONS.filter(l => l.level === level).map((lesson, idx) => {
                const isCompleted = completedLessonIds.includes(lesson.id);
                const isLocked = idx > 0 && !completedLessonIds.includes(LESSONS[idx-1]?.id);

                return (
                  <div 
                    key={lesson.id} 
                    onClick={() => !isLocked && handleStartLesson(lesson)}
                    className={`flex flex-col items-center gap-4 cursor-pointer group ${isLocked ? 'opacity-50' : ''}`}
                  >
                    <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-[#00d1ff] text-white' : 'bg-zinc-900 border-4 border-zinc-800 text-zinc-500'
                    }`}>
                      {isCompleted ? <CheckCircle size={48} /> : isLocked ? <Lock size={48} /> : <BookOpen size={48} />}
                    </div>
                    <div className="text-center">
                      <h3 className="font-black text-xl text-white italic">{lesson.title}</h3>
                      <p className="text-zinc-500 text-sm">{lesson.xp} XP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonModule;