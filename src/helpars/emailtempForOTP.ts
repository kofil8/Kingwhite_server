export const emailTemplate = (otp: number, text: string) => `<!DOCTYPE html>
    <table cellpadding="0" cellspacing="0" align="center" style="width:100%; table-layout:fixed; background-color:#f5f5f5;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" style="background-color:#ffffff; width:600px; border-collapse:collapse;">
                    <tr>
                        <td align="center" style="padding:30px 20px;">
                            <img src="../../All2Save.png" alt="Logo" width="200" style="display:block; border:0;"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding:10px 20px;">
                            <h3 style="margin:0; font-family:'Arial', sans-serif; font-size:46px; font-weight:bold; color:#333;">
                                Welcome to All2Save
                            </h3>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding:5px 40px;">
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
                                    <td align="center" style="padding:10px 20px;">
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
    </table>`;
