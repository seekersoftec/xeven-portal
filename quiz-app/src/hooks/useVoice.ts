import { useEffect, useRef, useState } from 'react'

import { default as languageCodesData } from '../data/language-codes.json'
import { default as countryCodesData } from '../data/country-codes.json'
import { Question } from '../data/QuizQuestions'

const languageCodes: Record<string, string> = languageCodesData
const countryCodes: Record<string, string> = countryCodesData

interface QuizDetails {
  totalTime: number
}

interface IUseVoice {
  transcript: string
  isListening: boolean
  resetTranscript: () => void
  speak: (text: string) => void
  handleOnRecord: () => void
  listen: (mode: boolean) => void
  browserSupportsSpeechRecognition: boolean
  // isMicrophoneAvailable: boolean
}

const useVoice = (
  enable?: boolean,
  question?: Question,
  quizDetails?: QuizDetails
): IUseVoice => {
  // if (!enable) {
  //   return
  // }

  const recognitionRef = useRef<SpeechRecognition>()

  const [isListening, setIsListening] = useState<boolean>(false)
  const [transcript, setTranscript] = useState<string>('')
  // const [translation, setTranslation] = useState<string>()
  const [voices, setVoices] = useState<Array<SpeechSynthesisVoice>>()
  const [language, setLanguage] = useState<string>('en-GB')

  const isSpeechDetected = false

  const availableLanguages = Array.from(new Set(voices?.map(({ lang }) => lang)))
    .map((lang) => {
      const split = lang.split('-')
      const languageCode: string = split[0]
      const countryCode: string = split[1]
      return {
        lang,
        label: languageCodes[languageCode] || lang,
        dialect: countryCodes[countryCode],
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label))

  const activeLanguage = availableLanguages.find(({ lang }) => language === lang)

  const availableVoices = voices?.filter(({ lang }) => lang === language)
  const activeVoice =
    availableVoices?.find(({ name }) => name.includes('Google')) ||
    availableVoices?.find(({ name }) => name.includes('Luciana')) ||
    availableVoices?.[0]

  useEffect(() => {
    const voices = window.speechSynthesis.getVoices()
    if (Array.isArray(voices) && voices.length > 0) {
      setVoices(voices)
      return
    }
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = function () {
        const voices = window.speechSynthesis.getVoices()
        setVoices(voices)
      }
    }
  }, [])

  function handleOnRecord() {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    // speak(' ')
    // speak(question.question)

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()

    recognitionRef.current.onstart = function () {
      setIsListening(true)
    }

    recognitionRef.current.onend = function () {
      setIsListening(false)
    }

    recognitionRef.current.onresult = async function (event) {
      const transcriptResult = event.results[0][0].transcript.trim()

      setTranscript(transcriptResult)
      console.log(transcript)

      // const results = await fetch('/api/translate', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     text: transcript,
      //     language: 'pt-BR',
      //   }),
      // }).then((r) => r.json())

      // setTranslation(results.text)

      // speak(results.text)
      // speak('Answer Provided')
    }

    recognitionRef.current.start()
  }

  function speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text)

    if (activeVoice) {
      utterance.voice = activeVoice
    }

    window.speechSynthesis.speak(utterance)

    // let r = setInterval(() => {
    //   console.log(speechSynthesis.speaking)
    //   if (!speechSynthesis.speaking) {
    //     clearInterval(r)
    //   } else {
    //     speechSynthesis.resume()
    //   }
    // }, 14000)

    resetTranscript()
  }

  function resetTranscript() {
    setTranscript('')
  }

  function listen(mode: boolean) {
    setIsListening(mode)
  }

  const browserSupportsSpeechRecognition =
    !window.SpeechRecognition || !window.webkitSpeechRecognition

  return {
    speak,
    transcript,
    resetTranscript,
    isListening,
    handleOnRecord,
    listen,
    browserSupportsSpeechRecognition,
  }
}

export default useVoice
