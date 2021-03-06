import { parseISO } from "date-fns";
import { Router } from "express";
import { getCustomRepository } from "typeorm";

import AppointmentRepository from "../repositories/AppointmentsRepository";
import CreateAppointmentServer from "../services/CreateAppointmentServer";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/',async (request, response) =>{
    const appointmentRepository = getCustomRepository(AppointmentRepository);

    const appointments = await appointmentRepository.find();

    return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) =>{

        const { provider_id, date } = request.body;

        const parsedDate = parseISO(date);

        const createAppointment = new CreateAppointmentServer();

        const appointment = await createAppointment.execute({
            date: parsedDate,
            provider_id,
        });

        return response.json(appointment);

});

export default appointmentsRouter;
