// src/components/ui/VoiceInput.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onAppend?: boolean; // If true, appends to existing text; if false, replaces
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export default function VoiceInput({
  onTranscript,
  onAppend = true,
  className = '',
  disabled = false,
  placeholder = 'Click to speak...',
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported || disabled) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);

      if (finalTranscript) {
        onTranscript(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(getErrorMessage(event.error));
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
      // Store recognition instance for stopping
      (window as any).__speechRecognition = recognition;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Failed to start voice input');
    }
  }, [isSupported, disabled, onTranscript]);

  const stopListening = useCallback(() => {
    if ((window as any).__speechRecognition) {
      (window as any).__speechRecognition.stop();
      (window as any).__speechRecognition = null;
    }
    setIsListening(false);
  }, []);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'no-speech':
        return 'No speech detected. Please try again.';
      case 'audio-capture':
        return 'No microphone found. Please check your device.';
      case 'not-allowed':
        return 'Microphone access denied. Please allow microphone access.';
      case 'network':
        return 'Network error. Please check your connection.';
      default:
        return 'Voice input error. Please try again.';
    }
  };

  if (!isSupported) {
    return (
      <div className={`text-xs text-gray-500 ${className}`}>
        Voice input not supported in this browser
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        className={`
          p-2 rounded-lg transition-all duration-200 flex items-center gap-2
          ${isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-teal-600 hover:bg-teal-700 text-white'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={isListening ? 'Stop recording' : 'Start voice input'}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4" />
            <span className="text-sm font-medium">Stop</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span className="text-sm font-medium">Voice</span>
          </>
        )}
      </button>

      {isListening && (
        <div className="flex items-center gap-2 text-sm text-teal-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Listening...</span>
        </div>
      )}

      {transcript && isListening && (
        <span className="text-sm text-gray-400 italic truncate max-w-[200px]">
          "{transcript}"
        </span>
      )}

      {error && (
        <span className="text-sm text-red-400">{error}</span>
      )}
    </div>
  );
}

// Inline voice button for use inside input fields
export function VoiceInputButton({
  onTranscript,
  disabled = false,
  size = 'sm',
}: {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!isSupported || disabled) return;

    if (isListening) {
      // Stop listening
      if ((window as any).__speechRecognition) {
        (window as any).__speechRecognition.stop();
        (window as any).__speechRecognition = null;
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      onTranscript(result.trim());
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    try {
      recognition.start();
      (window as any).__speechRecognition = recognition;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
    }
  }, [isSupported, disabled, isListening, onTranscript]);

  if (!isSupported) return null;

  const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      className={`
        ${sizeClasses} rounded-full flex items-center justify-center transition-all duration-200
        ${isListening
          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
          : 'bg-gray-600 hover:bg-teal-600 text-gray-300 hover:text-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={isListening ? 'Stop recording' : 'Voice input'}
    >
      {isListening ? (
        <MicOff className={iconSize} />
      ) : (
        <Mic className={iconSize} />
      )}
    </button>
  );
}
