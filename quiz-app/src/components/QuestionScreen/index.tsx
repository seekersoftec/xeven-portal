import { FC, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { AppLogo, CheckIcon, Next, TimerIcon } from '../../config/icons'
import { useQuiz } from '../../context/QuizContext'
import { useTimer, useVoice, useVoiceCommand } from '../../hooks'
import { device } from '../../styles/BreakPoints'
import { PageCenter } from '../../styles/Global'
import { ScreenTypes } from '../../types'

import Button from '../ui/Button'
import ModalWrapper from '../ui/ModalWrapper'
import Question from './Question'
import QuizHeader from './QuizHeader'
import { MicIcon, MicOffIcon } from '../ui/Icons'
import { Question as QuestionType } from '../../data/QuizQuestions'
import { useHotkeys } from 'react-hotkeys-hook'

const QuizContainer = styled.div<{ selectedAnswer: boolean }>`
  width: 900px;
  min-height: 500px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 4px;
  padding: 30px 60px 80px 60px;
  margin-bottom: 70px;
  position: relative;
  @media ${device.md} {
    width: 100%;
    padding: 15px 15px 80px 15px;
  }
  button {
    span {
      svg {
        path {
          fill: ${({ selectedAnswer, theme }) =>
            selectedAnswer ? `${theme.colors.buttonText}` : `${theme.colors.darkGray}`};
        }
      }
    }
  }
`

const LogoContainer = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  @media ${device.md} {
    margin-top: 10px;
    margin-bottom: 20px;
    svg {
      width: 185px;
      height: 80px;
    }
  }
`

const ButtonWrapper = styled.div`
  position: absolute;
  right: 60px;
  bottom: 30px;
  display: flex;
  gap: 20px;
  @media ${device.sm} {
    justify-content: flex-end;
    width: 90%;
    right: 15px;
  }
`

function formatQuestion(questionNumber: number, question: QuestionType): string {
  // string | Array<string> |
  let formattedChoices = ''

  switch (question.type) {
    case 'boolean':
      formattedChoices = question.choices.join(' OR ')
      break
    case 'MAQs':
      formattedChoices = question.choices.join('  ')
      break
    case 'MCQs':
      formattedChoices = question.choices.join('  ')
      break
    default:
      formattedChoices = question.choices.join('  ')
  }

  const result = `Question ${questionNumber + 1}: ${question.question} 
  
                  ${formattedChoices}

                  `
  return result
}

const QuestionScreen: FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([])
  const [showTimerModal, setShowTimerModal] = useState<boolean>(false)
  const [showResultModal, setShowResultModal] = useState<boolean>(false)

  const {
    questions,
    quizDetails,
    result,
    setResult,
    setCurrentScreen,
    timer,
    setTimer,
    setEndTime,
    voiceMode,
  } = useQuiz()

  const currentQuestion = questions[activeQuestion]

  const { question, type, choices, code, image, correctAnswers } = currentQuestion

  const onClickNext = useCallback(() => {
    const isMatch: boolean =
      selectedAnswer.length === correctAnswers.length &&
      selectedAnswer.every((answer) => correctAnswers.includes(answer))

    // adding selected answer, and if answer matches key to result array with current question
    setResult([...result, { ...currentQuestion, selectedAnswer, isMatch }])

    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1)
    } else {
      // how long does it take to finish the quiz
      const timeTaken = quizDetails.totalTime - timer
      setEndTime(timeTaken)
      setShowResultModal(true)
    }
    setSelectedAnswer([])
  }, [
    selectedAnswer,
    correctAnswers,
    setResult,
    result,
    currentQuestion,
    activeQuestion,
    questions.length,
    quizDetails.totalTime,
    timer,
    setEndTime,
  ])

  const handleAnswerSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target

    if (type === 'MAQs') {
      if (selectedAnswer.includes(name)) {
        setSelectedAnswer((prevSelectedAnswer) =>
          prevSelectedAnswer.filter((element) => element !== name)
        )
      } else {
        setSelectedAnswer((prevSelectedAnswer) => [...prevSelectedAnswer, name])
      }
    }

    if (type === 'MCQs' || type === 'boolean') {
      if (checked) {
        setSelectedAnswer([name])
      }
    }
  }

  const handleModal = () => {
    setCurrentScreen(ScreenTypes.ResultScreen)
    document.body.style.overflow = 'auto'
  }

  // to prevent scrolling when modal is opened
  useEffect(() => {
    if (showTimerModal || showResultModal) {
      document.body.style.overflow = 'hidden'
    }
  }, [showTimerModal, showResultModal])

  // setIsKeyPressed(isHotkeyPressed('space'))
  // console.log('useHotkeys: ', isKeyPressed)

  // timer hooks, handle conditions related to time
  useTimer(timer, quizDetails, setEndTime, setTimer, setShowTimerModal, showResultModal)

  console.log('voiceMode: ', voiceMode)
  // voice hooks, handle conditions related to voice and speech

  // useVoice() | useVoiceCommand()
  const { transcript, isListening, handleOnRecord, speak, listen } = useVoice()

  console.log('isListening: ', isListening)

  useEffect(() => {
    if (transcript.length > 0) {
      // Handle voice commands here
      console.log('transcript: ', transcript)
      speak(transcript)

      // For example, you can use a switch statement to handle different voice commands
      switch (transcript) {
        case 'next':
          console.log('Voice command: next')

          onClickNext()
          speak(formatQuestion(activeQuestion + 1, questions[activeQuestion + 1]))
          break
        // case 'previous':
        //   // Handle previous question voice command
        //   break
        case 'repeat':
          console.log('Voice command: repeat')
          speak(formatQuestion(activeQuestion, currentQuestion))
          break
        default:
          // Handle unknown voice command
          console.log('Unknown voice command')
          speak('Unknown voice command')
          break
      }

      speak(formatQuestion(activeQuestion, currentQuestion))
    }
  }, [activeQuestion, currentQuestion, onClickNext, questions, speak, transcript])

  // shortcut for voice
  useHotkeys('space', () => {
    listen(true)
    handleOnRecord()
    // listen(false)
  })

  return (
    <PageCenter>
      <LogoContainer>
        <AppLogo />
      </LogoContainer>
      <QuizContainer selectedAnswer={selectedAnswer.length > 0}>
        <QuizHeader
          activeQuestion={activeQuestion}
          totalQuestions={quizDetails.totalQuestions}
          timer={timer}
        />
        <Question
          question={question}
          code={code}
          image={image}
          choices={choices}
          type={type}
          handleAnswerSelection={handleAnswerSelection}
          selectedAnswer={selectedAnswer}
        />
        <ButtonWrapper>
          <Button
            text={activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            onClick={onClickNext}
            icon={<Next />}
            iconPosition="right"
            disabled={selectedAnswer.length === 0}
          />
        </ButtonWrapper>
        {voiceMode ? (
          <Button
            text={isListening ? 'Stop Listening' : 'Start Listening'}
            onClick={handleOnRecord}
            icon={isListening ? <MicIcon /> : <MicOffIcon />}
            iconPosition="right"
          />
        ) : (
          ''
        )}
      </QuizContainer>
      {/* timer or finish quiz modal*/}
      {(showTimerModal || showResultModal) && (
        <ModalWrapper
          title={showResultModal ? 'Done!' : 'Your time is up!'}
          subtitle={`You have attempted ${result.length} questions in total.`}
          onClick={handleModal}
          icon={showResultModal ? <CheckIcon /> : <TimerIcon />}
          buttonTitle="SHOW RESULT"
        />
      )}
    </PageCenter>
  )
}

export default QuestionScreen
