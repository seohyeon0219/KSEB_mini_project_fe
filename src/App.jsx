import './App.css';
import './styles/global.css';
import './styles/reset.css';
import './styles/variables.css';
import './styles/page-common.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home/Home';
import Sign from './pages/sign/Sign';
import SignIn from './pages/sign-in/SignIn';
import SignUp from './pages/sign-up/SignUp';
import Inquiry from './pages/inquiry/Inquiry';
import AboutUs from './pages/about-us/AboutUs';
import ContactUs from './pages/contact-us/ContactUs';
import Solution from './pages/solution/Solution';
import Prediction from './pages/prediction/Prediction';
import Upload from './pages/upload/Upload';
import FindCode from './pages/find-code/FindCode';
import MyPage from './pages/my-page/MyPage';
import Result from './pages/result/Result';


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/sign' element={<Sign />}/>
        <Route path='/sign-in' element={<SignIn />}/>
        <Route path='/sign-up' element={<SignUp />}/>
        <Route path='/inquiry' element={<Inquiry />}/>
        <Route path='/about-us' element={<AboutUs />}/>
        <Route path='/contact-us' element={<ContactUs />}/>
        <Route path='/solution' element={<Solution />}/>
        <Route path='/prediction' element={<Prediction />}/>
        <Route path='/upload' element={<Upload />}/>
        <Route path='/find-code' element={<FindCode />}/>
        <Route path='/my-page' element={<MyPage/>}/>
        <Route path='/result' element={<Result />}/>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App;