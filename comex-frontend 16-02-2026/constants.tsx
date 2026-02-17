
import React from 'react';
import { Container, Lesson, TradeAgreement } from './types';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Package, 
  Calculator, 
  Map as MapIcon, 
  FileSearch,
  ArrowLeftRight
} from 'lucide-react';

export const COLORS = {
  bg: '#0a0a0a',
  card: '#ffffff',
  primary: '#ff7a00',
  accent: '#00d1ff',
  textDark: '#1a1a1a',
  textLight: '#ffffff'
};

export const CONTAINERS: Container[] = [
  { type: '20ST', length: 5.89, width: 2.35, height: 2.39, maxWeight: 28200 },
  { type: '40ST', length: 12.03, width: 2.35, height: 2.39, maxWeight: 26600 },
  { type: '40HC', length: 12.03, width: 2.35, height: 2.69, maxWeight: 26500 }
];

export const LESSONS: Lesson[] = [
  { 
    id: 'u1', level: 1, title: 'Incoterms 2020: Reglas Oro', 
    description: 'Dominio de responsabilidades y transferencia de riesgos.', 
    xp: 200, completed: false, type: 'quiz',
    questions: [
      { id: 'q1', text: '¿Cuál Incoterm obliga al vendedor a realizar el despacho de importación?', options: ['DDP', 'DAP', 'DPU', 'EXW'], correctIndex: 0 }
    ]
  },
  { 
    id: 'u8', level: 3, title: 'Simulación: Optimización de Carga', 
    description: 'Cubicaje estratégico de contenedores 40 HC.', 
    xp: 600, completed: false, type: 'simulation' 
  },
];

export const AGREEMENTS: TradeAgreement[] = [
  { id: '1', country: 'China', type: 'TLC', year: 2006, description: 'Chile fue el primer país en firmar un TLC individual con China.' },
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dash', icon: <LayoutDashboard size={20} /> },
  { id: 'lessons', label: 'Cursos', icon: <GraduationCap size={20} /> },
  { id: 'simulator', label: 'Cubicaje', icon: <Package size={20} /> },
  { id: 'incoterms', label: 'Incoterms', icon: <ArrowLeftRight size={20} /> },
  { id: 'calculator', label: 'Costeo', icon: <Calculator size={20} /> },
  { id: 'map', label: 'Tratados', icon: <MapIcon size={20} /> },
  { id: 'library', label: 'Normas', icon: <FileSearch size={20} /> },
];
