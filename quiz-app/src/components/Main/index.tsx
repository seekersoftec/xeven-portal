// src/components/Main.tsx
import React, { useEffect } from 'react'
import { useQuiz } from '../../context/QuizContext'
import { useAuth } from '../../context/AuthContext'
import { ScreenTypes } from '../../types'
import QuestionScreen from '../QuestionScreen'
import QuizDetailsScreen from '../QuizDetailsScreen'
import QuizTopicsScreen from '../QuizTopicsScreen'
import ResultScreen from '../ResultScreen'
import SplashScreen from '../SplashScreen'
import AuthScreen from '../AuthScreen'

const Main: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useQuiz()
  const { currentUser } = useAuth()

  useEffect(() => {
    setTimeout(() => {
      setCurrentScreen(
        currentUser ? ScreenTypes.QuizTopicsScreen : ScreenTypes.AuthScreen
      )
    }, 1000)
  }, [setCurrentScreen, currentUser])

  const screenComponents = {
    [ScreenTypes.SplashScreen]: <SplashScreen />,
    [ScreenTypes.AuthScreen]: <AuthScreen />,
    [ScreenTypes.QuizTopicsScreen]: <QuizTopicsScreen />,
    [ScreenTypes.QuizDetailsScreen]: <QuizDetailsScreen />,
    [ScreenTypes.QuestionScreen]: <QuestionScreen />,
    [ScreenTypes.ResultScreen]: <ResultScreen />,
  }

  const ComponentToRender = screenComponents[currentScreen] || <SplashScreen />

  return <>{ComponentToRender}</>
}

export default Main
