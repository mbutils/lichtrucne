import { useState, useEffect } from 'react';
import { Lunar } from 'lunar-typescript';

import { CAL_VIEW_MODE } from "../../../models/Constants";

const DayView = (props) => {
    const {dateData, viewMode, scrSize} = props;
    const [lunarDate, setLunarDate] = useState(null);

    useEffect(() => {
        var lunar;
        if (viewMode === CAL_VIEW_MODE.month && dateData) {
            var date = new Date(dateData.year, dateData.month - 1, dateData.dayOfMonth);
            var lunar = Lunar.fromDate(date);
        }
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
        }
        
        return className;
    }

    return (
        <div className={`calendar-day scr-${scrSize} mode-${viewMode} ${dateClass()}`}>
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
                <div className={`day-view day-view__month scr-${scrSize}`}>
                    <div className={`day-view__content}`}>
                        {!dateData ? null : dateData.dayOfMonth}
                    </div>
                    {lunarDate ? (
                        <div className={`day-lunar ${lunarDate.getDay() === 1 ? 'start-lunar-month' : ''}`}>
                            {lunarDate?.getDay()}/{lunarDate?.getMonth()}
                        </div>
                    ) : null}
                    <div className={`event-block ${dateData?.event?.other1 || dateData?.event?.other2 || dateData?.event?.other3 ? '' : 'd-none'}`}>
                        <div className={`other-event other-event__1 ${!dateData?.event?.other1 ? 'd-none' : ''}`}></div>
                        <div className={`other-event other-event__2 ${!dateData?.event?.other2 ? 'd-none' : ''}`}></div>
                        <div className={`other-event other-event__3 ${!dateData?.event?.other3 ? 'd-none' : ''}`}></div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default DayView;