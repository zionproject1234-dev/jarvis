import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Mail, UserPlus, LogIn, AlertCircle, Chrome } from 'lucide-react';
import '../App.css'; // Re-use Jarvis styling

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    scopes: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent', // Always re-prompt to guarantee calendar scope granted
                    }
                }
            });
            if (error) throw error;
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Verification email sent! Please check your inbox.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-overlay"></div>
            <motion.div
                className="auth-panel"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="auth-header">
                    <div className="biometric-scanner">
                        <Shield size={60} className="auth-icon" />
                        <div className="scan-line"></div>
                    </div>
                    <h2>J.A.R.V.I.S. SECURITY PROMPT</h2>
                    <p className="auth-subtitle">BIOMETRIC IDENTIFICATION REQUIRED</p>
                </div>

                <form onSubmit={handleAuth} className="auth-form">
                    <div className="input-group">
                        <Mail className="input-icon" size={20} />
                        <input
                            type="email"
                            placeholder="ENTER SECURE EMAIL"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className="jarvis-input"
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password"
                            placeholder="ENTER PASSCODE"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="jarvis-input"
                        />
                    </div>

                    <AnimatePresence>
                        {errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="error-message"
                            >
                                <AlertCircle size={16} />
                                <span>{errorMsg}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? 'PROCESSING...' : (isSignUp ? 'INITIALIZE CREDENTIALS' : 'AUTHORIZE ACCESS')}
                        {!loading && (isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />)}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                        <span style={{ padding: '0 10px', fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'Orbitron' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                    </div>

                    <button
                        type="button"
                        className="auth-btn"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255,255,255,0.2)' }}
                    >
                        {loading ? 'LINKING...' : 'SYNC GOOGLE CORE'}
                        <Chrome size={18} />
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isSignUp ? "ALREADY AUTHORIZED?" : "NEW OPERATIVE?"}
                        <button
                            type="button"
                            className="switch-mode-btn"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setErrorMsg(null);
                            }}
                        >
                            {isSignUp ? 'INITIATE LOGIN' : 'REQUEST CLEARANCE'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
