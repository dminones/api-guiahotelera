import BaseController from './base.controller';
import nodemailer from 'nodemailer';
import config from '../config/constants';

const transporter = nodemailer.createTransport(config.smtpConfig);

class BookingController extends BaseController {
  book = async (req, res, next) => {
    const site = config.getSite(req.params.site);
    const formData = req.body;
    const message = {
      from: 'consultas@guiaohoteleraargentina.com',
      to: formData.to,
      subject: 'Consulta de ' + site.name,
      text: `
      ${formData.itemName ? `${formData.itemName}. ` : ''}
      Ha recibido la siguiente consulta de ${site.name}
      ${formData.url}
      --------------------------------------------------------        
      Nombre: ${formData.name}
      Email: ${formData.email}
      Asunto: ${formData.subject}
      Consulta: ${formData.message}
      `,
    };
    transporter.sendMail(message, (error) => {
      if (error) {
        console.log(error);
        res.json({
          error: 'No pudo enviarse el mensaje. Por favor intente más tarde',
        });
      } else {
        res.json({
          response: 'Mensaje enviado con exito',
        });
      }
    });
  };
}

export default new BookingController();
