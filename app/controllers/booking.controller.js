import BaseController from './base.controller';
import nodemailer from 'nodemailer';

let smtpConfig = {
    host: 'cr1.toservers.com',
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
        user: 'consultas@guiahotelerabolivia.com',
        pass: 'ruben4910'
    }
};
const transporter = nodemailer.createTransport(smtpConfig)

class BookingController extends BaseController {
	
	book = async(req, res, next) => {
	    const formData = req.body
	    var message = {
	        from: 'consultas@guiahotelerabolivia.com',
	        to: formData.to,
	        subject: 'Consulta de Guia Hotelera Bolivia',
	        text: `
	        Ha recibido la siguiente consulta de Guia Hotelera Bolivia
	        www.guiahotelerabolivia.com
	        --------------------------------------------------------
	        Nombre: ${formData.name}
	        Email:  ${formData.email}
	        Asunto:  ${formData.subject}
	        Consulta:  ${formData.message}
	      `,
	    }
	    transporter.sendMail(message, (error) => {
	        if (error) {
	            res.json({
	                error: "No pudo enviarse el mensaje. Por favor intente más tarde"
	            })
	        } else {
	            res.json({
	                response: "Mensaje enviado con exito"
	            })
	        }
	    })
	}
}

export default new BookingController();