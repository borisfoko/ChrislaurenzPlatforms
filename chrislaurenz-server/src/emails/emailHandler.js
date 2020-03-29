var nodemailer = require('nodemailer');

var emaiTemplate = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" href="assets/images/favicon/1.png" type="image/x-icon">
        <link rel="shortcut icon" href="assets/images/favicon/1.png" type="image/x-icon">
        <title>ChrisLaurenz | More then jsut fashion </title>
        <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900" rel="stylesheet">

        <style type="text/css">
            body{
            	text-align: center;
            	margin: 0 auto;
            	width: 650px;
            	font-family: 'Lato', sans-serif;
            	background-color: #e2e2e2;		      	
            	display: block;
            }
            ul{
            	margin:0;
            	padding: 0;
            }
            li{
            	display: inline-block;
            	text-decoration: unset;
            }
            a{
            	text-decoration: none;
            }
            h5{
            	margin:10px;
            	color:#777;
            }
            .text-center{
            	text-align: center
            }
            .main-bg-light{
            	background-color: #fafafa;
            }
            .title{
            	color: #444444;
            	font-size: 22px;
            	font-weight: bold;
            	margin-top: 0px;
            	margin-bottom: 10px;
            	padding-bottom: 0;
            	text-transform: uppercase;
            	display: inline-block;
            	line-height: 1;
            }
            .menu{
            width:100%;
            }
            .menu li a{
            	text-transform: capitalize;
            	color:#444;
            	font-size:16px;
            	margin-right:15px
            }
            .main-logo{
            	width: 180px;
            	padding: 10px 20px;
                margin-bottom: -5px;
            }
            .footer-social-icon tr td img{
            	margin-left:5px;
            	margin-right:5px;
            }
        </style>
    </head>
    <body style="margin: 20px auto;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="background-color: #fff; -webkit-box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);">
            <tbody>
                <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="5" width="100%">
                            <tr class="header">
                                <td align="left" valign="center" style="padding: 5px; margin: 5px">
                                    <a href="https://www.chrislaurenz.de/" target="_blan" style="font-size:24px; line-height:18px; text-align:center; text-transform:uppercase; color:#ff4c3b; font-weight:bold;">CL</a>
                                </td>
                                <td class="menu" align="right">
                                    <ul>
                                        <li><a href="https://www.chrislaurenz.de/" target="_blan">Home</a></li>
                                        <li><a href="https://www.chrislaurenz.de/#/wishlist" target="_blan">whishlist_placeholder</a></li>
                                        <li><a href="https://www.chrislaurenz.de/#/contact" target="_blan">contact_placeholder</a></li>
                                    </ul>
                                </td>
                            </tr>
                        </table>
                        <table class="main-bg-light text-center" align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <th style="padding: 30px;">
                                    <table align="center">
                                        <tr>
                                            <td align="left" valign="center" style="padding: 5px; margin: 5px">
                                                <a href="https://www.chrislaurenz.de/" target="_blan" style="font-size:24px; line-height:18px; text-align:center; text-transform:uppercase; color:#ff4c3b; font-weight:bold;">ChrisLaurenz</a>
                                            </td>
                                        </tr>
                                    </table>
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
											<h4 class="title" style="width: 100%; text-align:center;margin-top: 50px;">confirmation_email_title_placeholder</h4>
											<p style="font-size:20px; margin:0">confirmation_email_thanks_placeholder</p>
											<p style="font-size:14px; margin:20px;">confirmation_email_text</p>
										</tr>
                                    </table>
                                    <table align="center">
                                        <tr>
                                            <td style="font-size:14px; line-height:18px; text-align:center; text-transform:uppercase; padding:10px; background:#fffff; color:#11bfff; font-weight:bold;"><a href="confirmation_link_url_value" target="_blan" style="text-decoration: underline;">confirmation_email_button</a></td>
                                        </tr>
										<tr>
                                            <td style="font-size:14px; line-height:18px; text-align:center; padding:10px;"><p>confirmation_link_url_text: <a href="confirmation_link_url_value" target="_blan" style="text-decoration: none;">confirmation_link_url_value</a></p></td>
                                        </tr>
										<tr>
											<td style="padding: 5px; margin: 5px">
												<a href="https://www.chrislaurenz.de/" target="_blan" style="font-size:36px; text-align:center; text-transform:uppercase; color:#ff4c3b; font-weight:bold;">CL</a>
											</td>
										</tr>
										<tr>
											<td>
												<a href="https://www.chrislaurenz.de/" target="_blan" style="font-size:12px; text-align:center; color:#ff4c3b; font-weight:bold;">ChrisLaurenz</a>
											</td>
										</tr>
                                    </table>
                                </th>
                            </tr>
                        </table>
                        <table class="main-bg-light text-center"  align="center" border="0" cellpadding="0" cellspacing="0" width="100%"">
                            <tr>
                                <td style="padding: 30px;">
                                    <div>
                                        <h4 class="title" style="margin:0">email_follow_us_text</h4>
                                    </div>
                                    <table border="0" cellpadding="5" cellspacing="5" class="footer-social-icon" align="center" class="text-center" style="margin-top:20px;">
                                        <tr>
                                            <td>
                                                <a href="https://www.facebook.com/chrislaurenz2020/" target="_blan">Facebook</a>
                                            </td>
                                            <td>
                                                <a href="https://www.youtube.com/chrislaurenz2020/" target="_blan">Youtube</a>
                                            </td>
                                            <td>
                                                <a href="https://www.twitter.com/chrislaurenz2020/" target="_blan">Twitter</a>
                                            </td>
                                            <td>
                                                <a href="https://www.instagram.com/chrislaurenz2020/" target="_blan">Instagram</a>
                                            </td>
                                            <td>
                                                <a href="https://www.pinterest.com/chrislaurenz2020/" target="_blan">Pinterest</a>
                                            </td>
                                        </tr>                                    
                                    </table>
                                    <div style="border-top: 1px solid #ddd; margin: 20px auto 0;"></div>
                                    <table  border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px auto 0;" >
                                        <tr>
                                            <td>
                                                <p style="font-size:13px; margin:0;">2020 Copy Right by ChrisLaurenz powerd by <a href="https://bfklogic.de/" target="_blan">BFK Logic Solutions</a></p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        
                    </td>
                </tr>
            </tbody>            
        </table>
    </body>
