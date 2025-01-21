const imageurl = "https://i.ibb.co.com/L8sHZpt/All2Save.png";
export const emailTemplate = (otp: number, text: string) => `
<html>
<head>
    <style>
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                padding: 0 10px !important;
            }
            .logo img {
                width: 100px !important;
                height: auto !important;
            }
            .content h3 {
                font-size: 24px !important;
            }
            .content p {
                font-size: 14px !important;
            }
            .otp h1 {
                font-size: 28px !important;
            }
        }
        @media only screen and (max-width: 400px) {
            .content h3 {
                font-size: 20px !important;
            }
            .content p {
                font-size: 12px !important;
            }
            .otp h1 {
                font-size: 24px !important;
            }
        }
    </style>
</head>
<body>
    <table cellpadding="0" cellspacing="0" align="center" style="width:100%; table-layout:fixed; background-color:#f5f5f5;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" class="container" style="background-color:#ffffff; width:600px; border-collapse:collapse;">
                    <tr>
                        <td align="center" class="logo" style="padding:30px 20px;">
                            <img src=${imageurl} alt="Logo" width="200" height="200" style="display:block; border:0;"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" class="content" style="padding:10px 20px;">
                            <h3 style="margin:0; font-family:'Arial', sans-serif; font-size:46px; font-weight:bold; color:#333;">
                                Welcome to All2Save
                            </h3>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" class="content" style="padding:5px 40px;">
                            <p style="margin:0; font-family:'Arial', sans-serif; font-size:14px; color:#333;">
                                ${text}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding:10px 20px;">
                            <table cellpadding="0" cellspacing="0" style="width:100%; border:2px dashed #ccc; border-radius:5px;">
                                <tr>
                                    <td align="center" style="padding:20px;">
                                        <h3 style="margin:0; font-family:'Arial', sans-serif; font-size:26px; font-weight:bold; color:#333;">
                                            Your verification code is:
                                        </h3>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" class="otp" style="padding:10px 20px;">
                                        <h1 style="margin:0; font-family:'Arial', sans-serif; font-size:46px; font-weight:bold; color:#5c68e2;">
                                            ${otp}
                                        </h1>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
