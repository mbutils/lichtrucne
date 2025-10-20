import { useState, useEffect } from 'react';
import { Lunar } from 'lunar-typescript';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import {MONTH_NAME, WEEK_DAYS, CAL_VIEW_MODE} from "../../models/Constants";
import DayView from "./DayView";

const MonthView = (props) => {
    const {month, year, viewMode, scrSize, settingData, setMonth, setYear} = props;
    const [dayMap, setDayMap] = useState([]);
    const [daySelect, setDaySelect] = useState(null);
    const [events, setEvents] = useState(null);

    useEffect(() => {
        getDaysOfMonth();
        if (viewMode === CAL_VIEW_MODE.month) {
            var today = new Date(year, month - 1, daySelect?.solar ? daySelect.solar.dayOfMonth : (new Date()).getDate());
            if (today.getMonth() + 1 !== month) {
                today = new Date(year, month, 0); // mac dinh ngay cuoi cung cua thang dang xem
            }
            setDaySelect({
                solar: { dayOfMonth: today.getDate(), month: month, year: year },
                lunar: Lunar.fromDate(today)
            });
        }
    }, [month, year, settingData]);

    function getDaysOfMonth() {
        const days = [];
        const date = new Date(year, month - 1, 1, 0, 0, 0, 0); // month is 0-based (0 = Jan)
        date.setHours(0, 0, 0, 0);

        const savedData = JSON.parse(localStorage.getItem('ngayTrucSetting'));
        var tuaNum = savedData?.tuaNum || 5;
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
                dayOfWeek: WEEK_DAYS.find(i => i.day === date.getDay()), // 0-Sunday, 6-Monday
                event: {
                    em: subtractDay(date, emDate, tuaNum),
                    other1: subtractDay(date, other1Date, tuaNum),
                    other2: subtractDay(date, other2Date, tuaNum),
                    other3: subtractDay(date, other3Date, tuaNum),
                }
            });
            date.setDate(date.getDate() + 1);
        }

        setDayMap(days);
    }

    function subtractDay(date1, date2, tuaNum) {
        if (!date1 || !date2) {
            return false;
        }
        return (date1 - date2) / (1000 * 60 * 60 * 24) % tuaNum === 0;
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
                        selectDay={daySelect}
                        setSelectDay={setDaySelect}
                        setEvents={setEvents}
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

    function changeMonth(isNext) {
        if (isNext) {
            if (month >= 12) {
                setMonth(1);
                setYear(year + 1);
            } else {
                setMonth(month + 1);
            } 
        } else {
            if (month <= 1) {
                setMonth(12);
                setYear(year - 1);
            } else {
                setMonth(month - 1);
            } 
        }
    }

    return (
        <div className={`calendar-month scr-${scrSize}`}>
            <div className="month__title">
                {viewMode === CAL_VIEW_MODE.month ? (<>
                    <LeftOutlined className='mr-3 my-btn' style={{ fontSize: '0.8em' }}
                        onClick={() => changeMonth(false)}
                    />
                    <div className='title'>{month}-{MONTH_NAME[month].en}</div>
                    <RightOutlined  className='ml-3 my-btn' style={{ fontSize: '0.8em' }}
                        onClick={() => changeMonth(true)}
                    />
                </>) : (
                    <>{month}-{MONTH_NAME[month].en}</>
                )}
            </div>

            <div className="month__week">
                {WEEK_DAYS.map(dayOfWeek => (
                    <div className="month__week-name">{dayOfWeek.vi}</div>
                ))}
            </div>

            <div className="month__days">
                {renderDayOfMonth()}
            </div>

            {daySelect?.solar ?
                <div className='event-list'>
                    <div className='event-date'>{daySelect.solar.dayOfMonth}/{daySelect.solar.month}/{daySelect.solar.year}</div>
                    <div className='event-date-lunar'>{daySelect.lunar.getDay()}/{daySelect.lunar.getMonth()}/{daySelect.lunar.getYear()} Âm lịch</div>
                    {events ? events.map(e => <div className='event-item'>
                        {e.name}
                    </div>) : null}
                </div>
            : null}
        </div>
    )
}

export default MonthView;