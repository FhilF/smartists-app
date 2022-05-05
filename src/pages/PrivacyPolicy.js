import React from "react";

function PrivacyPolicy() {
  return (
    <div className="pt-8">
      <h1 className="text-4xl text-gray-800">Privacy Policy</h1>
      <div className="mt-8">
        <p className="text-gray-700 font-semibold">
          Privacy is an extremely important fundamental right
        </p>
        <p className="text-gray-700 font-semibold mt-2">
          THIS IS OUR PRIVACY POLICY
        </p>
        <p className="italic mt-2">
          We* go beyond GDPR compliance. We enable digital rights for you and we
          stand for them.
        </p>

        <div>
          <div className="mt-10">
            <p className="text-xl text-gray-800 font-semibold">
              Smartists App is designed to be free from trackers or cookies.
            </p>
            <p className="mt-2">
              Smartists does not collect any identifiable data without your
              consent. We protect privacy and data ownership by design.
            </p>
          </div>

          <div className="mt-10">
            <p className="text-xl text-gray-800 font-semibold">
              An email is the only personal Identification information we invite
              you to share with us in order to be able to access some our
              services.
            </p>

            <p className="text-lg text-gray-800 font-semibold mt-3">
              If you freely agree to provide your email, Smartists will use it
              only with these two purposes:
            </p>
            <ul className="list-decimal ml-8 mt-4">
              <li className="pl-3 mt-2">
                to introduce you to other users on Smartists from you contact
                page, after our Confidentiality Agreement (NDA) has been signed.
              </li>
              <li className="pl-3 mt-2">
                to keep you informed about updates, maintenance and improvements
                of the App, including all new technical and legal features.
              </li>
            </ul>
          </div>

          <div className="mt-10">
            <p className="text-xl text-gray-800 font-semibold">
              We do not share any identifying information with anyone except
              legal obligations.
            </p>
            <p className="mt-2">
              We will keep your email as long as we have relevant information to
              share about our services, or have a legal reason to keep it.
            </p>
            <p className="mt-2">
              Any other information you freely decide to provide as a member of
              Smartists is neither stored nor shared with third parties. Such
              information you freely agree to provide for the purpose of
              introducing yourself to the Smartists community as an ‘artist’ or
              ‘art-user’ can be updated anytime (and does not need to be
              personal). Users of Smartists will have access to your contact
              information in order to connect with you, but only after signing
              our Confidentiality Agreement (NDA). Smartists is nor liable for
              any misuse of such information coming from our users. Smartists
              provides an NDA document to defend yourself, in case you need it.
            </p>
          </div>

          <div className="mt-10">
            <p className="text-xl text-gray-800 font-semibold">
              Using Smartists you may find links to external sites that are not
              operated by us.
            </p>
            <p className="mt-2">
              Where we have no control about the Privacy Policy. Therefore,
              always be aware of the information you are providing in other
              contexts that include data collection. Our advice: never share
              personal identifiable information with unknown data collectors.
            </p>
            <p className="mt-6 italic">
              <span className="font-semibold not-italic">June, 2021.</span> This
              is a new technology. Privacy Policy changes may apply to comply
              with new laws, and will be uploaded in this notice.
            </p>

            <p className="font-semibold">Who are we?</p>
            <p className="mt-2">
              We are a small team working on the{" "}
              <a
                className="text-gray-500 underline"
                href="https://www.smartists.net/"
                target="_blank"
                rel="noreferrer"
              >
                Smartists
              </a>{" "}
              mvp for a Decentralized Application with the support of the{" "}
              <a
                className="text-gray-500 underline"
                href="https://www.stacks.org/"
                target="_blank"
                rel="noreferrer"
              >
                Stacks Foundation
              </a>
              . We are investing our time and energy to build solutions for
              artists and art-users on the next Internet of Value 3.0. Defending
              privacy and refusing any data collection is an irrevocable
              condition for the business model definition of our App. On the
              Smartists App all data will be owned by you, and only you will
              access and manage them. We will have no mechanism to censor or
              access your data. As we reject data collection, on our App all
              related rights defined by law will be preserved. In these first
              startup steps the person in charge and responsible for any
              decision is Georgina García-Mauriño, founder of Smartists. If you
              have any questions about this Privacy Policy, please contact by
              email:{" "}
              <a className="text-gray-500 underline" href="mailto:contact@smartists.net">hello@smartists.net</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