</html>`;

const transporter = nodemailer.createTransport({
    host: 'mx2e39.netcup.net',
    port: 465,
    auth: {
        user:'info.admin@chrislaurenz.de',
        pass: 'RomsteanyDraussenTrouvailleLhmime9429'
    }
});

exports.sendVerificationMail = (email, message) => {
    var htmlContent = emaiTemplate.replace(/whishlist_placeholder/gi, message.whishlist);
    htmlContent = htmlContent.replace(/contact_placeholder/gi, message.contact);
    htmlContent = htmlContent.replace(/confirmation_email_title_placeholder/gi, message.subject);
    htmlContent = htmlContent.replace(/confirmation_email_thanks_placeholder/gi, message.thanks);
    htmlContent = htmlContent.replace(/confirmation_email_text/gi, message.descriptionText);
    htmlContent = htmlContent.replace(/confirmation_email_button/gi, message.linkText);
    htmlContent = htmlContent.replace(/confirmation_link_url_text/gi, message.urlDesc);
    htmlContent = htmlContent.replace(/confirmation_link_url_value/gi, message.url);
    htmlContent = htmlContent.replace(/email_follow_us_text/gi, message.followUs);
    var mailOptions = {
        from: '"Chris, Laurenz" no-reply@chrislaurenz.de',
        to: email,
        subject: message.subject,
        html: htmlContent
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            //console.log(error);
            return;
        }
        else{
            //console.log('Email sent: ' + info.response);
            return;
        }
    })
}