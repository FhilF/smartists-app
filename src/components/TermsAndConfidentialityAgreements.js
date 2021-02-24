import React, { useState } from "react";

import Dialog from "../customComponents/Dialog";
import Button from "../customComponents/Button";

function TermsAndConfidentialityAgreements(props) {
  const { agreedToTerms, setAgreedToTerms, disabled,alert } = props;
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
    <div className="mt-4">
      <div
        className="terms-and-agreements-root"
        style={{ display: "flex", alignItems: "center" }}
      >
        <input
          type="checkbox"
          id="term&agreements"
          name="term&agreements"
          checked={Object.keys(agreedToTerms).every(function (k) {
            return agreedToTerms[k];
          })}
          onChange={(e) => {
            // setAgreedToTerms(!agreedToTerms);
          }}
          onClick={(e) => {
            e.preventDefault();
            handleDialog();
          }}
          value={agreedToTerms}
          disabled={disabled}
          className="cursor-pointer"
        />
        <p className=" text-sm font-semibold ml-2">
          I agree to the{" "}
          <span
            className="text-secondary cursor-pointer hover:underline"
            onClick={(e) => {
              e.preventDefault();
              if(!disabled){
                handleDialog();
              }
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
          <div className="dialog-content">
            <div className="center-text">
              <h3 className="text-secondary text-2xl">
                Smartists Confidentiality Agreement
              </h3>
            </div>

            <div>
              <div className="mt-4">
                <p className="paragraph-header">
                  Intellectual Property & Copyrights
                </p>
                <p className="paragraph mt-2">
                  The Intellectual Property Rights of Art works on a Smartsist
                  Studio belong to the Artist identified by his/her blockstackID
                  as the owner of the Studio. Artists are responsible for the
                  authorship of the art works they upload to their studios.
                  Authors in their Smartists' Studio are the owners of the
                  intellectual property of their art works in all extension.
                </p>
                <p className="paragraph mt-2">
                  In case of on-demand Art works, the artist will keep the
                  Intellectual Property ownership of all materials delivered.
                  The artist is the only owner of any concepts, ideas, copy
                  sketches, artwork, electronic files and other materials
                  delivered in connection with projects presented by the
                  Art-Users.
                </p>
                <p className="paragraph mt-2">
                  The Intellectual Property Rights related or derived from the
                  information shared about a specific project are property of
                  the author who first introduced the project on Smartists.{" "}
                </p>
                <div className="mt-2">
                  <input
                    type="checkbox"
                    id="term&agreements1"
                    name="term&agreements1"
                    checked={agreedToTerms.ag1}
                    onChange={(e) => {
                      setAgreedToTerms({
                        ...agreedToTerms,
                        ag1: !agreedToTerms.ag1,
                      });
                    }}
                    disabled={disabled}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor="term&agreements1"
                    className="text-sm font-semibold text-secondary ml-2"
                  >
                    Agree
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <p className="paragraph-header">Confidentiality Definition</p>
                <p className="paragraph mt-2">
                  All information -in any digital file format- provided by any
                  Artist in his/her Smartists Studio is considered confidential.
                  All information provided by any Art-user about any Art work
                  project to an Artist on his/her Smartists Studio is also
                  confidential. Such Confidentiality definition comes with the
                  following exceptions: 
                </p>
                <div className="mt-2">
                  <ul className="paragraph-list list-disc">
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
                <div className="mt-2">
                  <input
                    type="checkbox"
                    id="term&agreements2"
                    name="term&agreements2"
                    checked={agreedToTerms.ag2}
                    onChange={(e) => {
                      setAgreedToTerms({
                        ...agreedToTerms,
                        ag2: !agreedToTerms.ag2,
                      });
                    }}
                    disabled={disabled}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor="term&agreements2"
                    className="text-sm font-semibold text-secondary ml-2"
                  >
                    Agree
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <p className="paragraph-header">Obligations</p>
                <p className="paragraph mt-2">
                  Any Art-user interested in a specific Art work or project in a
                  Smartists Studio has the following obligations:
                </p>
                <div className="mt-2">
                  <ul className="paragraph-list list-disc">
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
                <div className="mt-2">
                  <input
                    type="checkbox"
                    id="term&agreements3"
                    name="term&agreements3"
                    checked={agreedToTerms.ag3}
                    onChange={(e) => {
                      setAgreedToTerms({
                        ...agreedToTerms,
                        ag3: !agreedToTerms.ag3,
                      });
                    }}
                    disabled={disabled}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor="term&agreements3"
                    className="text-sm font-semibold text-secondary ml-2"
                  >
                    Agree
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <p className="paragraph-header">
                  Disclosure, Damages and Claims
                </p>
                <p className="paragraph mt-2">
                  The author and the interested-user are aware that disclosure
                  or misuse of Confidential Information will produce irreparable
                  damage to the commercial and financial interests of the other
                  party. Therefore, both parties agree to indemnify the other
                  party for the damage caused and claimed in accordance with the
                  current legislation of the author's jurisdiction.
                </p>

                <div className="mt-2">
                  <input
                    type="checkbox"
                    id="term&agreements4"
                    name="term&agreements4"
                    checked={agreedToTerms.ag4}
                    onChange={(e) => {
                      setAgreedToTerms({
                        ...agreedToTerms,
                        ag4: !agreedToTerms.ag4,
                      });
                    }}
                    disabled={disabled}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor="term&agreements4"
                    className="text-sm font-semibold text-secondary ml-2"
                  >
                    Agree
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <p className="paragraph-header">Application</p>
                <p className="paragraph mt-2">
                  The Smartists Confidentiality Agreement applies to projects
                  and on demand commissions as well as any other deals between
                  Smartists members.
                </p>
                <div className="mt-2">
                  <input
                    type="checkbox"
                    id="term&agreements5"
                    name="term&agreements5"
                    checked={agreedToTerms.ag5}
                    onChange={(e) => {
                      setAgreedToTerms({
                        ...agreedToTerms,
                        ag5: !agreedToTerms.ag5,
                      });
                    }}
                    disabled={disabled}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor="term&agreements5"
                    className="text-sm font-semibold text-secondary ml-2"
                  >
                    Agree
                  </label>
                </div>
              </div>
            </div>
            <div className="dialog-action mt-4">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleDialog();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    Object.keys(agreedToTerms).every(function (k) {
                      return agreedToTerms[k];
                    })
                  ) {
                    handleDialog();
                  }else{
                    alert.error("You haven't agreed to all terms")
                  }
                }}
                color="secondary"
                variant="contained"
              >
                Submit
              </Button>
            </div>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}

export default TermsAndConfidentialityAgreements;
