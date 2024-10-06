import { Box } from '@chakra-ui/react'
import './App.css'
import Navbar from './Components/Navbar'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import CreatePage from './Pages/CreatePage'

function App() {

  return (
    <>
      <Box minH={"100vh"}>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/create' element={<CreatePage />} />
        </Routes>
      </Box>
    </>
  )
}

export default App