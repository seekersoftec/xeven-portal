// import styled from 'styled-components'

// import React, { useState } from 'react'
// import { useAuth } from '../../context/AuthContext'
// import { ScreenTypes } from '../../types'
// import { useQuiz } from '../../context/QuizContext'

// import { device } from '../../styles/BreakPoints'
// import {
//   CenterCardContainer,
//   HighlightedText,
//   LogoContainer,
//   PageCenter,
// } from '../../styles/Global'

// import Button from '../ui/Button'
// import TickButton from '../ui/TickButton'
// import { AppLogo } from '../../config/icons'

// const Heading = styled.h2`
//   font-size: 32px;
//   font-weight: 700;
//   margin-bottom: 20px;
//   text-align: center;
// `

// const DetailText = styled.p`
//   font-weight: 500;
//   font-size: 20px;
//   line-height: 29px;
//   text-align: center;
// `

// const SelectButtonContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: center;
//   max-width: 60%;
//   gap: 30px;
//   margin-top: 40px;
//   margin-bottom: 45px;
//   @media ${device.md} {
//     row-gap: 20px;
//     column-gap: 20px;
//     max-width: 100%;
//   }
// `

// interface SelectButtonProps {
//   active: boolean
//   disabled?: boolean
// }

// const SelectButton = styled.div<SelectButtonProps>`
//   background-color: ${({ disabled, theme }) =>
//     disabled ? `${theme.colors.disabledCard}` : `${theme.colors.selectTopicBg}`};
//   border: ${({ active, theme }) =>
//     active
//       ? `2px solid ${theme.colors.themeColor}`
//       : `1px solid ${theme.colors.disabledButton}`};
//   transition: background-color 0.4s ease-out;
//   border-radius: 10px;
//   padding: 14px 10px;
//   display: flex;
//   align-items: center;
//   cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
//   @media ${device.md} {
//     padding: 10px;
//     tap-highlight-color: transparent;
//     -webkit-tap-highlight-color: transparent;
//   }
// `

// const SelectButtonText = styled.span`
//   font-size: 18px;
//   font-weight: 600;
//   margin-left: 10px;
//   @media ${device.md} {
//     font-size: 16px;
//     font-weight: 500;
//   }
// `

// const AuthScreen: React.FC = () => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [isLogin, setIsLogin] = useState(true)
//   const { login, signup, error } = useAuth()
//   const { setCurrentScreen } = useQuiz()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       if (isLogin) {
//         await login(email, password)
//       } else {
//         await signup(email, password)
//       }
//       setCurrentScreen(ScreenTypes.QuizTopicsScreen)
//     } catch (err) {
//       alert('Failed to authenticate')
//       console.error(err)
//     }
//   }

//   return (
//     <PageCenter light justifyCenter>
//       <CenterCardContainer>
//         <LogoContainer>
//           <AppLogo />
//         </LogoContainer>
//         <Heading>{isLogin ? 'Login' : 'Signup'}</Heading>
//         {error && <DetailText color="red">{error}</DetailText>}
//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             required
//           />
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             required
//           />
//           <button type="submit">Login</button>
//           {/* <button type="submit">{isLogin ? 'Login' : 'Signup'}</button> */}
//         </form>

//         <br />
//         <br />
//         <br />

//         {/* <Button
//           text={isLogin ? 'Switch to Signup' : 'Switch to Login'}
//           onClick={() => setIsLogin(!isLogin)}
//           bold
//         /> */}
//       </CenterCardContainer>
//     </PageCenter>
//   )
// }

// export default AuthScreen
