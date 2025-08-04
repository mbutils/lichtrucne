import { useState, useEffect } from 'react';

import { CAL_VIEW_MODE } from "../../../models/Constants";

const DayView = (props) => {
    const {dateData, viewMode, scrSize} = props;

    function dateClass() {
        let today = new Date();

        var className = '';
        if (dateData) {
            if (dateData.year == today.getFullYear() && dateData.month == (today.getMonth() + 1) && dateData.dayOfMonth == today.getDate()) {
                className += ' today';
            }
            if (dateData.year < today.getFullYear() 
                || dateData.month < (today.getMonth() + 1)
                || (dateData.month == (today.getMonth() + 1) && dateData.dayOfMonth < today.getDate())) {
                className += ' day-pass';
            }
            if (dateData.event?.em) {
                console.log('dateData.event.em', dateData);
                className += ' main-event';
            }
        }
        
        return className;
    }

    return (
        <div className={`calendar-day scr-${scrSize}`}>
            {viewMode === CAL_VIEW_MODE.year ? (
                <div className={`day-view day-view__year ${dateClass()}`}>
                    {!dateData ? null : dateData.dayOfMonth}
                </div>
            ) : null}

            {viewMode === CAL_VIEW_MODE.month ? (
                <div className='day-view day-view__month'>
                    {!dateData ? null : dateData.dayOfMonth}
                </div>
            ) : null}
        </div>
    )
}

export default DayView;