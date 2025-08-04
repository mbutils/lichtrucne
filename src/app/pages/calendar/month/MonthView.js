import { useState, useEffect } from 'react';

import {MONTH_NAME, WEEK_DAYS} from "../../../models/Constants";
import DayView from "../day/DayView";

const MonthView = (props) => {
    const {month, year, viewMode, scrSize} = props;
    const [dayMap, setDayMap] = useState([]);

    useEffect(() => {
        getDaysOfMonth();
    }, [month, year]);

    function getDaysOfMonth() {
        const days = [];
        const date = new Date(year, month - 1, 1); // month is 0-based (0 = Jan)
        const savedData = JSON.parse(localStorage.getItem('ngayTrucSetting'));
        console.log('savedData', savedData);

        while (date.getMonth() === month - 1) {
            days.push({
                year: year,
                month: month,
                dayOfMonth: date.getDate(),
                dayOfWeek: WEEK_DAYS.find(i => i.day == date.getDay()), // 0-Sunday, 6-Monday
                event: () => {
                    if (savedData) {
                        return {
                            em: savedData.em && savedData.em.dayOfMonth === date.getDate() && savedData.em.month === month,
                            other1: savedData.other1 && savedData.other1.dayOfMonth === date.getDate() && savedData.other1.month === month,
                            other2: savedData.other2 && savedData.other2.dayOfMonth === date.getDate() && savedData.other2.month === month,
                            other3: savedData.other3 && savedData.other3.dayOfMonth === date.getDate() && savedData.other3.month === month,
                        };
                    }
                }
            });
            date.setDate(date.getDate() + 1);
        }

        setDayMap(days);
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