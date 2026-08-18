import { useEffect, useState } from 'react';

export function DateTime() {
  const [dateTime, setDateTime] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);
      setDateTime(capitalized);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-sm text-muted-foreground">
      📅 {dateTime || 'Carregando...'}
    </p>
  );
}
