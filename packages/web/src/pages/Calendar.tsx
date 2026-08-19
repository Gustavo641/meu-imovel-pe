import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { Appointment } from '@meu-imovel-pe/shared';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return data as Appointment[];
    },
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();

  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysArray: (Date | null)[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      daysArray.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysArray.push(new Date(currentYear, currentMonth, day));
    }

    return daysArray;
  }, [currentMonth, currentYear]);

  const getAppointmentsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter((apt) => apt.scheduled_date?.split('T')[0] === dateStr);
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent">
          📅 Calendário de Visitas
        </h1>
        <p className="text-muted-foreground mt-2">Visualize e gerencie seus agendamentos</p>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between bg-card rounded-xl border border-border p-4">
        <button
          onClick={handlePrevMonth}
          className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          ← Anterior
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-foreground">
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleToday}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Hoje
          </button>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            Próximo →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-elevated">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center font-display font-bold text-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, idx) => {
            const appts = getAppointmentsForDate(date);
            const isToday = date && date.toDateString() === today.toDateString();
            const isCurrentMonth = date && date.getMonth() === currentMonth;

            return (
              <div
                key={idx}
                className={`min-h-28 p-3 rounded-lg border-2 transition-all ${
                  !date
                    ? 'bg-muted/30 border-transparent'
                    : isToday
                      ? 'bg-primary/10 border-primary'
                      : !isCurrentMonth
                        ? 'bg-muted/20 border-border'
                        : 'bg-surface border-border hover:border-primary hover:shadow-md'
                }`}
              >
                {date && (
                  <>
                    <div
                      className={`text-lg font-display font-bold mb-2 ${
                        isToday
                          ? 'text-primary'
                          : !isCurrentMonth
                            ? 'text-muted-foreground'
                            : 'text-foreground'
                      }`}
                    >
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {appts.slice(0, 2).map((apt) => (
                        <div
                          key={apt.id}
                          className="text-xs bg-accent text-accent-foreground p-1.5 rounded font-medium truncate"
                          title={apt.notes || 'Agendamento'}
                        >
                          {new Date(apt.scheduled_date).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      ))}
                      {appts.length > 2 && (
                        <div className="text-xs text-muted-foreground px-1">
                          +{appts.length - 2} mais
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-elevated">
        <h2 className="text-2xl font-display font-bold text-foreground mb-4">
          🎯 Próximas Visitas
        </h2>

        {appointments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">Nenhuma visita agendada</p>
            <p className="text-sm mt-2">Crie uma visita na seção de Leads ou Agenda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments
              .filter((apt) => new Date(apt.scheduled_date) >= today)
              .slice(0, 8)
              .map((apt) => {
                const aptDate = new Date(apt.scheduled_date);
                const isToday = aptDate.toDateString() === today.toDateString();

                return (
                  <div
                    key={apt.id}
                    className="p-4 border border-border rounded-lg bg-surface hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {isToday ? '⭐ Hoje' : '📍'} Visita Agendada
                        </h3>
                        {apt.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{apt.notes}</p>
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-md ${
                          isToday
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {aptDate.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      🕐 {aptDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
