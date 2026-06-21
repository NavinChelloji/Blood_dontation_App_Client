export function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d)) return '';

    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    };

    return {
        date: d.toLocaleDateString('en-US', { ...defaultOptions }), time: d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,   // false for 24-hour format
        })
    };
}