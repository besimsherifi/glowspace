import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import { de } from 'date-fns/locale';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './Firebase';

registerLocale('de', de);

function Termin() {
    const data = [
        { price: 40, label: "Gesicht komplett - 40 CHF" },
        { price: 20, label: "Oberlippen - 20 CHF" },
        { price: 40, label: "Kinn - 40 CHF" },
        { price: 40, label: "Achseln - 40 CHF" },
        { price: 40, label: "Unterbeine - 40 CHF" },
        { price: 50, label: "Bikinizone - 50 CHF" },
        { price: 130, label: "Ganz Körper - Erste Behandlung - 130 CHF" },
        { price: 150, label: "Ganz Körper- Weitere Behandlung - 150 CHF" }
    ];

    const [selectedOption, setSelectedOption] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);

    const timeSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleTimeClick = (time) => {
        setSelectedTime(time);
    };

    const handleSubmit = async () => {
        if (selectedOption && startDate && selectedTime) {
            try {
                await addDoc(collection(db, 'appointments'), {
                    treatment: selectedOption,
                    date: startDate,
                    time: selectedTime
                });
                alert('Termin erfolgreich erstellt!');
            } catch (error) {
                console.error('Error adding document: ', error);
                alert('Fehler beim Erstellen des Termins');
            }
        } else {
            alert('Bitte wählen Sie alle Optionen aus');
        }
    };

    return (
        <section className='webkit'>
            <div className='max-w-[450px] bg-[#d2cac7] rounded text-center my-12 py-6 mx-4'>
                <h1 className='text-2xl text-start pl-4 font-body'>Termin machen</h1>

                <div className='my-4'>
                    <p className='text-start pl-4 font-body'>
                        Wählen Sie eine Behandlung
                    </p>
                    <select value={selectedOption} onChange={handleChange} className='my-2 p-2 rounded mx-2 webkit-fill'>
                        <option value="" disabled>Wählen Sie eine Behandlung</option>
                        {data.map((option) => (
                            <option key={option.label} value={option.label}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='my-10 table'>
                    <p className='text-start pl-4 font-body mb-2'>
                        Wählen Sie eine Datum
                    </p>
                    <DatePicker
                        locale={de}
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        toggleCalendarOnIconClick
                        className='rounded ml-6 p-2'
                    />
                </div>

                <div className='my-4'>
                    <p className='text-start pl-4 font-body'>
                        Wählen Sie eine Zeit
                    </p>
                    <div className='flex flex-wrap justify-center'>
                        {timeSlots.map((time) => (
                            <button
                                key={time}
                                className={`m-2 p-2 border rounded ${selectedTime === time ? 'bg-blue-500 text-white' : 'border-blue-500 text-blue-500'}`}
                                onClick={() => handleTimeClick(time)}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={handleSubmit} className='text-white bg-[#CD7E6D] hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 mr-2 '>
                    Termin bestätigen
                </button>

                {/* {selectedOption && <p>You selected: {selectedOption}</p>}
                {startDate && <p>Selected date: {startDate.toLocaleDateString('de-DE', { month: '2-digit', year: 'numeric' })}</p>}
                {selectedTime && <p>Selected time: {selectedTime}</p>} */}
            </div>
        </section>
    );
}

export default Termin;
