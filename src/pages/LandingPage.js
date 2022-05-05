import classNames from "classnames";
import React, { useState } from "react";
import Image1 from 'assets/images/landing-1.png';
import Image2 from 'assets/images/landing-2.png';
import Image3 from 'assets/images/landing-3.png';
import Image4 from 'assets/images/landing-4.png';

import { authenticate, userSession } from "utils/stacks-util/auth";

function LandingPage(props) {
  const {setIsNewSignIn } = props;
  const [accordion, setAccordion] = useState([true, false]);

  const toggleAccordion = (index) => {
    const newAccordion = [...accordion];
    newAccordion[index] = !accordion[index];
    setAccordion(newAccordion);
  }

  const accordionElements = [
    {
      title: 'What if you lose your Private Key',
      text: 'Once the identifier is generated for you, only you have it, and we cannot recover it, so you must keep your Private Key in a safe place.',
    },
    {
      title: 'Is Smartists safe for art works and business?',
      text: 'Smartists is built on Stacks and secured by Bitcoin, the most secure of Blockchains. All legal support included in the Smartists app is compliant with the WIPO principles and the Bern Convention. To know more, please read our documentation, including Terms of Service, Privacy policy, Confidentiality Agreement.',
    }
  ]

  return (
    <div className="page-root" style={{ backgroundColor: '#F8F9F4' }}>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 pt-16 pb-4 lg:py-32">

          <div className="flex flex-col justify-center md:pr-16 text-center lg:text-left">
            <h2 className="text-4xl text-red-900 mb-3">Self-managed Artist Studios</h2>
            <p className="text-xl mb-8">The App for private Art deals on the web3, the Internet of Value</p>
            <img className="place-self-center w-screen lg:hidden inline-block mb-8" width="100%" src={Image1} />

            <div className="bg-[#F3F3F0] rounded-lg main-cta inline-flex flex-col p-9 lg:max-w-xl" style={{ backgroundColor: '#F3F3F0' }}>
              <h4 className="text-xl text-red-900 mb-3 font-semibold">First, you need to get there!</h4>
              <p>No need to give us your email to visit Smartists. We respect your privacy and personal information. You just need to get a digital identifier, like a passport to the web3, and Smartists can provide it via Stacks.</p>
              <div className="mt-5">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-red-900 hover:bg-red-700 focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault();
                    if (userSession) {
                      if (!userSession.isUserSignedIn()) {
                        authenticate({setIsNewSignIn});
                      }
                    }
                  }}
                >
                  Join Smartists
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-gray-700 hover:bg-gray-50 focus:outline-none"
                  onClick={() => window.open('https://www.stacks.org/about', '_blank')}
                >
                  Learn more about Stacks &rarr;
                </button>
              </div>
            </div>
          </div>

          <div className="place-self-center ">
            <img className="place-self-center w-screen hidden lg:inline-block" width="100%" src={Image1} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 mt-16 mb-28 text-center lg:text-left">
          <div>
            <img className="place-self-center" width="100%" src={Image2} />
          </div>
          <div className="md:px-20 md:py-12 p-0 self-center">
            <h4 className="text-2xl text-red-900 mb-3">Once in Smartists...</h4>
            <p>You can visit studios or open your own. Yes, it´s that simple. You will just need to introduce yourself and accept some terms of confidentiality that apply for any user in Smartists. Wouldn't you do it in the real world?</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 my-28 text-center lg:text-left">
          <div className="md:px-20 md:py-12 p-0 self-center">
            <h4 className="text-2xl text-red-900 mb-3">If you open a private studio</h4>
            <p>You will be able to showcase some pieces, introduce some projects in progress and look for collaborators, as well as open a private gallery to sell your art works as NFTs while licensing their copyrights.</p>
          </div>
          <div className="order-first lg:order-none">
            <img className="place-self-center" width="100%" src={Image3} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 my-28 text-center lg:text-left">
          <div>
            <img className="place-self-center" width="100%" src={Image4} />
          </div>
          <div className="md:px-20 md:py-12 p-0 self-center">
            <h4 className="text-2xl text-red-900 mb-3">If you want to make a deal with an artist...</h4>
            <p>Visit the artist's private studio, where you can have a look at the pieces and projects in progress, contact directly for a special collaboration, or buy an exclusive NFT with the copyrights you may need.</p>
          </div>
        </div>

      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-32">
          <div className="grid lg:grid-cols-2 bg-white">
            <div className="lg:pr-12 my-12">
              <h4 className="text-3xl text-red-900 mb-4">FAQ</h4>

              {accordionElements.map((accordionElement, index) => (
                <div className="text-lg mb-6" key={index}>
                  <h5 className="font-medium mb-2 cursor-pointer" onClick={() => toggleAccordion(index)}>
                    <span className="inline-block">
                      {accordion[index] ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    {accordionElement.title}</h5>
                  <p className={classNames("text-base", !accordion[index] && "hidden")}>{accordionElement.text}</p>
                </div>
              ))}

            </div>

            <div className="cta-faq p-8 rounded-lg self-center" style={{ backgroundColor: '#F8F9F4' }}>
              <h2 className="text-4xl text-red-900 mb-4">Open your private studio</h2>
              <p className="text-base mb-8">Showcase up to three art pieces just to introduce your art, and connect with collaborators and clients in a confidential setting.</p>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-red-900 hover:bg-red-700 focus:outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  if (userSession) {
                    if (!userSession.isUserSignedIn()) {
                      authenticate({setIsNewSignIn});
                    }
                  }
                }}
              >
                Visit App
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2">
        <div>
          <ul className="list-none flex">
            <li className="mr-2"><button type="button" className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:text-red-900 focus:outline-none">
              Documentation
            </button></li>
            <li className="mr-2"><button type="button" className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium rounded-full text-gray-700 hover:bg-gray-50 hover:text-red-900 focus:outline-none">
              Terms of Service
            </button></li>
            <li className="mr-2"><button type="button" className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium rounded-full text-gray-700 hover:bg-gray-50 hover:text-red-900 focus:outline-none">
              Privacy Policy
            </button></li>
            <li className="mr-2"><button type="button" className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium rounded-full text-gray-700 hover:bg-gray-50 hover:text-red-900 focus:outline-none">
              Confidentiality Agreement
            </button></li>
          </ul>
        </div>

        <div>
          <p className="text-gray-500 lg:text-right text-sm">SMARTISTS is built on Stacks and secured by Bitcoin</p>
        </div>
      </div>

    </div>
  );
}

export default LandingPage;
