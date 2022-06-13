import React, { useState, useEffect, useRef, createRef } from "react";
import Accordion from "components/Accordion";
import { useParams } from "react-router-dom";

function FAQs() {
  const params = useParams();

  const faqs = [
    {
      title: "What is blockchain?",
      description:
        "A blockchain is a distributed database that is shared among the nodes of a computer network. As a database, a blockchain stores information electronically in digital format. Blockchains are best known for their crucial role in cryptocurrency systems, such as Bitcoin, for maintaining a secure and decentralized record of transactions. The innovation with a blockchain is that it guarantees the fidelity and security of a record of data and generates trust without the need for a trusted third party",
      ref: createRef(),
    },
    {
      title: "What blockchain does Smartists use?",
      description:
        'Smartists uses <a href="https://www.stacks.co/" target="_blank" rel="noreferrer">Stacks blockchain</a>',
      ref: createRef(),
    },
    {
      title: "What is Stacks?",
      description:
        'Stacks is a blockchain linked to Bitcoin by its consensus mechanism that spans the two chains, called Proof of Transfer. Like Bitcoin, Stacks is a decentralized network. There are many individuals and companies from all over the world that contribute to and build on Stacks. <br/><br/> <a href="https://www.stacks.co/learn/introduction" target="_blank" rel="noreferrer">Stacks Overview</a>',
      ref: createRef(),
    },
    {
      title: "What is Smartists? ",
      description:
        "Smartists is a decentralized app enabling independent artists and art users connect and make deal on the web3 with security and privacy. Using Smartists, Independent Creators who hold Intellectual Property (IP) rights can manage their digital IP assets online as they do with their art works in their real studios, including selling special items minted NFTs with a use-license attached.",
      ref: createRef(),
    },
    {
      title: "What makes Smartists different from other NFTs platforms?",
      description:
        "Smartists is not a marketplace, it is rather a service (SaaS) providing its users the tools to connect with Al leagues and clients. Minting and selling NFTs  is just part of our services. Smartists can do it from their  own place, attaching a copyrights license. Smartists will only take Fees per service (Platform use, and Licensing services), but no % on the sales.",
      ref: createRef(),
    },
    {
      title: "What can I do when I enter in Smartists?",
      description:
        "First, you will need to set your account as an artist and/or an Art-user signing a Confidentiality Agreement. Then you can open your studio where you can showcase some pieces, share some project in progress to search for collaborators, as well as sell your own NFTs with a Smartists use-license attached. When you mint an NFT in Smartists you are declaring that you are the IP owner of the art work, and that the NFT is Genuine NFT.",
      ref: createRef(),
    },
    {
      title: "What is NFT?",
      description:
        "Non-fungible tokens (NFTs) are cryptographic assets on a blockchain with unique identification codes and metadata that distinguish them from each other. Blockchain technology provides an opportunity for creators to sell to collectors without the need for intermediaries.",
      ref: createRef(),
    },
    {
      title: "What is a Smart Contract?",
      description:
        "A smart contract is a self-executing contract with the terms of the agreement between buyer and seller being directly written into lines of code. The code and the agreements contained therein exist across a distributed, decentralized blockchain network. The code controls the execution, and transactions are trackable and irreversible.",
      ref: createRef(),
    },
    {
      title: "What is a Smartists use-license?",
      description:
        'Smartists use-licenses are the way artists decide how they want buyers of their art files minted as NFts on Smartists. You will receive the necessary information to understand the right included in every license at the time of minting every NFT. You can also know more about this in our <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a>.',
      ref: createRef(),
    },
    {
      title: "Is Smartists a marketplace?",
      description:
        "No, it is rather a service (SaaS) providing its users the tools to sell from your own place. ",
      ref: createRef(),
    },
    {
      title: "Why do I need a wallet?",
      description:
        'The wallet is your unique secret key to your studio, so you need it to enter in case you leave. Moreover it is necessary to sell, send and receive NFTs and payments. To better understand wallets you can watch this video: <a href="https://youtu.be/5OBOAfaSU_4" target="_blank" rel="noreferrer">https://youtu.be/5OBOAfaSU_4</a>',
      ref: createRef(),
    },
    {
      title: "Can Smartists help me recover my key if I lose it?",
      description:
        "No, you need to keep carefully your recovery phrase in a safe place. This key is uniquely generated for you and you should not give it to anyone.",
      ref: createRef(),
    },
    {
      title: "Can Smartists see my activity and manage my data? ",
      description:
        'No, Smartists is Privacy focused. See our <a href="https://melodious-rondeletia-029.notion.site/Smartists-Privacy-Policy-a89eb92fc6dd49a99cb08f9f04bac63b" target="_blank" rel="noreferrer">Privacy Policy</a>. ',
      ref: createRef(),
    },
    {
      title: "Can Smartists take off my content? ",
      description:
        "No, we don’t have access to your content and we respect Freedom of Speech as a Fundamental Human Right. Nevertheless, we will take down any account if required by legal authorities. ",
      ref: createRef(),
    },
    {
      title: "Can I mint other digital assets?",
      description:
        "Smartists is still currently on development phase. You can only mint images for now. We will unlock other options for members to mint through smartists once we finished it.",
      ref: createRef(),
    },
    {
      title: "What is mainnet and testnet?",
      description:
        "Mainnet (main network) and testnet (test network) are terms used in the blockchain ecosystem to describe blockchain networks with critical functionalities. The mainnet is responsible for executing actual transactions within the network and storing them on the blockchain for public use. In contrast, the testnet provides an alternative environment that mimics the mainnet’s functionality to allow developers to build and test projects without needing to facilitate live transactions or the use of cryptocurrencies, for example.",
      ref: createRef(),
    },
    {
      title: "Do I need to swap for Stacks coin to use smartists on testnet?",
      description:
        "No, Stacks coin on mainnet and testnet are different, but we can provide you an interface to get Stacks in order for you to test smartists on testnet.",
      ref: createRef(),
    },
  ];

  const paramsId =
    !isNaN(parseInt(params.id)) && parseInt(params.id) <= faqs.length
      ? parseInt(params.id)
      : null;

  useEffect(() => {
    if (paramsId) {
      window.scrollTo({
        behavior: "smooth",
        top:
          faqs[paramsId - 1].ref.current.getBoundingClientRect().top -
          document.body.getBoundingClientRect().top -
          80,
      });
    }
  }, [paramsId]);

  return (
    <div className="w-full flex justify-center">
      <div className=" max-w-screen-lg w-full">
        <div>
          <div className="mt-20">
            <h1 className=" font-medium text-3xl">
              Frequently asked questions
            </h1>
            <p className="mt-4 text-gray-500">
              Below you'll find our most frequently asked questions.{" "}
            </p>
          </div>
          <div className="w-full mt-4">
            <ul className="flex flex-col items-start justify-start w-full">
              {faqs.map((el, i) => {
                return (
                  <Accordion
                    key={i}
                    index={i}
                    title={el.title}
                    description={el.description}
                    childRef={el.ref}
                    paramsId={paramsId}
                  />
                );
              })}
            </ul>
          </div>
        </div>
        <div className="mt-16">
          <p className=" font-semibold text-gray-500">
            Didn't find your answer? Try viewing our{" "}
            <a
              href="/guides"
              target="_blank"
              rel="noreferrer"
            >
              <span className="text-red-900 hover:underline cursor-pointer">
                guides
              </span>
            </a>{" "}
            or message us on{" "}
            <a
              href="https://discord.gg/J39BcWVCTm"
              target="_blank"
              rel="noreferrer"
            >
              <span className="text-red-900 hover:underline cursor-pointer">
                discord
              </span>
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default FAQs;
