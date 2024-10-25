import { Navigate } from 'react-router-dom';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import GlobalStyles from "./styles/global"
import Home from "./pages/Home"
import CadastrarDenuncia from "./pages/services/services"
import Forum from "./pages/Forum/forum"


function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
       <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cadastro' element={<CadastrarDenuncia/>}/>
        <Route path='/forum' element={<Forum/>}/>
        <Route path='/sobre' element={<Navigate to="/forum#sobre" />} />
        
       </Routes>
    </BrowserRouter>
  )
}

export default App
