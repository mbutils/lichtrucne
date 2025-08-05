import { useState, useEffect } from 'react';

import {MONTH_NAME, WEEK_DAYS} from "../../../models/Constants";
import DayView from "../day/DayView";

const MonthView = (props) => {
    const {month, year, viewMode, scrSize, settingData} = props;
    const [dayMap, setDayMap] = useState([]);

    useEffect(() => {
        getDaysOfMonth();
    }, [month, year, settingData]);

    function getDaysOfMonth() {
        const days = [];
        const date = new Date(year, month - 1, 1, 0, 0, 0, 0); // month is 0-based (0 = Jan)
        date.setHours(0, 0, 0, 0);

        const savedData = JSON.parse(localStorage.getItem('ngayTrucSetting'));
        var emDate = savedData?.em?.date;
        var other1Date = savedData?.other1?.date;
        var other2Date = savedData?.other2?.date;
        var other3Date = savedData?.other3?.date;
        if (emDate) {
            emDate = new Date(emDate);
            emDate.setHours(0, 0, 0, 0);
        }
        if (other1Date) {
            other1Date = new Date(other1Date);
            other1Date.setHours(0, 0, 0, 0);
        }
        if (other2Date) {
            other2Date = new Date(other2Date);
            other2Date.setHours(0, 0, 0, 0);
        }
        if (other3Date) {
            other3Date = new Date(other3Date);
            other3Date.setHours(0, 0, 0, 0);
        }

        while (date.getMonth() === month - 1) {
            days.push({
                year: year,
                month: month,
                dayOfMonth: date.getDate(),
                dayOfWeek: WEEK_DAYS.find(i => i.day == date.getDay()), // 0-Sunday, 6-Monday
                event: {
                    em: subtractDay(date, emDate),
                    other1: subtractDay(date, other1Date),
                    other2: subtractDay(date, other2Date),
                    other3: subtractDay(date, other3Date),
                }
            });
            date.setDate(date.getDate() + 1);
        }

        setDayMap(days);
    }

    function subtractDay(date1, date2) {
        if (!date1 || !date2) {
            return false;
        }
        return (date1 - date2) / (1000 * 60 * 60 * 24) % 5 === 0;
    }

    function renderDayOfMonth() {
        const renderedAll = [];
        var dayIndex = 0;
        for (let week = 0; week < 6 && dayIndex < dayMap.length; week++) {
            let renderedItems = [];
            WEEK_DAYS.forEach(item => {
                let curDay = dayMap[dayIndex];
                let hasDay = false;
                if (dayIndex < dayMap.length && item.day === curDay.dayOfWeek.day) {
                    hasDay = true;
                    dayIndex++;
                }

                renderedItems.push(
                    <DayView
                        dateData={hasDay ? curDay : null}
                        viewMode={viewMode}
                        scrSize={scrSize}
                    />
                )
            });
            renderedAll.push(
                <div className='week-line'>
                    {renderedItems}
                </div>
            )
        }
        return renderedAll;
    }

    return (
        <div className={`calendar-month scr-${scrSize}`}>
            <div className="month__title">
                {month}-{MONTH_NAME[month].en}
            </div>

            <div className="month__week">
                {WEEK_DAYS.map(dayOfWeek => (
                    <div className="month__week-name">{dayOfWeek.en}</div>
                ))}
            </div>

            <div className="month__days">
                {renderDayOfMonth()}
            </div>
        </div>
    )
}

export default MonthView;