import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import type { Appointment } from '@meu-imovel-pe/shared';

export function Calendar() {
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

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysArray = [];

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
    return appointments.filter((apt) => apt.scheduled_date.split('T')[0] === dateStr);
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agenda</h1>

      {/* Calendar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">
          {monthNames[currentMonth]} {currentYear}
        </h2>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((date, idx) => {
            const appts = getAppointmentsForDate(date);
            const isToday = date && date.toDateString() === today.toDateString();

            return (
              <div
                key={idx}
                className={`min-h-24 p-2 border rounded ${
                  date === null
                    ? 'bg-gray-50'
                    : isToday
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white'
                }`}
              >
                {date && (
                  <>
                    <div className={`font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {appts.map((apt) => (
                        <div
                          key={apt.id}
                          className="text-xs bg-orange-100 text-orange-700 p-1 rounded truncate"
                        >
                          {new Date(apt.scheduled_date).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Próximas Visitas</h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500">Nenhuma visita agendada</p>
        ) : (
          <div className="space-y-3">
            {appointments
              .filter((apt) => new Date(apt.scheduled_date) >= today)
              .slice(0, 10)
              .map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Visita Agendada</h3>
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {new Date(apt.scheduled_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(apt.scheduled_date).toLocaleTimeString('pt-BR')}
                  </p>
                  {apt.notes && <p className="text-sm text-gray-700 mt-2">{apt.notes}</p>}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
