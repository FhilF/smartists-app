import React from "react";
import Level1 from "assets/images/level-1.png";
import Level2 from "assets/images/level-2.png";
import Level3 from "assets/images/level-3.png";
import Level4 from "assets/images/level-4.png";
import Level5 from "assets/images/level-5.png";

function SpecialTerms() {
  return (
    <>
      <div className="text-center">
        <p className="text-2xl font-semibold">
          International Smartists Licensing Agreements I. S. L. A.
        </p>
        <p className="text-2xl text-red-900 pt-2">Special Terms & Conditions</p>
        <p className="text-xs text-gray-400 pt-2 px-16">
          To be decided by the licensor
        </p>
        <p className="text-xs text-gray-400 pt-2 px-16">
          WHENEVER SELLING A GENUINE NFT WITH A LICENSE THE COPYRIGHTS HOLDER
          NEEDS TO DEFINE THE SPECIAL TERMS - Rights Granted and other
          Specifications - GOVERNING THE USE OF THE NFT BYT THE BUYER AND
          LICENSEE
        </p>
        <p className="text-xs text-gray-400 pt-2 px-16">
          *Genuine NFTs on sale without a license have ©All Rights Reserved
        </p>
      </div>
      <div className="flex flex-col space-y-6 items-start justify-start">
        <div className="flex flex-col space-y-4 items-start justify-start">
          <div className="flex flex-col space-y-2 items-start justify-start text-xs leading-5 text-gray-500">
            <p className=" text-gray-900 font-semibold text-lg">
              5 levels of Smartists Licenses depending on the rights granted
            </p>
            <p>
              ** Reminder. All Smartists Licenses are EXCLUSIVE - UNIQUE
              <br />
              Licensor acknowledges and agrees that the license granted herein
              is exclusive, and that he will not license others to use the
              Licensed Material within the term of the present contract
            </p>
            <div>
              <div className="grid grid-cols-5 gap-6 w-full mt-8">
                <div className=" col-span-1 px-4">
                  <img src={Level1} alt="level-1" />
                </div>
                <div className="col-span-4">
                  <p className="font-semibold">
                    I. S. L. A. - LEVEL 01 - PUBLIC DISPLAY & PERFORM
                  </p>
                  <p>
                    - Not reproduce, nor copy -
                    <br />
                    Licensee may make the licensed material accessible to third
                    parties in digital form, in the format the digital art work
                    is provided.
                    <br />
                    “Display” means to publicly show or exhibit, perform or
                    present the material, to broadcast, except those cases where
                    it is necessary to make a copy of the material or
                    sub-license.
                    <br />
                    Licensee of an I.S.L.A. with the right to only display is
                    NOT allowed to reproduce and copy the licensed material in
                    any medium or format different from the original (digital,
                    analogue, tangible, intangible).
                    <br />
                    Licensee with the right to only display shall NOT make
                    derivatives or reproductions of derivatives of the Licensed
                    Material in any different format from the original.
                  </p>
                </div>
                <div className=" col-span-1 px-4">
                  <img src={Level2} alt="level-3" />
                </div>
                <div className="col-span-4">
                  <p className="font-semibold">
                    I. S. L. A. - LEVEL 02 - CLONE or REPRODUCE
                  </p>
                  <p>
                    - Not commercially distribute, nor Adapt -
                    <br />
                    GRANTED IN ADDITION TO ‘DISPLAY’
                    <br />
                    Licensee may keep a copy of the licensed material, reproduce
                    or clone it. “Clone” means copying respecting the original
                    format. “Reproduce” means making copies or duplicating the
                    original material respecting the material object in which
                    the art work was fixed. Therefore, Licensee may NOT modify,
                    alter or change the licensed material in any way.
                    <br />
                    Licensee can Display the copies of the copyrighted work and
                    distribute them privately, but NOT commercially distribute
                    them unless this right is expressively granted.
                    <br />
                    This right does not include the right to adapt.
                    <br />
                    All General Terms and Conditions stand for any cloned copy.
                  </p>
                </div>
                <div className=" col-span-1 px-4">
                  <img src={Level3} alt="level-3" />
                </div>
                <div className="col-span-4">
                  <p className="font-semibold">
                    I. S. L. A. - LEVEL 03 - ADAPT
                  </p>
                  <p>
                    - Not commercially distribute -
                    <br />
                    GRANTED ONLY IN ADDITION TO ‘DISPLAY’ & ‘REPRODUCE’
                    <br />
                    The right to prepare derivative works can also be granted to
                    the licensee that has already been granted the right to
                    reproduce copies. “Derivative works” include translation,
                    adaptation, arrangement of music and other alteration and
                    modification or literary and artistic work. Only Licensee
                    with the right to adapt may modify, alter or change the
                    licensed material in any way (e.g. remixing, transforming,
                    shortening, translating, synchronizing, combining with other
                    material).
                    <br />
                    Licensee can Display the adaptations of the copyrighted work
                    and distribute them privately, but NOT commercially
                    distribute them unless this right is expressively granted.
                    <br />
                    All General Terms and Conditions stand for any cloned copy.
                    Therefore, attribution for the original material will apply
                    for any derivative or adapted work.
                    <br />
                  </p>
                </div>
                <div className=" col-span-1 px-4">
                  <img src={Level4} alt="level-4" />
                </div>
                <div className="col-span-4">
                  <p className="font-semibold">
                    I.S.L.A. LEVEL 04 - DISTRIBUTE COMMERCIALLY
                  </p>
                  <p>
                    GRANTED ONLY IN ADDITION OF ‘DISPLAY’ & ‘REPRODUCE’
                    <br />
                    Licensee with the right to clone or reproduce can also be
                    granted the right to distribute commercially his/her copies
                    of the copyrighted work to the public. In this case an
                    additional Royalty rate may apply.
                    <br />
                    **Reminder: Attribution for the original material will apply
                    for any derivative or adapted work, in the form of a
                    copyright notice indicating “adapted from the original work
                    by [author’s name] © [year]” in all adaptations displayed
                    and copies distributed.
                  </p>
                </div>
                <div className=" col-span-1 px-4">
                  <img src={Level5} alt="level-5" />
                </div>
                <div className="col-span-4">
                  <p className="font-semibold">
                    I.S.L.A. LEVEL 05 - DISTRIBUTE COMMERCIALLY
                  </p>
                  <p>
                    GRANTED ONLY IN ADDITION OF ‘DISPLAY’ & ‘REPRODUCE’ &
                    'ADAPT'
                    <br />
                    Licensee with the right to clone/reproduce and adapt/prepare
                    derivatives can also be granted the right to distribute
                    commercially his/her copies of the copyrighted work to the
                    public.
                    <br />
                    In this case an additional Royalty rate may apply.
                    <br />
                    **Reminder: Attribution for the original material will apply
                    for any derivative or adapted work, in the form of a
                    copyright notice indicating “adapted from the original work
                    by [author’s name] © [year]” in all adaptations displayed
                    and copies distributed.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="mt-8">
              <p className="text-base font-semibold leading-tight text-red-900">
                Other Specifications
              </p>
              <div className="flex flex-col space-y-2 items-start justify-start mt-6">
                <p className="text-sm font-semibold leading-tight text-gray-600">
                  LICENSE DURATION
                </p>
                <p className="text-xs leading-5 text-gray-500">
                  1 year [more options coming soon].
                </p>
                <p className="text-sm font-semibold leading-tight text-gray-600">
                  PRICE for the NFT with License. [in progress]
                </p>
                <p className="text-xs leading-5 text-gray-500">
                  ‍Licensor will set the sale price for the Digital Asset as
                  Genuine NFT payable to his wallet.
                  <br />
                  Then Smartists will add the License Fee to that price: 5 STX
                  License level 00; 10 STX License level 01; 20 STX License
                  level 02; 50 STX License level 03; 100 STX License level 04.
                  [in progress]
                  <br />
                  The buyer will pay a final price including the Genuine NFT +
                  the License Fee.
                  <br />
                  So the price to pay for every NFT is the sum of the a FIXED
                  License Fee + the art work Price decided by the author.
                </p>
                <p className="text-sm font-semibold leading-tight text-gray-600">
                  ROYALTY RATE [in progress]
                </p>
                <p className="text-xs leading-5 text-gray-500">
                  ‍‍Only in case of commercial distribution, the licensor will
                  also specify the Royalty rate to apply in case of commercial
                  distribution of the licensed materials.
                </p>
                <p className="text-sm font-semibold leading-tight text-gray-600">
                  ‍‍RENEWAL
                </p>
                <p className="text-xs leading-5 text-gray-500">
                  The License is set for Automatic Renewal in identical terms
                  upon confirmation by both parties within the 10 days prior to
                  the expiration.
                </p>
                <p className="text-sm font-semibold leading-tight text-gray-600">
                JURISDICTION
                </p>
                <p className="text-xs leading-5 text-gray-500">
                In case of any legal dispute related to this agreement in the physical world, parties agree to submit the present terms to the  law and tribunals the Licensor’s state of residence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SpecialTerms;
