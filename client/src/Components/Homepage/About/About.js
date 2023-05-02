import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react';
import HomeFooter from '../Footer/HomeFooter';
 function About() {
  return (
    <Fragment>
    <div className="bg-teal-100 animate-delay-{2000} px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-800">
        <p className="text-base font-semibold leading-7 text-violet">About Us</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Welcome to Solmate - Harness the Sun, Power Your Future

</h1>
        <p className="mt-6 text-xl leading-8">
        Harness the Sun, Power Your Future. we envision a sustainable tomorrow powered by the sun. We strive to make solar energy accessible to everyone, through seamless solar panel installation, expert support, and intelligent management. Our slogan, "Connecting You to a Brighter Future," reflects our commitment to providing innovative solar solutions that empower our customers and contribute to a greener world.
        </p>
        <div className="mt-10 max-w-2xl">
          <p>
          We understand that every customer is unique, which is why we have designed four different dashboards to cater to the specific needs of various users. This enables us to deliver a personalized experience for everyone involved in the solar panel installation process.
          </p>
          <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
            <li className="flex gap-x-3">
              <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-gray-900">Customer Dashboard</strong> Our user-friendly Customer Dashboard helps users write application forms and generate solar panel installation projects. The project dashboard allows customers to download documents, sign agreements, and track the progress of their installations.
              </span>
            </li>
            <li className="flex gap-x-3">
              <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-gray-900">Sales Dashboard</strong> Our Sales Dashboard is designed for Solmate team members to efficiently communicate with users and report to management for project approvals. This platform helps streamline the sales process, ensuring a smooth experience for both our customers and our team.
              </span>
            </li>
            <li className="flex gap-x-3">
              <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-gray-900">Ground Team Dashboard</strong> The Ground Team Dashboard is the go-to platform for our installation teams. It features a ticket calendar to help organize daily tasks, as well as message channels for seamless communication. This dashboard ensures that our ground teams are always prepared and up-to-date on project details.
              </span>
            </li>
            <li className="flex gap-x-3">
              <CheckCircleIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-gray-900">Management Dashboard</strong> Our user-friendly Customer Dashboard helps users write application forms and generate solar panel installation projects. The project dashboard allows customers to download documents, sign agreements, and track the progress of their installations.
              </span>
            </li>
          </ul>
          
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">Our Team</h2>
          <p className="mt-6">
          Solmate is a group of passionate professionals dedicated to making a positive impact on the environment and the lives of our customers. With years of experience in solar energy, our team is well-equipped to guide you through the entire process of switching to solar - from design and installation to ongoing maintenance and support.
          </p>
          <figure className="mt-10 border-l border-indigo-600 pl-9">
            <blockquote className="font-semibold text-gray-900">
              <p>
                “"Embrace the brilliance of Solmate – where innovation, passion, and expertise unite to illuminate a sustainable future for all.".”
              </p>
            </blockquote>
            <figcaption className="mt-6 flex gap-x-4">
              <img
                className="h-6 w-6 flex-none rounded-full bg-gray-50"
                src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <div className="text-sm leading-6">
                <strong className="font-semibold text-gray-900">ChatGPT4.0</strong> – Professional Solar Energy Wirter
              </div>
            </figcaption>
          </figure>
        </div>
        <figure className="mt-16">
          <img
            className="aspect-video rounded-xl bg-gray-50 object-cover"
            src="https://i.ibb.co/5km7dWC/Link-Solar-Panel-Installtion-Glowing-Shimering-Ray-Tracing-Refl-285e377a-245f-4811-afa5-fc9cde30fb8f.png"
            alt=""
          />
          <figcaption className="mt-4 flex gap-x-2 text-sm leading-6 text-gray-500">
            <InformationCircleIcon className="mt-0.5 h-5 w-5 flex-none text-gray-300" aria-hidden="true" />
            -Solar-Panels-By MidJouney
          </figcaption>
        </figure>
        <div className="mt-16 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Join and Help us</h2>
          <p className="mt-6">
          Join us on our mission to create a brighter future powered by solar energy. With Solmate, you can be sure that you're in good hands as we help you harness the sun and power your future.
          </p>
          <p className="mt-8">
          Thank you for choosing Solmate - Connecting You to a Brighter Future!
          </p>
        </div>
      </div>
      
    </div>
    <HomeFooter />
    </Fragment>
    
  )
}

export default About;