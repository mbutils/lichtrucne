import { useState, useEffect } from 'react';
import { Lunar } from 'lunar-typescript';
import { CalendarFilled } from '@ant-design/icons';

import { CAL_VIEW_MODE } from "../../models/Constants";
import { calendarEvent } from '../../utils/CalendarUtils';

const DayView = (props) => {
    const {dateData, viewMode, scrSize, selectDay, setSelectDay, setEvents} = props;
    const [lunarDate, setLunarDate] = useState(null);
    const [eventList, setEventList] = useState(null);

    useEffect(() => {
        var lunar = null;
        var eventList = null;
        if (viewMode === CAL_VIEW_MODE.month && dateData) {
            var date = new Date(dateData.year, dateData.month - 1, dateData.dayOfMonth);
            lunar = Lunar.fromDate(date);

            eventList = calendarEvent.filter(e => {
                if (e.is_lunar) {
                    return e.day === lunar.getDay() && e.month === lunar.getMonth();
                } else {
                    return e.day === dateData.dayOfMonth && e.month === dateData.month;
                }
            });
            if (isSelectedDay()) {
                setEvents(eventList);
            }
        }
        setEventList(eventList);
        setLunarDate(lunar);
    }, [viewMode, dateData]);

    function dateClass() {
        let today = new Date();

        var className = '';
        if (dateData) {
            if (dateData.year == today.getFullYear() && dateData.month == (today.getMonth() + 1) && dateData.dayOfMonth == today.getDate()) {
                className += ' today';
            }
            if (dateData.year < today.getFullYear() 
                || (dateData.year <= today.getFullYear() && dateData.month < (today.getMonth() + 1))
                || (dateData.year <= today.getFullYear() && dateData.month == (today.getMonth() + 1) && dateData.dayOfMonth < today.getDate())) {
                className += ' day-pass';
            }
            if (dateData.event.em) {
                className += ' main-event';
            }
            if (isSelectedDay()) {
                className += ' selected';
            }
        }
        
        return className;
    }

    function onClickDay() {
        if (viewMode === CAL_VIEW_MODE.month) {
            if (isSelectedDay()) {
                setSelectDay(null);
                setEvents(null);
            } else {
                setSelectDay({
                    solar: dateData,
                    lunar: lunarDate
                });
                setEvents(eventList);
            }
        }
    }

    function isSelectedDay() {
        return selectDay?.solar && dateData 
            && selectDay.solar.dayOfMonth === dateData.dayOfMonth && selectDay.solar.month === dateData.month && selectDay.solar.year === dateData.year;
    }

    return (
        <div className={`calendar-day scr-${scrSize} mode-${viewMode} ${viewMode === CAL_VIEW_MODE.month ? dateClass() : ''}`}
            onClick={onClickDay}
        >
            {viewMode === CAL_VIEW_MODE.year ? (
                <div className={`day-view day-view__year scr-${scrSize} ${dateData?.event?.other1 || dateData?.event?.other2 || dateData?.event?.other3 ? 'mb-2' : ''}`}>
                    <div className={`day-view__content ${dateClass()}`}>
                        {!dateData ? null : dateData.dayOfMonth}
                    </div>
                    <div className={`event-block ${dateData?.event?.other1 || dateData?.event?.other2 || dateData?.event?.other3 ? '' : 'd-none'}`}>
                        <div className={`other-event other-event__1 ${!dateData?.event?.other1 ? 'd-none' : ''}`}></div>
                        <div className={`other-event other-event__2 ${!dateData?.event?.other2 ? 'd-none' : ''}`}></div>
                        <div className={`other-event other-event__3 ${!dateData?.event?.other3 ? 'd-none' : ''}`}></div>
                    </div>
                </div>
            ) : null}

            {viewMode === CAL_VIEW_MODE.month ? (
                <div className={`day-view-border scr-${scrSize}`}>
                    <div className={`day-view day-view__month scr-${scrSize}`}>
                        {eventList?.length ? (<CalendarFilled className='event-icon'/>) : null}
                        
                        <div className='right-content'>
                            <div className={`day-view__content`}>
                                {!dateData ? null : dateData.dayOfMonth}
                            </div>
                            {lunarDate ? (
                                <div className={`day-lunar ${lunarDate.getDay() === 1 ? 'start-lunar-month' : ''}`}>
                                    {lunarDate?.getDay()}/{lunarDate?.getMonth()}
                                </div>
                            ) : null}
                            <div className='event-block'>
                                <div className={`other-event other-event__0`}></div>
                                <div className={`other-event other-event__1 ${!dateData?.event?.other1 ? 'd-none' : ''}`}></div>
                                <div className={`other-event other-event__2 ${!dateData?.event?.other2 ? 'd-none' : ''}`}></div>
                                <div className={`other-event other-event__3 ${!dateData?.event?.other3 ? 'd-none' : ''}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default DayView;