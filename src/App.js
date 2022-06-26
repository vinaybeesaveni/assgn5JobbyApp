import {Route, Switch} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Jobs from './components/Jobs'
import JobItem from './components/JobItem'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

// Replace your code here
const App = () => (
  <>
    <Switch>
      <ProtectedRoute exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/jobs" component={Jobs} />
      <ProtectedRoute exact path="/jobs/:id" component={JobItem} />
      <ProtectedRoute component={NotFound} />
    </Switch>
  </>
)

export default App
