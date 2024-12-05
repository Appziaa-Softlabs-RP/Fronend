import { enviroment } from "../../enviroment"

const ConactUsAdminTemplate = `<table
    cellspacing="0"
    cellpadding="0"
    style="margin: 0px auto; width: 100%; background-color: #fff"
    >
    <tbody>
        <tr>
        <td>
            <div
            style="
                background-color: #fff;
                border: 1px solid #eee;
                box-sizing: border-box;
                font-family: Lato, Helvetica, 'Helvetica Neue', Arial, 'sans-serif';
                margin: auto;
                max-width: 100%;
                overflow: hidden;
                width: 100%;
                max-width: 600px;
            "
            >

            <div
                style="
                padding: 16px 45px;
                background-color: #280b51;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-image: url(https://static.zohocdn.com/zeptomail/assets/images/circles.4ee9fbd3db3cd183c76b.svg);
                background-repeat: no-repeat;
                background-position: top right;
                background-size: 140px;
                "
            >
                <div style="width: 100%">
                <img
                    src="https://rewardsplus.in/public/frontend/assets/images/logo.png"
                    style="max-height: 40px"
                />
                </div>
            </div>

            <div style="padding: 20px 50px">
                <div>
                <span style="font-size: 16px">Hi Team,<br /></span>
                </div>
                <div><br /></div>
                <div>
                <span style="font-size: 16px"
                    >We've received a new inquiry through the "Contact Us" form on
                    the ${enviroment.BUSINESS_NAME} website. Below are the details:</span
                >
                </div>
                <div><br /></div>
                <div>
                <span style="font-size: 16px">Name: CustomerNameValue</span><br />
                </div>
                <div>
                <span style="font-size: 16px"
                    >Email: CustomerEmailValue</span><br />
                </div>
                <div>
                <span style="font-size: 16px"
                    >Phone: CustomerPhoneValue</span><br />
                </div>
                <div>
                <span style="font-size: 16px">Message: CustomerMessageValue</span
                ><br />
                </div>
                <div>
                <span style="font-size: 16px">Date: CurrentDateValue</span><br />
                </div>
                <div><br /></div>
                <div>
                <span style="font-size: 16px"
                    >Please review the inquiry and respond to the customer at your
                    earliest convenience. If you need any assistance or further
                    information, feel free to reach out.</span
                >
                </div>
                <div><br /></div>
                <div style="font-size: 16px">
                <span>Best,</span><br />
                <span>RewardsPlus</span>
                </div>
            </div>

            <div
                style="
                padding: 16px 30px;
                background-color: #280b51;
                color: #fff;
                text-align: center;
                font-size: 14px;
                "
            >
                <div style="margin-bottom: 10px; display: flex; justify-content: center; gap: 10px; align-items: center;">
                <a
                    href="https://www.instagram.com/rewardsplus/"
                    style="display: inline-block;"
                >
                    <img
                    src="https://rewardsplus.in/public/iconss/insta-white.svg"
                    alt="Instagram"
                    style="width: 24px; height: 24px;"
                    />
                </a>

                <a
                    href="https://www.facebook.com/myrewardsplus"
                    style="display: inline-block;"
                >
                    <img
                    src="https://rewardsplus.in/public/iconss/facebook-white.svg"
                    alt="Facebook"
                    style="width: 24px; height: 24px;"
                    />
                </a>
                <a
                    href="https://x.com/appziaa"
                    style="display: inline-block;"
                >
                    <img
                    src="https://rewardsplus.in/public/iconss/twitter-white.svg"
                    alt="WhatsApp"
                    style="width: 24px; height: 20px;"
                    />
                </a>
                <a
                    href="https://www.linkedin.com/company/rewardsplus/"
                    style="display: inline-block;"
                >
                    <img src="https://rewardsplus.in/public/iconss/linkedin-white.svg" alt="LinkedIn" style="display: block; max-width: 100%; height: auto; border: 0;" />
                </a>
                </div>
                <div style="margin-top: 10px; font-size: 12px;">
                    <p>24A/1, LGF, Shaheed Jeet Singh Marg, Block A, Katwaria Sarai, New Delhi, Delhi 110016</p>
                <p>Email: <span style="color: white;">support@rewardsplus.in</span></p>
                </div>
                <div
                style="
                    padding: 10px 0;
                    border-top: 1px solid #eee;
                    font-size: 12px;
                    color: #bbb;
                    margin-top: 20px;
                "
                >
                <p>
                        If you prefer not to receive our emails, please <a href="#" style="color: white;">click here</a> to unsubscribe.
                </p>
                </div>
            </div>
            </div>
        </td>
        </tr>
    </tbody>
</table>`

