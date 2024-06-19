// import styled from 'styled-components'
// import React, { useState } from 'react'
// import { useAuth } from '../../context/AuthContext'
// import { ScreenTypes } from '../../types'
// import { useQuiz } from '../../context/QuizContext'

// import { CenterCardContainer, LogoContainer, PageCenter } from '../../styles/Global'

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
//   color: ${({ color }) => color || 'black'};
// `

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 15px;
//   width: 100%;
// `

// const Input = styled.input`
//   width: 100%;
//   padding: 10px;
//   border: 1px solid ${({ theme }) => theme.colors.themeColor};
//   border-radius: 5px;
//   font-size: 16px;

//   &:focus {
//     border-color: ${({ theme }) => theme.colors.themeColor};
//     outline: none;
//   }
// `

// const SubmitButton = styled.button`
//   width: 100%;
//   padding: 10px;
//   background-color: ${({ theme }) => theme.colors.buttonBackground};
//   color: ${({ theme }) => theme.colors.themeGradient};
//   border: none;
//   border-radius: 5px;
//   font-size: 16px;
//   cursor: pointer;
//   transition: background-color 0.3s;

//   &:hover {
//     background-color: ${({ theme }) => theme.colors.dark};
//   }
// `

// const SwitchButton = styled.button`
//   background: none;
//   border: none;
//   color: ${({ theme }) => theme.colors.themeGradient};
//   cursor: pointer;
//   font-size: 14px;
//   margin-top: 10px;

//   &:hover {
//     text-decoration: underline;
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
//         <Form onSubmit={handleSubmit}>
//           <Input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             required
//           />
//           <Input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             required
//           />
//           <SubmitButton type="submit">{isLogin ? 'Login' : 'Signup'}</SubmitButton>
//         </Form>
//         <SwitchButton onClick={() => setIsLogin(!isLogin)}>
//           {isLogin ? 'Switch to Signup' : 'Switch to Login'}
//         </SwitchButton>
//       </CenterCardContainer>
//     </PageCenter>
//   )
// }

// export default AuthScreen
