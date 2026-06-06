// ==UserScript==
// @name         Spotify Web Ultimate Background Keeper (Ironclad V5.4 - Apex)
// @namespace    spotify-background-ironclad-5-4
// @version      5.4
// @description  Zero Latency, Keganasan Instan + Audio Defibrillator (Anti-Bisu)
// @match        *://*.spotify.com/*
// @match        http://googleusercontent.com/spotify.com/*
// @match        https://googleusercontent.com/spotify.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("[Spotify Ironclad v5.4] Mode APEX Aktif: Zero Latency & Hardware Defibrillator siap.");

    const mediaElements = new Set();
    let isUserPaused = false;
    let silentAudio = null;
    
    let lastRecordedTime = -1;
    let stuckCounter = 0;
    let isJolting = false;

    const silentWavUri = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";

    // 1. FUNGSI JANGKAR AUDIO
    function initSilentAnchor() {
        try {
            if (silentAudio) return;
            silentAudio = document.createElement('audio');
            silentAudio.src = silentWavUri;
            silentAudio.loop = true;
            silentAudio.volume = 0.001; 
            document.body.appendChild(silentAudio);
            silentAudio.play().catch(() => {});
        } catch (err) {}
    }

    // 2. NATIVE MEDIA SESSION (Prioritas OS)
    function enforceMediaSession() {
        try {
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'playing';
                if (!navigator.mediaSession.metadata) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: 'Spotify Premium (Active)',
                        artist: 'Ironclad V5.4 Apex',
                        album: 'Zero Latency Mode'
                    });
                }
            }
        } catch (e) {}
    }

    // 3. AUDIO DEFIBRILLATOR (Solusi Bug Bisu Tanpa Reload)
    // Memaksa browser menyambung ulang jalur hardware audio ke Android secara instan
    function wakeUpAudioHardware(media) {
        try {
            if (media && !media.muted) {
                media.muted = true;  // Putus paksa
                media.muted = false; // Sambung paksa seketika
            }
        } catch (e) {}
    }

    // 4. HOOKING MEDIA DENGAN SAFETY NET & KEJUT HARDWARE
    try {
        const originalPlay = HTMLMediaElement.prototype.play;
        const originalPause = HTMLMediaElement.prototype.pause;

        HTMLMediaElement.prototype.play = function() {
            try {
                if (this !== silentAudio) {
                    mediaElements.add(this);
                    isUserPaused = false;
                    stuckCounter = 0;
                    
                    wakeUpAudioHardware(this); // Sengat hardware setiap kali lagu diputar
                    
                    if (silentAudio && silentAudio.paused) silentAudio.play().catch(()=>{});
                    enforceMediaSession();
                }
            } catch(e){}
            return originalPlay.apply(this, arguments);
        };

        HTMLMediaElement.prototype.pause = function() {
            try {
                if (this !== silentAudio) {
                    if (document.visibilityState === 'visible' && !isJolting) {
                        isUserPaused = true;
                        if (silentAudio) silentAudio.pause();
                        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
                        console.log("[Spotify Ironclad] Pause manual oleh user.");
                    }
                }
            } catch(e){}
            return originalPause.apply(this, arguments);
        };
    } catch (globalHookError) {}

    // 5. WEB WORKER ENGINE (Detak Jantung Abadi)
    let worker = null;
    try {
        const workerCode = `
            let timer = null;
            self.onmessage = function(e) {
                if (e.data === 'start' && !timer) {
                    timer = setInterval(() => { self.postMessage('heartbeat'); }, 4000);
                }
            };
        `;
        worker = new Worker(URL.createObjectURL(new Blob([workerCode], { type: 'application/javascript' })));
        worker.onmessage = () => triggerSmartRecovery();
        worker.postMessage('start');
    } catch (workerError) {
        setInterval(triggerSmartRecovery, 4000);
    }

    // 6. LOGIKA PEMULIHAN INSTAN & RADAR ANTI-MACET
    function triggerSmartRecovery() {
        try {
            if (isUserPaused) return;
            if (!silentAudio) initSilentAnchor();

            const playButton = document.querySelector('button[data-testid="control-button-play"]');
            
            // Eksekusi Instan (Tanpa SetTimeout)
            if (playButton) {
                playButton.click();
                if (silentAudio && silentAudio.paused) silentAudio.play().catch(()=>{});
                enforceMediaSession();
                return;
            }

            let activeMedia = null;
            mediaElements.forEach(m => { if (!m.paused && m.duration > 0) activeMedia = m; });

            if (activeMedia) {
                if (activeMedia.currentTime === lastRecordedTime) {
                    stuckCounter++;
                    
                    if (stuckCounter >= 1) {
                        console.log("[Spotify Ironclad] Audio macet! Melakukan Serangan Instan...");
                        isJolting = true;
                        
                        // EKSEKUSI SINKRON (0 Latency)
                        const pauseBtn = document.querySelector('button[data-testid="control-button-pause"]');
                        if (pauseBtn) pauseBtn.click();
                        else activeMedia.pause();
                        
                        // Langsung hajar play di milidetik yang sama, ditambah sengatan hardware
                        const newPlayBtn = document.querySelector('button[data-testid="control-button-play"]');
                        if (newPlayBtn) newPlayBtn.click();
                        else activeMedia.play().catch(()=>{});
                        
                        wakeUpAudioHardware(activeMedia); // Sengat jalur audio OS
                        
                        isJolting = false;
                        stuckCounter = 0;
                        enforceMediaSession();
                    }
                } else {
                    lastRecordedTime = activeMedia.currentTime;
                    stuckCounter = 0;
                }
            }

            mediaElements.forEach(media => {
                if (media && media.paused && !isJolting) {
                    media.play().catch(() => {});
                    enforceMediaSession();
                }
            });
        } catch (recoveryError) {
            isJolting = false;
        }
    }

    // 7. DETEKSI INTERUPSI OS (RESPONS INSTAN)
    document.addEventListener('pause', (e) => {
        try {
            if (e.target instanceof HTMLMediaElement && e.target !== silentAudio) {
                if (!isUserPaused && document.visibilityState === 'hidden' && !isJolting) {
                    // MENGHAPUS SET-TIMEOUT: Langsung lawan balik saat OS mencoba pause
                    triggerSmartRecovery();
                }
            }
        } catch(e){}
    }, true);

    // 8. ANTI-IDLE TINGKAT TINGGI (Tanpa Timeout Visual)
    setInterval(() => {
        try {
            if (!isUserPaused && document.visibilityState === 'hidden') {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Control' }));
                
                // Trik DOM Mutation seketika tanpa setTimeout
                document.title = document.title; 
                enforceMediaSession();
                
                // Sengat perangkat keras secara berkala agar OS tidak lupa kita ada
                mediaElements.forEach(m => { if (!m.paused) wakeUpAudioHardware(m); });
            }
        } catch(e){}
    }, 60000);

})();
