const CALENDAR_EVENT_DATA = require('../../assets/data/calendar-event.json');

const getCalendarEvent = () => {
    return CALENDAR_EVENT_DATA.map(item => {
        var date = item.date?.split("/");
        return {
            ...item,
            day: date ? parseInt(date[0]) : null,
            month: date ? parseInt(date[1]) : null,
        };
    })
}
export const calendarEvent = getCalendarEvent();