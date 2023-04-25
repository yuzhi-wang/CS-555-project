import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import SalesProject from "../../Projects/SalesProject";

import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../../../Assets/Logo_white.png";

/*
import BackgroundCSL from './Carousel';
import { getDocs } from 'firebase/firestore';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import ListingItem from '../Listingitem/Listingitem.jsx';
//import Slider from "../components/Slider";
import { db } from '../../firebase';
import queries from '../../query';
import '../Style/style.css';
import arrow from "../../Assets/right-arrow.png"

*/

const SalesDashboard = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [customer, setCustomers] = useState([]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  function onLogout() {
    auth
      .signOut()
      .then(() => {
        alert("User Signed out");
        navigate("/");
      })
      .catch(() => {
        alert("Error with signning out");
      });
  }

  useEffect(() => {
    async function fetchMessages() {
      console.log("Sales Dashboard use effect fired");
      const querySnapshot = await getDocs(
        collection(db, "CustomerSalesMessaging")
      );
      let customermessages = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        customermessages.push({ id: doc.id, data: doc.data() });
      });
      setCustomers(customermessages);
    }
    fetchMessages();
  }, [auth.currentUser.uid]);

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-indigo-600">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="ml-10 flex items-baseline space-x-4">
                  <div
                    className={classNames(
                      //   item.current ?
                      "bg-indigo-700 text-white",
                      // : "text-white hover:bg-indigo-500 hover:bg-opacity-75",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                    //   aria-current={item.current ? "page" : undefined}
                  >
                    Sales Dashboard
                  </div>
                </div>
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex max-w-xs items-center rounded-full bg-indigo-600 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={Logo}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={onLogout}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Sign Out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-indigo-200 hover:bg-indigo-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {/* {navigation.map((item) => ( */}
                <Disclosure.Button
                  // key={item.name}
                  as="div"
                  // href={item.href}
                  className={classNames(
                    //   item.current ?
                    "bg-indigo-700 text-white",
                    // : "text-white hover:bg-indigo-500 hover:bg-opacity-75",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  // aria-current={item.current ? "page" : undefined}
                >
                  Sales Dashboard
                  {/* {item.name} */}
                </Disclosure.Button>
                {/* ))} */}
              </div>
              <div className="border-t border-indigo-700 pb-3 pt-4">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src={Logo} alt="" />
                  </div>
                  {/* <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-indigo-300">
                      {user.email}
                    </div>
                  </div> */}
                  {/* <button
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-indigo-600 p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button> */}
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {/* {userNavigation.map((item) => ( */}
                  <Disclosure.Button
                    //   key={item.name}
                    as="div"
                    //   href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75"
                  >
                    Sign Out
                    {/* {item.name} */}
                  </Disclosure.Button>
                  {/* ))} */}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1
            data-testid="SalesDashboard-1"
            className="text-lg font-semibold leading-6 text-gray-900"
          >
            Sales Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div>
            <h2 className="text-xl font-bold mb-5"> Messages from customers</h2>
            <div className="border-2 rounded-md p-5">
              <ul>
                {customer.map((cust, index) => (
                  <li
                    key={index}
                    className="flex justify-between mb-3 border-b-2 p-3"
                  >
                    <p className="w-">{cust.data.name}</p>
                    <button
                      className="bg-blue-100 ; hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded"
                      onClick={() => {
                        navigate(`/salesmessaging/${cust.id}`);
                      }}
                    >
                      Chat
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <br></br>
          <div>
            <h2 className="text-xl font-bold">Projects</h2>
            <SalesProject />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesDashboard;
