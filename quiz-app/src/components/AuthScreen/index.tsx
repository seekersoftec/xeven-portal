import styled from 'styled-components'
import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { ScreenTypes } from '../../types'
import { useQuiz } from '../../context/QuizContext'

import { CenterCardContainer, LogoContainer, PageCenter } from '../../styles/Global'

import { AppLogo } from '../../config/icons'
import { device } from '../../styles/BreakPoints'
import { ButtonType } from '../ui/Button/styled'

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
`

const DetailText = styled.p`
  font-weight: 500;
  font-size: 20px;
  line-height: 29px;
  text-align: center;
  color: ${({ color }) => color || 'black'};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.themeColor};
  border-radius: 5px;
  font-size: 16px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.themeColor};
    outline: none;
  }
`

const SubmitButton = styled.button.attrs(({ outline, bold, big }: ButtonType) => ({
  outline,
  bold,
  big,
}))`
  width: 195px;
  min-height: 50px;
  color: ${({ theme, outline }) =>
    outline ? theme.colors.outlineButtonText : theme.colors.buttonText};
  background: ${({ theme, outline }) =>
    outline ? theme.colors.cardBackground : theme.colors.buttonBackground};
  font-size: clamp(16px, 5vw, 24px);
  border: 1px solid
    ${({ theme, outline }) => (!outline ? 'none' : theme.colors.themeColor)};
  font-weight: ${({ bold }) => (bold ? '700' : '400')};
  border-radius: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media ${device.md} {
    width: ${({ big }) => (big ? '180px' : '150px')};
    min-height: 40px;
    tap-highlight-color: transparent;
    -webkit-tap-highlight-color: transparent;
  }

  &:active {
    transform: scale(0.98);
    box-shadow: ${({ theme }) => theme.shadows.activeButton};
    transition: 0.2s all;
  }
  &:disabled {
    background: ${({ theme }) => theme.colors.disabledButton};
    color: ${({ theme }) => theme.colors.darkGray};
    cursor: not-allowed;
    transform: unset;
    box-shadow: unset;
  }
`

const SwitchButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.themeGradient};
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }
`

const AuthScreen: React.FC = () => {
  const [studentID, setStudentID] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const { login, signup, error } = useAuth()
  const { setCurrentScreen } = useQuiz()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await login(studentID, password)

        error
          ? setCurrentScreen(ScreenTypes.QuizTopicsScreen)
          : setCurrentScreen(ScreenTypes.AuthScreen)
      }
      //   if (!loggedIn) {
      //     throw new Error('Login Failed')
      // setCurrentScreen(ScreenTypes.QuizTopicsScreen)
      //   }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <PageCenter light justifyCenter>
      <CenterCardContainer>
        <LogoContainer>
          <AppLogo />
        </LogoContainer>
        <Heading>{isLogin ? 'Login' : 'Signup'}</Heading>
        {error && <DetailText color="red">{error}</DetailText>}
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
            placeholder="StudentID (Email, etc)"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <SubmitButton type="submit">{isLogin ? 'Login' : 'Signup'}</SubmitButton>
        </Form>
        {/* <SwitchButton onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Switch to Signup' : 'Switch to Login'}
        </SwitchButton> */}
      </CenterCardContainer>
    </PageCenter>
  )
}

export default AuthScreen
