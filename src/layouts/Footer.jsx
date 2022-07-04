import React from "react";
import { FaDiscord } from "react-icons/fa";

function Footer() {
  return (
    <div className="h-full w-full flex flex-col p-4 md:p-8 lg:p-0 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-screen-xl mx-auto">
      <div className="mb-10">
        <hr />
        <div className="w-full py-2">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Documentation
              </p>
              <ul className="mt-2">
                <li className="py-1">
                  <a
                    href="https://melodious-rondeletia-029.notion.site/Smartists-Privacy-Policy-a89eb92fc6dd49a99cb08f9f04bac63b"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-gray-400 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li className="py-1">
                  <a
                    href="https://melodious-rondeletia-029.notion.site/Smartists-Terms-of-Service-0fb7f132b7a84ea1bef994bc6c0debfd"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-gray-400 hover:underline"
                  >
                    Terms of Service
                  </a>
                </li>
                <li className="py-1">
                  <a
                    href="https://melodious-rondeletia-029.notion.site/Smartists-Confidentiality-Agreement-6fbea2c32e6749a1bc3a5721fd9c2821"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-gray-400 hover:underline"
                  >
                    Confidentiality Agreement
                  </a>
                </li>
                {/* <li className="py-1">
                  <a
                    href="https://app.sigle.io/mirlo.id.blockstack/-enOx2p77fP7jGScBDkDp"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-gray-400 hover:underline"
                  >
                    Licensing Agreements
                  </a>
                </li>
                <li className="py-1">
                  <p className="text-xs font-semibold text-gray-300 cursor-default">
                    General and Special Licensing Terms
                  </p>
                </li> */}
              </ul>
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        <hr />
        <div className="w-full">
          <div className="grid grid-cols-3 gap-6 items-center">
            <div>
              <p className="text-xs font-semibold text-gray-600">
                © 2022 Smartists
              </p>
            </div>
            <div className="flex justify-center">
              <p className="text-xs font-semibold text-gray-600">
                Smartists is built on Stacks and secured by Bitcoin
              </p>
            </div>
            <div className="flex justify-end">
              <ul>
                <li className=" cursor-pointer">
                  <a
                    href="https://discord.gg/J39BcWVCTm"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="text-gray-600 text-xl">
                      <FaDiscord />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className=" fixed bottom-0 left-0 right-0 bg-slate-900 text-white text-center text-xs py-1">
        Smartists is still currently on development phase and on testnet.{" "}
        <a
          className=" underline"
          href="/faqs/16"
          target="_blank"
          rel="noreferrer"
        >
          Learn more
        </a>
      </div>
    </div>
  );
}

export default Footer;
