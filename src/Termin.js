import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import { de } from 'date-fns/locale';
import { collection, addDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

registerLocale('de', de);

function Termin() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [personalInfo, setPersonalInfo] = useState({
        vorname: '',
        nachname: '',
        email: '',
        mobiltelefon: '',
        besondereWuensche: ''
    });
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [nonWorkingDays, setNonWorkingDays] = useState([]);

    const data = [
        { price: 60, label: "Gesicht komplett - 60 CHF" },
        { price: 30, label: "Oberlippen - 30 CHF" },
        { price: 30, label: "Kinn - 30 CHF" },
        { price: 40, label: "Arme - 70 CHF" },
        { price: 60, label: "Achseln - 60 CHF" },
        { price: 40, label: "Unterbeine - 60 CHF" },
        { price: 130, label: "Ganz Körper - Erste Behandlung - 160 CHF" },
        { price: 150, label: "Ganz Körper- Weitere Behandlung - 180 CHF" }
    ];

    const allTimeSlots = [
        "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00",
        "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
        "17:00", "17:30", "18:00", "18:30", "19:00"];

    useEffect(() => {
        fetchNonWorkingDays();
        if (!isNonWorkingDay(startDate)) {
            fetchAvailableTimeSlots(formatDate(startDate));
        }
    }, [startDate]);

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const fetchNonWorkingDays = async () => {
        const docRef = doc(db, 'settings', 'nonWorkingDays');
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setNonWorkingDays(docSnap.data().days.map(day => new Date(day)));
            }
        } catch (error) {
            console.error("Error fetching non-working days: ", error);
            toast.error('Fehler beim Abrufen der arbeitsfreien Tage');
        }
    };

    const isNonWorkingDay = (date) => {
        return nonWorkingDays.some(nonWorkingDate =>
            nonWorkingDate.toDateString() === date.toDateString()
        );
    };

    const fetchAvailableTimeSlots = async (dateString) => {
        const appointmentsRef = collection(db, 'appointments');
        const q = query(appointmentsRef, where("date", "==", dateString));

        try {
            const querySnapshot = await getDocs(q);
            const bookedSlots = querySnapshot.docs.map(doc => doc.data().time);
            const available = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
            setAvailableTimeSlots(available);
        } catch (error) {
            console.error("Error fetching booked slots: ", error);
            toast.error('Fehler beim Abrufen der verfügbaren Zeitfenster');
        }
    };

    const handlePersonalInfoChange = (e) => {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
    };

    const handleOptionChange = (event) => {
        const value = event.target.value;
        setSelectedOptions(prevOptions =>
            prevOptions.includes(value)
                ? prevOptions.filter(option => option !== value)
                : [...prevOptions, value]
        );
    };

    const handleTimeClick = (time) => {
        setSelectedTime(time);
    };

    const handleDateChange = (date) => {
        setStartDate(date);
        setSelectedTime(null); // Reset selected time when date changes
        if (!isNonWorkingDay(date)) {
            fetchAvailableTimeSlots(formatDate(date));
        } else {
            setAvailableTimeSlots([]);
        }
    };

    const handleNextStep = () => {
        if (selectedOptions.length > 0 && startDate && selectedTime) {
            setStep(2);
        } else {
            toast.warn('Bitte wählen Sie alle Optionen aus');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (personalInfo.vorname && personalInfo.nachname && personalInfo.email && personalInfo.mobiltelefon) {
            try {
                await addDoc(collection(db, 'appointments'), {
                    ...personalInfo,
                    treatments: selectedOptions,
                    date: formatDate(startDate),
                    time: selectedTime,
                    besondereWuensche: personalInfo.besondereWuensche
                });
                toast.success('Termin erfolgreich erstellt!');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } catch (error) {
                console.error("Error adding document: ", error);
                toast.error('Fehler beim Erstellen des Termins');
            }
        } else {
            toast.warn('Bitte füllen Sie alle Felder aus');
        }
    };

    return (
        <>
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={true} />
            <section className='webkit'>
                <div className='max-w-[450px] bg-[#d2cac7] rounded text-center my-12 py-6 mx-4'>
                    <h1 className='text-2xl text-start pl-4 font-body'>Termin machen</h1>

                    {step === 1 ? (
                        <>
                            {/* Treatment selection */}
                            <div className='my-4'>
                                <p className='text-start pl-4 font-body'>
                                    Wählen Sie Behandlungen
                                </p>
                                <div className='flex flex-col items-start pl-4'>
                                    {data.map((option) => (
                                        <label key={option.label} className='inline-flex items-center mt-2'>
                                            <input
                                                type="checkbox"
                                                value={option.label}
                                                checked={selectedOptions.includes(option.label)}
                                                onChange={handleOptionChange}
                                                className='form-checkbox h-5 w-5 text-blue-600'
                                            />
                                            <span className='ml-2 text-gray-700'>{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Date selection */}
                            <div className='my-10 table'>
                                <p className='text-start pl-4 font-body mb-2'>
                                    Wählen Sie eine Datum
                                </p>
                                <DatePicker
                                    locale={de}
                                    selected={startDate}
                                    onChange={handleDateChange}
                                    toggleCalendarOnIconClick
                                    className='rounded ml-6 p-2'
                                    filterDate={date => !isNonWorkingDay(date)}
                                    minDate={new Date()}
                                />
                            </div>

                            {/* Time selection */}
                            <div className='my-4'>
                                <p className='text-start pl-4 font-body'>
                                    Wählen Sie eine Zeit
                                </p>
                                <div className='flex flex-wrap justify-center'>
                                    {availableTimeSlots.map((time) => (
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

                            <button onClick={handleNextStep} className='text-white bg-[#CD7E6D] hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 mr-2 '>
                                Weiter
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className='flex flex-col items-end pl-4 pr-4'>
                            {/* Personal information form fields */}
                            <input
                                type="text"
                                name="vorname"
                                placeholder="Vorname"
                                value={personalInfo.vorname}
                                onChange={handlePersonalInfoChange}
                                className='w-full p-2 mt-2 rounded'
                            />
                            <input
                                type="text"
                                name="nachname"
                                placeholder="Nachname"
                                value={personalInfo.nachname}
                                onChange={handlePersonalInfoChange}
                                className='w-full p-2 mt-2 rounded'
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="E-Mail"
                                value={personalInfo.email}
                                onChange={handlePersonalInfoChange}
                                className='w-full p-2 mt-2 rounded'
                            />
                            <input
                                type="tel"
                                name="mobiltelefon"
                                placeholder="Mobiltelefon"
                                value={personalInfo.mobiltelefon}
                                onChange={handlePersonalInfoChange}
                                className='w-full p-2 mt-2 rounded'
                            />
                            <textarea
                                name="besondereWuensche"
                                placeholder="Besondere Wünsche"
                                value={personalInfo.besondereWuensche}
                                onChange={handlePersonalInfoChange}
                                className='w-full p-2 mt-2 rounded'
                            />
                            <button type="submit" className='text-white bg-[#CD7E6D] hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-4'>
                                Termin bestätigen
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </>
    );
}

export default Termin;