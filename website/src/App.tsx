import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import Problem from './sections/Problem'
import Solution from './sections/Solution'
import UseCases from './sections/UseCases'
import Comparison from './sections/Comparison'
import Benefits from './sections/Benefits'
import WaysOfWorking from './sections/WaysOfWorking'
import Pricing from './sections/Pricing'
import CTA from './sections/CTA'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <UseCases />
      <Comparison />
      <Benefits />
      <WaysOfWorking />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
