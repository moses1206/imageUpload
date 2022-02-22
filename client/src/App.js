import UploadForm from './components/UploadForm'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div>
      <ToastContainer />
      <h2>ImageUpload</h2>
      <UploadForm />
    </div>
  )
}

export default App
