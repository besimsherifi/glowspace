import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { collection, getDocs, query, where, getDoc, setDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [appointments, setAppointments] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [nonWorkingDays, setNonWorkingDays] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsLoggedIn(true);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const fetchAppointments = async () => {
            const querySnapshot = await getDocs(collection(db, 'appointments'));
            const allAppointments = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert the date string to a Date object if it's a string
                date: doc.data().date.seconds ?
                    new Date(doc.data().date.seconds * 1000) :
                    new Date(doc.data().date)
            }));

            // Sort appointments by date
            allAppointments.sort((a, b) => a.date - b.date);

            // Group appointments by month and year
            const groupedAppointments = allAppointments.reduce((acc, appointment) => {
                // Format the month and year
                const monthYear = appointment.date.toLocaleString('de-DE', {
                    month: 'long',
                    year: 'numeric'
                });

                if (!acc[monthYear]) {
                    acc[monthYear] = [];
                }
                acc[monthYear].push(appointment);
                return acc;
            }, {});

            setAppointments(groupedAppointments);
        };

        const fetchNonWorkingDays = async () => {
            const docRef = doc(db, 'settings', 'nonWorkingDays');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setNonWorkingDays(docSnap.data().days.map(day => new Date(day)));
            }
        };

        fetchAppointments();
        fetchNonWorkingDays();
    }, []);

    const handleDeleteAppointment = (monthYear, appointmentIndex, appointmentId) => {
        const ConfirmDeleteToast = () => (
            <div>
                <p>Sind Sie sicher, dass Sie diesen Termin löschen möchten?</p>
                <div className="mt-2">
                    <button
                        onClick={() => confirmDeletion(monthYear, appointmentIndex, appointmentId)}
                        className="text-white bg-red-500 hover:bg-red-700 py-1 px-3 rounded"
                    >
                        Bestätigen
                    </button>
                    <button
                        onClick={() => cancelDeletion()}
                        className="ml-2 text-white bg-gray-500 hover:bg-gray-700 py-1 px-3 rounded"
                    >
                        Abbrechen
                    </button>
                </div>
            </div>
        );

        toast(<ConfirmDeleteToast />, {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            closeButton: false
        });
    };

    const confirmDeletion = async (monthYear, appointmentIndex, appointmentId) => {
        try {
            await deleteDoc(doc(db, 'appointments', appointmentId));

            const updatedAppointments = { ...appointments };
            updatedAppointments[monthYear].splice(appointmentIndex, 1);

            if (updatedAppointments[monthYear].length === 0) {
                delete updatedAppointments[monthYear];
            }

            setAppointments(updatedAppointments);
            toast.dismiss();
            toast.success('Termin erfolgreich gelöscht.');
        } catch (error) {
            toast.error('Fehler beim Löschen des Termins.');
            console.error('Error deleting document: ', error);
        }
    };

    const cancelDeletion = () => {
        toast.dismiss();
    };

    const handleDateChange = async (date) => {
        setSelectedDate(date);
        // Ensure we're using the local date without time zone issues
        const dateString = date.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD

        try {
            const docRef = doc(db, 'settings', 'nonWorkingDays');
            const docSnap = await getDoc(docRef);

            let updatedNonWorkingDays;
            if (docSnap.exists()) {
                updatedNonWorkingDays = docSnap.data().days || [];
            } else {
                updatedNonWorkingDays = [];
            }

            const index = updatedNonWorkingDays.indexOf(dateString);
            if (index > -1) {
                // Date is currently non-working, remove it (set as working)
                updatedNonWorkingDays.splice(index, 1);
                toast.success(`${dateString} wurde als Arbeitstag festgelegt.`);
            } else {
                // Date is currently working, add it (set as non-working)
                updatedNonWorkingDays.push(dateString);
                toast.success(`${dateString} wurde als arbeitsfreier Tag festgelegt.`);
            }

            await setDoc(docRef, { days: updatedNonWorkingDays });

            // Update the state with new Date objects
            setNonWorkingDays(updatedNonWorkingDays.map(day => new Date(day)));
        } catch (error) {
            console.error("Error updating non-working days: ", error);
            toast.error('Fehler beim Aktualisieren der arbeitsfreien Tage.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto xxl:h-screen lg:py-0">
            <ToastContainer />
            {isLoggedIn ? (
                <div className="w-full bg-green-100 rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-green-700">Glückwunsch!</h2>
                    <p>Sie haben sich erfolgreich angemeldet.</p>

                    <div className="mt-4">
                        <h3 className="text-xl font-bold mb-2">Arbeitstage verwalten</h3>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            className="p-2 border rounded"
                            dateFormat="dd.MM.yyyy"
                            highlightDates={nonWorkingDays}
                            customInput={
                                <button className="bg-blue-500 text-white p-2 rounded">
                                    {selectedDate ? selectedDate.toLocaleDateString() : 'Datum auswählen'}
                                </button>
                            }
                        />
                        <p className="mt-2 text-sm text-gray-600">
                            Klicken Sie auf ein Datum, um es als arbeitsfreien Tag festzulegen oder zu entfernen.
                            Hervorgehobene Daten sind arbeitsfreie Tage.
                        </p>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-xl font-bold">Alle Termine</h3>
                        {Object.entries(appointments).length > 0 ? (
                            <div className="space-y-6">
                                {Object.entries(appointments)
                                    .sort(([monthYearA], [monthYearB]) => {
                                        // Convert month year strings to dates for sorting
                                        const dateA = new Date(monthYearA.replace(/(\w+)\s(\d+)/, '$2-$1-01'));
                                        const dateB = new Date(monthYearB.replace(/(\w+)\s(\d+)/, '$2-$1-01'));
                                        return dateA - dateB;
                                    })
                                    .map(([monthYear, monthAppointments]) => (
                                        <div key={monthYear} className="bg-white rounded-lg shadow-md p-4">
                                            <h4 className="text-xl font-semibold text-blue-600 mb-3">{monthYear}</h4>
                                            <div className="grid gap-4">
                                                {monthAppointments.map((appointment, index) => (
                                                    <div key={appointment.id} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-grow">
                                                                <p className="font-semibold">
                                                                    {appointment.vorname} {appointment.nachname}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    {new Intl.DateTimeFormat('de-DE', {
                                                                        day: '2-digit',
                                                                        month: '2-digit',
                                                                        year: 'numeric'
                                                                    }).format(appointment.date)} - {appointment.time}
                                                                </p>
                                                                <p className="text-sm mt-1">
                                                                    <span className="font-medium">Behandlung:</span> {appointment.treatments.join(', ')}
                                                                </p>
                                                                <p className="text-sm">
                                                                    <span className="font-medium">Telefon:</span> {appointment.mobiltelefon}
                                                                </p>
                                                                {appointment.besondereWuensche && (
                                                                    <p className="text-sm mt-2 italic">
                                                                        "{appointment.besondereWuensche}"
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteAppointment(monthYear, index, appointment.id)}
                                                                className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium"
                                                            >
                                                                Löschen
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 italic">Keine Termine gefunden.</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                            Melden Sie sich bei Ihrem Konto an
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">E-Mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-700 border border-gray-600 text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="name@email.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-700 border border-gray-600 text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Anmelden
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginComponent;