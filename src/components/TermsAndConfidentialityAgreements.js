import React, { useState } from "react";

import Dialog from "../customComponents/Dialog";
import ContainedFunctionButton from "../customComponents/ContainedFunctionButton";

function TermsAndConfidentialityAgreements(props) {
  const { agreedToTerms, setAgreedToTerms, disabled } = props;
  const [showTerms, setShowTerms] = useState(false);
  const handleDialog = () => {
    var x = document.getElementsByTagName("BODY")[0];
    if (window.getComputedStyle(x).overflow === "visible") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
    setShowTerms(!showTerms);
  };

  return (
    <div className="mt-10">
      <div className="terms-and-agreements-root">
        <input
          type="checkbox"
          id="term&agreements"
          name="term&agreements"
          onChange={(e) => {
            setAgreedToTerms(!agreedToTerms);
          }}
          value={agreedToTerms}
          disabled={disabled}
        />
        <p className="ml-5 terms-and-agreements-text">
          I agree to the{" "}
          <span
            className="text-button"
            onClick={(e) => {
              e.preventDefault();
              handleDialog();
            }}
          >
            Terms and confidentiality agreements
          </span>
        </p>
      </div>
      {showTerms ? (
        <Dialog
          handleClose={handleDialog}
          style={{ marginTop: "10vh", marginBottom: "10vw", width: "800px" }}
        >
          <div className="pl-40 pr-40 pt-20 pb-40">
            <div className="center-text">
              <h3
                className="page-header-paragraph mt-20"
                style={{ fontSize: "23px" }}
              >
                Smartists Confidentiality Agreement
              </h3>
            </div>

            <div>
              <div className="mt-20">
                <p className="paragraph-header">
                  Intellectual Property & Copyrights
                </p>
                <p className="paragraph mt-10">
                  The Intellectual Property Rights of Art works on a Smartsist
                  Studio belong to the Artist identified by his/her blockstackID
                  as the owner of the Studio. Artists are responsible for the
                  authorship of the art works they upload to their studios.
                  Authors in their Smartists' Studio are the owners of the
                  intellectual property of their art works in all extension.
                </p>
                <p className="paragraph mt-10">
                  In case of on-demand Art works, the artist will keep the
                  Intellectual Property ownership of all materials delivered.
                  The artist is the only owner of any concepts, ideas, copy
                  sketches, artwork, electronic files and other materials
                  delivered in connection with projects presented by the
                  Art-Users.
                </p>
                <p className="paragraph mt-10">
                  The Intellectual Property Rights related or derived from the
                  information shared about a specific project are property of
                  the author who first introduced the project on Smartists.{" "}
                </p>
              </div>

              <div className="mt-20">
                <p className="paragraph-header">Confidentiality Definition</p>
                <p className="paragraph mt-10">
                  All information -in any digital file format- provided by any
                  Artist in his/her Smartists Studio is considered confidential.
                  All information provided by any Art-user about any Art work
                  project to an Artist on his/her Smartists Studio is also
                  confidential. Such Confidentiality definition comes with the
                  following exceptions: 
                </p>
                <div className="mt-10">
                  <ul className="paragraph-list">
                    <li className="paragraph-list-item">
                      Information in connection with an Art work project which
                      is already in the possession of the interested user prior
                      to the disclosure of the confidential information without
                      any obligation of confidentiality; 
                    </li>
                    <li className="paragraph-list-item">
                      Information which is or comes into the public domain or
                      otherwise ceases to be of a confidential nature other than
                      as a result of wrongful disclosure; 
                    </li>
                    <li className="paragraph-list-item">
                      Information whose disclosure was previously authorized by
                      written consent. 
                    </li>
                    <li className="paragraph-list-item">
                      Information that must be disclosed pursuant to a legal
                      obligation;
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-20">
                <p className="paragraph-header">Obligations</p>
                <p className="paragraph mt-10">
                  Any Art-user interested in a specific Art work or project in a
                  Smartists Studio has the following obligations:
                </p>
                <div className="mt-10">
                  <ul className="paragraph-list">
                    <li className="paragraph-list-item">
                      Crediting the Artist for his/her work;
                    </li>
                    <li className="paragraph-list-item">
                      Keeping confidential information secret and never
                      disclosing it to third parties; 
                    </li>
                    <li className="paragraph-list-item">
                      Using the information only for the purposes determined by
                      the author; 
                    </li>
                    <li className="paragraph-list-item">
                      Making sure that the confidentiality of the information is
                      respected by those who could have access through him by
                      extending the present agreement to them, and answering for
                      its compliance; 
                    </li>
                    <li className="paragraph-list-item">
                      Return or destroy confidential information and its copies
                      at the author’s request or when the relationship between
                      the parties ends.In case of on-demand Art works, same
                      obligations apply to artists when receiving information
                      about a project.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-20">
                <p className="paragraph-header">
                  Disclosure, Damages and Claims
                </p>
                <p className="paragraph mt-10">
                  The author and the interested-user are aware that disclosure
                  or misuse of Confidential Information will produce irreparable
                  damage to the commercial and financial interests of the other
                  party. Therefore, both parties agree to indemnify the other
                  party for the damage caused and claimed in accordance with the
                  current legislation of the author's jurisdiction.
                </p>
              </div>

              <div className="mt-20">
                <p className="paragraph-header">Application</p>
                <p className="paragraph mt-10">
                  The Smartists Confidentiality Agreement applies to projects
                  and on demand commissions as well as any other deals between
                  Smartists members.
                </p>
              </div>
            </div>
            <div className="dialog-action mt-30">
              <ContainedFunctionButton
                onClick={(e) => {
                  e.preventDefault();
                  handleDialog();
                }}
                color="btn-secondary"
              >
                Got it
              </ContainedFunctionButton>
            </div>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}

export default TermsAndConfidentialityAgreements;
