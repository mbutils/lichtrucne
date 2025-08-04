import React, { useState, useEffect } from 'react';
import { DatePicker, ColorPicker, Modal, Row, Col } from 'antd';
import dayjs from 'dayjs';

const SettingModel = (props) => {
    const { isModalOpen, handleCancel, handleConfirm } = props;
    const [formData, setFormData] = useState({
        em: '',
        other1: '',
        other2: '',
        other3: '',
    });
    const defaultColor = {
        em: '#e67376',
        other1: '#1677ff',
        other2: '#fff64c',
        other3: '#53ef62',
    };

    useEffect(() => {
        const savedData = localStorage.getItem('ngayTrucSetting');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, [isModalOpen]);

    const handleOk = () => {
        localStorage.setItem('ngayTrucSetting', JSON.stringify(formData));
        handleConfirm(formData);
    };
    const onChangeDate = (prop, date) => {
        setFormData({
            ...formData,
            [prop]: {
                ...formData[prop],
                date: date ? date.format('YYYY-MM-DD') : '',
                // date: date,
                dayOfMonth: date ? date.date() : '',
                month: date ? date.month() + 1 : '',
            }
        });
    };
    function getDateString(date) {
        return date ? dayjs(date).format('YYYY-MM-DD') : '';
    }
    
    return (
        <Modal
            title="Chọn ngày trực gần nhất"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
                <Row className='mb-3'>
                    <Col span={8}><label className='mr-4'>Của em:</label></Col>
                    <Col span={16}>
                        <Row>
                            <DatePicker
                                // defaultValue={getDateString(formData?.em?.date)} 
                                onChange={date => onChangeDate('em', date)} />
                            <ColorPicker defaultValue={defaultColor.em} disabled/>
                        </Row>
                    </Col>
                </Row>

                {[1, 2, 3].map((num) => (
                    <Row className='mb-3'>
                        <Col span={8}><label className='mr-4'>Người khác {num}:</label></Col>
                        <Col span={16}>
                            <Row>
                                <DatePicker 
                                    // defaultValue={getDateString(formData[`other${num}`]?.date)} 
                                    onChange={date => onChangeDate(`other${num}`, date)} />
                                <ColorPicker defaultValue={defaultColor[`other${num}`]}
                                    disabled
                                />
                            </Row>
                        </Col>
                    </Row>
                ))}
        </Modal>
    );
}

export default SettingModel;