const ContactUsUserTemplate = `<table
  cellspacing="0"
  cellpadding="0"
  style="margin: 0px auto; width: 100%; background-color: #fff"
>
  <tbody>
    <tr>
      <td>
        <div
          style="
            background-color: #fff;
            border: 1px solid #eee;
            box-sizing: border-box;
            font-family: Lato, Helvetica, 'Helvetica Neue', Arial, 'sans-serif';
            margin: auto;
            max-width: 100%;
            overflow: hidden;
            width: 100%;
            max-width: 600px;
          "
        >
          <div
            style="
              padding: 16px 45px;
              background-color: #1E2247;
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              background-image: url(https://static.zohocdn.com/zeptomail/assets/images/circles.4ee9fbd3db3cd183c76b.svg);
              background-repeat: no-repeat;
              background-position: top right;
              background-size: 140px;
            "
          >
            <div style="width: 100%">
              <img
                src="https://mrpc.rwps.in/static/media/site_logo.6b7c4f872947716c5fbb.png"
                style="max-height: 40px"
              /><br />
            </div>
          </div>
          <div style="padding: 20px 50px">
            <div>
              <span class="size" style="font-size: 16px"
                >Dear CustomerNameValue,<br
              /></span>
            </div>
            <div>
              <span class="size" style="font-size: 16px"><br /></span>
            </div>
            <div>
              <span class="size" style="font-size: 16px"
                >Thank you for reaching out to us at ${enviroment.BUSINESS_NAME}! We have received
                your message and our team is here to help.<br
              /></span>
            </div>
            <div>
              <span class="size" style="font-size: 16px"><br /></span>
            </div>
            <div>
              <span class="size" style="font-size: 16px"
                >A member of our customer support team will review your inquiry
                and get back to you within 1-2 business days.</span
              ><br />
            </div>
            <div>
              <span class="size" style="font-size: 16px"><br /></span>
            </div>
            <div>
              <span class="size" style="font-size: 16px"
                >In the meantime, feel free to explore
                <a href="https://mrpc.rwps.in/" target="_blank">our website</a>
                for the latest products and updates.<br
              /></span>
            </div>
            <div>
              <span class="size" style="font-size: 16px"><br /></span>
            </div>
            <div>
              <span class="size" style="font-size: 16px"
                >We appreciate your interest in ${enviroment.BUSINESS_NAME} and look forward to
                assisting you!<br
              /></span>
            </div>
            <div><br /></div>
            <div>
              <span class="size" style="font-size: 16px">Warm Regards,</span
              ><br />
            </div>
            <div>
              <span class="size" style="font-size: 16px">Team ${enviroment.BUSINESS_NAME}</span
              ><br />
            </div>
            <div>
              <span class="size" style="font-size: 16px">${enviroment.PHONE_NUMBER}</span
              ><br />
            </div>
            <div><span class="size" style="font-size: 16px"></span><br /></div>
          </div>
          <div
            style="
              padding: 16px 30px;
              background-color: #1E2247;
              color: #fff;
              text-align: center;
              font-size: 14px;
            "
          >
            <div
              style="
                margin-bottom: 10px;
                display: flex;
                justify-content: center;
                gap: 10px;
                align-items: center;
              "
            >
            ${enviroment.INSTAGRAM_LINK ?
                    `<a href="${enviroment.INSTAGRAM_LINK}" style="display: inline-block"
                            ><img
                            src="https://rewardsplus.in/public/iconss/insta-white.svg"
                            alt="Instagram"
                            style="width: 24px; height: 24px"
                            width="24"
                            height="24"
                            />
                        </a>` : ''
                }
            ${enviroment.FACEBOOK_LINK ?
                    `<a href="${enviroment.FACEBOOK_LINK}" style="display: inline-block"
                            ><img
                            src="https://rewardsplus.in/public/iconss/facebook-white.svg"
                            alt="Facebook"
                            style="width: 24px; height: 24px"
                            width="24"
                            height="24"
                            />
                        </a>` : ''
                }
            ${enviroment.TWITTER_LINK ?
                    `<a href="${enviroment.TWITTER_LINK}" style="display: inline-block"
                            ><img
                            src="https://rewardsplus.in/public/iconss/twitter-white.svg"
                            alt="Twitter"
                            style="width: 24px; height: 24px"
                            width="24"
                            height="24"
                            />
                        </a>` : ''
                }
            ${enviroment.LINKEDIN_LINK ?
                    `<a href="${enviroment.LINKEDIN_LINK}" style="display: inline-block"
                            ><img
                            src="https://rewardsplus.in/public/iconss/linkedin-white.svg"
                            alt="Linkedin"
                            style="width: 24px; height: 24px"
                            width="24"
                            height="24"
                            />
                        </a>` : ''
                }
            <br />
            </div>
            <div style="margin-top: 10px; font-size: 12px">
              <p>
                ${enviroment.STORE_ADDRESS}
              <br />
              </p>
              <p>Email: ${enviroment.EMAIL_ADDRESS}<br /></p>
            </div>
            <div
              style="
                padding: 10px 0;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #bbb;
                margin-top: 20px;
              "
            >
              <p>
                If you prefer not to receive our emails, please
                <a href="#" style="color: white">click here</a> to
                unsubscribe.<br />
              </p>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</table>
`

export const getContactUsUserEmailTemplate = ({ name }) => {
    return ContactUsUserTemplate.replace('CustomerNameValue', name)
}

export const getContactUsAdminEmailTemplate = ({ name, email, phone, message }) => {
    return ConactUsAdminTemplate.replace('CustomerNameValue', name)
        .replace('CustomerEmailValue', email)
        .replace('CustomerPhoneValue', phone)
        .replace('CustomerMessageValue', message)
        .replace('CurrentDateValue', new Date().toLocaleDateString())
}