
import React, { useState } from 'react';
import { LESSONS } from '../constants';
import { Lesson, Question } from '../types';
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

  const levels = [1, 2, 3];

  const handleStartLesson = (lesson: Lesson) => {
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

  const handleNext = () => {
    if (!activeLesson?.questions) return;
    
    if (currentQuestionIndex < activeLesson.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(null);
    } else {
      setLessonFinished(true);
    }
  };

  const isPerfectScore = activeLesson?.questions ? correctCount === activeLesson.questions.length : false;

  const closeLesson = () => {
    if (lessonFinished && activeLesson && isPerfectScore) {
      onComplete(activeLesson.id, activeLesson.xp);
    }
    setActiveLesson(null);
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

    if (lives === 0 && !lessonFinished) {
      return (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="w-32 h-32 bg-red-500/20 rounded-full flex items-center justify-center mb-8 border-4 border-red-500/50">
            <Heart size={64} className="text-red-500" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase text-center">¡Academia Suspendida!</h2>
          <p className="text-zinc-500 text-xl text-center max-w-md mb-12">
            Te has quedado sin vidas. Debes repasar los conceptos de comercio exterior antes de intentar de nuevo.
          </p>
          <div className="flex flex-col w-full max-w-xs gap-4">
            <button 
              onClick={retryLesson}
              className="bg-[#ff7a00] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              <RotateCcw size={24} /> REINTENTAR NIVEL
            </button>
            <button 
              onClick={() => setActiveLesson(null)}
              className="bg-zinc-900 text-zinc-400 py-5 rounded-2xl font-black text-lg hover:text-white transition-all"
            >
              SALIR AL PANEL
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col animate-in fade-in duration-300">
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-6 md:px-12">
          <button onClick={() => setActiveLesson(null)} className="text-zinc-500 hover:text-white transition-colors">
            <X size={32} />
          </button>
          <div className="flex-1 max-w-xl mx-8">
            <div className="h-4 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div 
                className="h-full bg-[#ff7a00] transition-all duration-500 shadow-[0_0_15px_#ff7a00]" 
                style={{ width: `${lessonFinished ? 100 : progress}%` }} 
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Heart size={24} className={`${lives > 0 ? 'text-red-500 fill-red-500' : 'text-zinc-700'}`} />
            <span className="font-black text-xl">{lives}</span>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
          {!lessonFinished ? (
            <div className="max-w-2xl w-full space-y-12">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-[#00d1ff] font-black uppercase tracking-widest text-sm italic">Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
                   <span className="text-zinc-500 font-bold text-xs uppercase">Correctas: {correctCount}/{questions.length}</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">{question?.text}</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {question?.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={showFeedback !== null}
                    className={`p-5 md:p-6 rounded-3xl text-left border-4 transition-all flex items-center justify-between group ${
                      selectedOption === idx
                        ? showFeedback === 'correct' 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                          : 'bg-red-500/10 border-red-500 text-red-500'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800'
                    }`}
                  >
                    <span className="font-bold text-base md:text-xl">{option}</span>
                    {selectedOption === idx && (
                      showFeedback === 'correct' ? <CheckCircle size={24} /> : <X size={24} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-8 animate-in zoom-in duration-500">
               <div className={`w-48 h-48 rounded-full flex items-center justify-center mx-auto border-4 shadow-[0_0_50px_rgba(0,0,0,0.2)] ${
                 isPerfectScore ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-orange-500/20 border-orange-500 text-orange-500'
               }`}>
                  {isPerfectScore ? <Check size={80} strokeWidth={4} /> : <AlertTriangle size={80} strokeWidth={4} />}
               </div>
               <div className="space-y-2">
                  <h2 className={`text-4xl md:text-5xl font-black italic tracking-tighter uppercase ${isPerfectScore ? 'text-white' : 'text-orange-500'}`}>
                    {isPerfectScore ? '¡Certificación Lograda!' : 'Examen No Aprobado'}
                  </h2>
                  <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-md mx-auto">
                    {isPerfectScore 
                      ? `Has dominado el módulo de ${activeLesson.title} con éxito.` 
                      : `Para obtener el premio de XP y avanzar, debes responder TODAS las preguntas correctamente.`}
                  </p>
               </div>
               <div className="bg-zinc-900 p-8 rounded-[3rem] border border-zinc-800 flex items-center justify-center gap-12 max-w-sm mx-auto">
                  <div className="text-center">
                    <div className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mb-1">Premio</div>
                    <div className={`text-2xl md:text-3xl font-black ${isPerfectScore ? 'text-[#ff7a00]' : 'text-zinc-700'}`}>
                      {isPerfectScore ? `+${activeLesson.xp} XP` : '0 XP'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mb-1">Aciertos</div>
                    <div className={`text-2xl md:text-3xl font-black ${isPerfectScore ? 'text-[#00d1ff]' : 'text-orange-500'}`}>
                      {precision}%
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        <footer className={`h-24 md:h-32 border-t border-zinc-800 flex items-center justify-center px-6 md:px-12 transition-all duration-300 ${
          lessonFinished ? (isPerfectScore ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-orange-900/10 border-orange-500/20') :
          showFeedback === 'correct' ? 'bg-emerald-900/10 border-emerald-500/20' : 
          showFeedback === 'wrong' ? 'bg-red-900/10 border-red-500/20' : ''
        }`}>
          {showFeedback || lessonFinished ? (
            <div className="max-w-2xl w-full flex items-center justify-between gap-4 md:gap-6">
               <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 ${
                    (showFeedback === 'correct' || (lessonFinished && isPerfectScore)) ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {/* // Fix: Use className for responsive sizing instead of invalid md:size prop */}
                    {(showFeedback === 'correct' || (lessonFinished && isPerfectScore)) ? <Check className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} /> : <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />}
                  </div>
                  <div>
                    <h4 className={`font-black text-lg md:text-xl italic uppercase leading-none ${
                      (showFeedback === 'correct' || (lessonFinished && isPerfectScore)) ? 'text-emerald-500' : 'text-orange-500'
                    }`}>
                      {lessonFinished ? (isPerfectScore ? 'APROBADO' : 'INTÉNTALO DE NUEVO') : showFeedback === 'correct' ? '¡Muy Bien!' : '¡Error!'}
                    </h4>
                  </div>
               </div>
               <button 
                onClick={lessonFinished ? (isPerfectScore ? closeLesson : retryLesson) : handleNext}
                className={`px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-white shadow-xl hover:scale-105 active:scale-95 transition-all text-sm md:text-base ${
                  (showFeedback === 'correct' || (lessonFinished && isPerfectScore)) ? 'bg-emerald-500' : 'bg-orange-500'
                }`}
               >
                 {lessonFinished ? (isPerfectScore ? 'FINALIZAR Y GUARDAR' : 'REINTENTAR CURSO') : 'SIGUIENTE'}
               </button>
            </div>
          ) : (
            <button disabled className="bg-zinc-800 text-zinc-600 px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black cursor-not-allowed text-sm md:text-base">
               ELIGE UNA RESPUESTA
            </button>
          )}
        </footer>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-2 md:py-6">
      <div className="flex items-center justify-between mb-8 md:mb-16 bg-zinc-900/50 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-zinc-800 shadow-xl">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 rounded-full border border-orange-500/20">
            <Flame className="text-[#ff7a00]" size={16} fill="currentColor" />
            <span className="font-black text-xs md:text-sm text-white">Racha: 5</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
            <Star className="text-[#00d1ff]" size={16} fill="currentColor" />
            <span className="font-black text-xs md:text-sm text-white">{xp} XP</span>
          </div>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart 
              key={i} 
              size={18} 
              className={i < lives ? "text-red-500 fill-red-500" : "text-zinc-700"} 
            />
          ))}
        </div>
      </div>

      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-2 italic tracking-tighter leading-none uppercase">Ruta de Certificación</h2>
        <p className="text-zinc-500 text-sm md:text-xl font-medium px-4">Debes aprobar con 100% de efectividad para avanzar.</p>
      </div>

      <div className="space-y-16 md:space-y-24 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 md:w-2 bg-zinc-900/50 -translate-x-1/2 z-0 rounded-full" />

        {levels.map((level) => (
          <div key={level} className="relative z-10 space-y-8 md:space-y-12">
            <div className="flex justify-center">
              <div className="bg-zinc-900 border-2 border-zinc-800 px-8 md:px-12 py-3 md:py-4 rounded-2xl md:rounded-3xl font-black text-[#ff7a00] text-xs md:text-sm tracking-widest uppercase flex items-center gap-2 shadow-2xl">
                <Award size={18} fill="currentColor" /> UNIDAD {level}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-32 gap-y-10">
              {LESSONS.filter(l => l.level === level).map((lesson, idx) => {
                const isCompleted = completedLessonIds.includes(lesson.id);
                const previousIndex = LESSONS.findIndex(l => l.id === lesson.id) - 1;
                const isLocked = (previousIndex >= 0 && !completedLessonIds.includes(LESSONS[previousIndex].id)) || (lesson.level > 1 && !completedLessonIds.includes(LESSONS.find(l=>l.level === lesson.level - 1 && LESSONS.indexOf(l) === LESSONS.filter(x=>x.level===lesson.level-1).length-1)?.id || ''));

                const effectivelyLocked = idx === 0 && level === 1 ? false : isLocked;

                return (
                  <div 
                    key={lesson.id} 
                    onClick={() => !effectivelyLocked && handleStartLesson(lesson)}
                    className={`flex flex-col items-center text-center gap-4 md:gap-6 group cursor-pointer ${
                      idx % 2 === 0 ? 'md:items-end md:text-right' : 'md:items-start md:text-left'
                    }`}
                  >
                    <div className={`relative w-24 h-24 md:w-36 md:h-36 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center transition-all duration-500 shadow-2xl transform active:scale-95 ${
                      isCompleted 
                      ? 'bg-[#00d1ff] text-white rotate-2' 
                      : effectivelyLocked 
                        ? 'bg-zinc-800/50 text-zinc-700 grayscale cursor-not-allowed border-none' 
                        : 'bg-zinc-900 border-4 border-zinc-800 text-zinc-500 group-hover:border-[#ff7a00] group-hover:text-white group-hover:-translate-y-2'
                    }`}>
                      {/* // Fix: Use className for responsive sizing instead of invalid md:size prop */}
                      {isCompleted ? (
                        <CheckCircle className="w-8 h-8 md:w-12 md:h-12" strokeWidth={2.5} />
                      ) : effectivelyLocked ? (
                        <Lock className="w-8 h-8 md:w-12 md:h-12" />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                           {lesson.type === 'simulation' ? <BrainCircuit className="w-8 h-8 md:w-12 md:h-12" /> : <BookOpen className="w-8 h-8 md:w-12 md:h-12" />}
                        </div>
                      )}
                      
                      {!isCompleted && !effectivelyLocked && (
                        <div className="absolute -top-3 bg-[#ff7a00] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase shadow-lg animate-bounce">
                          {lives === 0 ? 'SIN VIDAS' : 'EXAMEN'}
                        </div>
                      )}

                      <div className={`absolute -bottom-2 -right-2 rounded-xl px-2 py-1 text-[8px] md:text-xs font-black shadow-xl border ${
                        isCompleted ? 'bg-white text-[#00d1ff] border-white' : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                      }`}>
                        {lesson.xp} XP
                      </div>
                    </div>

                    <div className="max-w-[180px] md:max-w-[240px]">
                      <h3 className={`font-black text-base md:text-2xl mb-1 md:mb-2 italic leading-tight ${effectivelyLocked ? 'text-zinc-700' : 'text-white'}`}>
                        {lesson.title}
                      </h3>
                      <p className={`text-[10px] md:text-sm leading-tight ${effectivelyLocked ? 'text-zinc-800' : 'text-zinc-500'}`}>
                        {effectivelyLocked ? 'Completa el nivel anterior' : lesson.description}
                      </p>
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
