import { useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const useVoiceCommand = () => {
  const recognition = SpeechRecognition
  const { transcript, resetTranscript, listening } = useSpeechRecognition()

  const [isListening, setIsListening] = useState(listening)

  const startListening = () => {
    setIsListening(listening)
    if (recognition) {
      recognition.startListening()
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stopListening()
    }
  }

  return { transcript, resetTranscript, isListening, startListening, stopListening }
}

export default useVoiceCommand

// https://blog.logrocket.com/using-the-react-speech-recognition-hook-for-voice-assistance/
// https://www.npmjs.com/package/react-speech-recognition
// https://github.com/JamesBrill/react-speech-recognition/blob/master/docs/API.md
// https://stackoverflow.com/questions/64181012/web-speech-api-speechrecognition-not-defined-when-using-react-js
