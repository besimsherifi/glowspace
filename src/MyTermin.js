import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './Firebase'; // Adjust the path to your firebase.js file

function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [appointments, setAppointments] = useState([]);

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
            const allAppointments = querySnapshot.docs.map(doc => doc.data());
            setAppointments(allAppointments);
        };
        fetchAppointments();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            {isLoggedIn ? (
                <div className="w-full bg-green-100 rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-green-700">Glückwunsch!</h2>
                    <p>Sie haben sich erfolgreich angemeldet.</p>
                    <div className="mt-4">
                        <h3 className="text-xl font-bold">Alle Termine</h3>
                        {appointments.length > 0 ? (
                            <ul className="mt-2 space-y-2">
                                {appointments.map((appointment, index) => (
                                    <li key={index} className="p-2 bg-white rounded shadow">
                                        <p>Behandlung: {appointment.treatment}</p>
                                        <p>Datum: {new Date(appointment.date.seconds * 1000).toLocaleDateString('de-DE')}</p>
                                        <p>Zeit: {appointment.time}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Keine Termine gefunden.</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Melden Sie sich bei Ihrem Konto an
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-Mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@email.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Passwort</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
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
