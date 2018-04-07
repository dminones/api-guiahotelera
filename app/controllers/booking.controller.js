import BaseController from './base.controller';
import nodemailer from 'nodemailer';

let smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
	secure: true, // upgrade later with STARTTLS
	debug: true,
    auth: {
        user: 'info@guiahoteleraargentina.com',
        pass: 'Cactus2290'
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
				console.log(error);
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
