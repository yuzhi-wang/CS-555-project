import { useState } from 'react'
import { ArrowPathIcon, CloudArrowUpIcon, LockClosedIcon } from '@heroicons/react/20/solid'
import React from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Team from '../Homepage/Team/Team'
import HomeNavigation from "./Navigation/HomeNavigation.jsx"
import HomeFooter from './Footer/HomeFooter';


const features = [
  {
    name: 'Streamlined Installation Process:',
    description:
      'Our app connects you with a network of certified solar panel installers, making it easy to find and schedule the right professionals for your project',
    href: '#',
    icon: ArrowPathIcon,
  },
  {
    name: 'Ground Team Collaboration',
    description:
      'The apps ground team dashboard enables seamless communication between installers, managers, and customers, ensuring a smooth installation experience from start to finish',
    href: '#',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Comprehensive Sales Dashboard',
    description:
      ' Solmate customer sales platform provides real-time data, analytics, and lead tracking to help your sales team efficiently manage and close deals',
    href: '#',
    icon: LockClosedIcon,
  },
  {
    name: 'Manager Dashboard',
    description:
      'Our app connects you with a network of certified solar panel installers, making it easy to find and schedule the right professionals for your project',
    href: '#',
    icon: ArrowPathIcon,
  },
  {
    name: 'Customized Solar Solutions',
    description:
      'Solmate analyzes your energy needs, location, and preferences to recommend the perfect solar panel setup tailored to your requirements',
    href: '#',
    icon: ArrowPathIcon,
  },

  {
    name: 'Incentive and Rebate Tracking',
    description:
      'Solmate helps you discover and take advantage of available solar incentives, rebates, and tax credits to make your solar installation even more affordable',
    href: '#',
    icon: ArrowPathIcon,
  },
]
// color them bg-teal-200 bg-purple-700 bg-violet-900

export default function Homepage() {

  
  // const auth = getAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-teal-300">
     <HomeNavigation/>

      <div className="relative isolate pt-14">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Solmate: Harness the Sun, Power Your Future
              </h1>
              <p className="mt-6 text-lg leading-8 text-white">
             Connecting You to a Brighter Future with Seamless Solar Panel Installation, Expert Support, and Intelligent Management for a Sustainable Tomorrow"
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                  onClick={()=>{navigate("/login")}}>
                  Get started
                </a>
                <a href="#" className="text-sm font-semibold leading-6 text-white">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <img
              src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
              alt="App screenshot"
              width={2432}
              height={1442}
              className="mt-16 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 sm:mt-24"
            />
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
          
        </div>
      </div>

      <div className="bg-teal-300 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-Black">Deploy faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-Black sm:text-4xl">
            Everything you need to deploy your Sollar Panels
          </p>
          <p className="mt-6 text-lg leading-8 text-black">
          Solmate is your all-in-one solar companion, offering tailored solar solutions, seamless installation, and expert support. Harness the power of our comprehensive dashboards for efficient project management and sales tracking. Unlock a brighter, sustainable future with Solmate's real-time performance monitoring and incentive tracking features.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-violet-1000">
                  <feature.icon className="h-5 w-5 flex-none text-violet-950" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-violet-1000">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <a href={feature.href} className="text-sm font-semibold leading-6 text-violet-700">
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
      
      <Team />


    </div>
    
  )
}
