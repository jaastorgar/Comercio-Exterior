export interface DashboardStat {
  label: string;
  value: string | number;
  color: string;
}

export class DashboardService {
  static getStats(xp: number, completedCount: number): DashboardStat[] {
    return [
      {
        label: "XP TOTAL",
        value: xp,
        color: "#00d1ff",
      },
      {
        label: "LECCIONES COMPLETADAS",
        value: completedCount,
        color: "#ff7a00",
      },
      {
        label: "NIVEL",
        value: Math.floor(xp / 100),
        color: "#22c55e",
      },
      {
        label: "RANKING",
        value: xp > 500 ? "PRO" : "BEGINNER",
        color: "#a855f7",
      },
    ];
  }
}